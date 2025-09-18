const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

function initDb() {
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      category TEXT,
      total_questions INTEGER NOT NULL,
      overall_score INTEGER,
      improved INTEGER,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_interviews_user ON interviews(user_id, created_at DESC);

    CREATE TABLE IF NOT EXISTS interview_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      interview_id INTEGER NOT NULL,
      question_idx INTEGER NOT NULL,
      question TEXT NOT NULL,
      expected_answer TEXT,
      answer TEXT,
      score INTEGER,
      feedback TEXT,
      FOREIGN KEY(interview_id) REFERENCES interviews(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_items_interview ON interview_items(interview_id, question_idx);
  `);
}

module.exports = { db, initDb };


