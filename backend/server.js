const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { db, initDb } = require('./sqlite');

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: false }));
app.use(express.json({ limit: '5mb' }));

// Root
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Interview Feedback API', docs: '/api/health' });
});

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Submit a completed interview (single call)
// Body: { userId, category, questions: string[], answers: string[], expectedAnswers: string[] }
app.post('/api/interviews/submit', (req, res) => {
  const { userId, category, questions, answers, expectedAnswers } = req.body || {};
  if (!userId || !Array.isArray(questions) || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'userId, questions, answers required' });
  }
  const qLen = questions.length;
  if (answers.length !== qLen) {
    return res.status(400).json({ error: 'questions and answers length mismatch' });
  }

  const computeScore = (answer, expected) => {
    if (!answer || !expected) return 0;
    const a = String(answer).toLowerCase();
    const e = String(expected || '').toLowerCase();
    const expectedTokens = Array.from(new Set(e.split(/[^a-z0-9]+/).filter(Boolean)));
    if (expectedTokens.length === 0) return Math.min(100, Math.max(0, a.length > 20 ? 60 : 30));
    let hits = 0;
    for (const tok of expectedTokens) {
      if (a.includes(tok)) hits += 1;
    }
    const coverage = hits / expectedTokens.length;
    const lengthBoost = Math.min(1, a.split(/\s+/).filter(Boolean).length / 60);
    return Math.round((0.8 * coverage + 0.2 * lengthBoost) * 100);
  };

  const computeFeedback = (answer, expected) => {
    const score = computeScore(answer, expected);
    if (score >= 80) return { score, feedback: 'Strong, well-aligned answer.' };
    if (score >= 60) return { score, feedback: 'Good, but add more detail and examples.' };
    if (score >= 40) return { score, feedback: 'Partial coverage. Address missing key points.' };
    return { score, feedback: 'Needs improvement. Structure your response and hit core concepts.' };
  };

  const tx = db.transaction(() => {
    const insertInterview = db.prepare(
      "INSERT INTO interviews (user_id, category, total_questions, created_at) VALUES (?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))"
    );
    const result = insertInterview.run(userId, category || 'general', qLen);
    const interviewId = result.lastInsertRowid;

    const insertItem = db.prepare(
      'INSERT INTO interview_items (interview_id, question_idx, question, expected_answer, answer, score, feedback) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    let totalScore = 0;
    for (let i = 0; i < qLen; i += 1) {
      const q = questions[i] || '';
      const a = answers[i] || '';
      const exp = (expectedAnswers && expectedAnswers[i]) || '';
      const { score, feedback } = computeFeedback(a, exp);
      totalScore += score;
      insertItem.run(interviewId, i, q, exp, a, score, feedback);
    }
    const overall = Math.round(totalScore / qLen);

    // Compute improvement vs last interview
    const last = db.prepare(
      'SELECT overall_score FROM interviews WHERE user_id = ? AND id <> ? ORDER BY created_at DESC LIMIT 1'
    ).get(userId, interviewId);
    const improved = last ? overall >= last.overall_score : null;

    db.prepare('UPDATE interviews SET overall_score = ?, improved = ? WHERE id = ?')
      .run(overall, improved === null ? null : improved ? 1 : 0, interviewId);

    return { interviewId, overall, improved };
  });

  try {
    const result = tx();
    res.json({ ok: true, ...result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save interview' });
  }
});

// Get my past interviews
// Query: ?userId=clerk_user_id
app.get('/api/me/interviews', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const rows = db.prepare(
    'SELECT id, category, total_questions, overall_score, improved, created_at FROM interviews WHERE user_id = ? ORDER BY created_at DESC'
  ).all(userId);

  res.json({ items: rows });
});

// Get details of one interview
app.get('/api/interviews/:id', (req, res) => {
  const id = Number(req.params.id);
  const headerUserId = req.query.userId;
  if (!id || !headerUserId) return res.status(400).json({ error: 'id and userId required' });

  const meta = db.prepare('SELECT * FROM interviews WHERE id = ? AND user_id = ?').get(id, headerUserId);
  if (!meta) return res.status(404).json({ error: 'Not found' });
  const items = db.prepare('SELECT question_idx, question, expected_answer, answer, score, feedback FROM interview_items WHERE interview_id = ? ORDER BY question_idx ASC').all(id);
  res.json({ interview: meta, items });
});

// Delete an interview
app.delete('/api/interviews/:id', (req, res) => {
  const id = Number(req.params.id);
  const headerUserId = req.query.userId;
  if (!id || !headerUserId) return res.status(400).json({ error: 'id and userId required' });

  const tx = db.transaction(() => {
    // Check if interview exists and belongs to user
    const interview = db.prepare('SELECT id FROM interviews WHERE id = ? AND user_id = ?').get(id, headerUserId);
    if (!interview) return false;

    // Delete interview items first (foreign key constraint)
    db.prepare('DELETE FROM interview_items WHERE interview_id = ?').run(id);
    // Delete interview
    db.prepare('DELETE FROM interviews WHERE id = ?').run(id);
    return true;
  });

  try {
    const deleted = tx();
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete interview' });
  }
});

// Get overall stats for user
app.get('/api/me/stats', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total_interviews,
      AVG(overall_score) as average_score,
      MAX(overall_score) as best_score,
      MIN(overall_score) as worst_score,
      COUNT(CASE WHEN improved = 1 THEN 1 END) as improved_count,
      COUNT(CASE WHEN improved = 0 THEN 1 END) as declined_count
    FROM interviews 
    WHERE user_id = ? AND overall_score IS NOT NULL
  `).get(userId);

  res.json({ 
    total_interviews: stats.total_interviews || 0,
    average_score: Math.round(stats.average_score || 0),
    best_score: stats.best_score || 0,
    worst_score: stats.worst_score || 0,
    improved_count: stats.improved_count || 0,
    declined_count: stats.declined_count || 0
  });
});

// Initialize DB and start server
initDb();
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


