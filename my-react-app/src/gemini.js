import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBhWaLXTWOoXmc9zfOFekT-oSsox-NbVUo";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function evaluateAll(questions, answers, expectedAnswers) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const qaPairs = questions.map((q, i) => ({
    question: q,
    user_answer: answers[i] || "",
    expected_answer: expectedAnswers[i] || "",
  }));

  const prompt = `
You are an AI interview evaluator. 
For each Q&A below:
- Compare the user's answer to the expected answer
- Give constructive feedback
- Provide a rating out of 5
- Restate the correct expected answer clearly

Return a strict JSON array, one object per question:

[
  {
    "question": "...",
    "feedback": "...",
    "rating": number,
    "expected_answer": "..."
  }
]

Here are the Q&A pairs:
${JSON.stringify(qaPairs, null, 2)}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanText = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("Gemini Evaluation Error:", err);
    
    // Handle quota exceeded error specifically
    if (err.message && err.message.includes("quota")) {
      console.warn("Gemini API quota exceeded. Using fallback evaluation.");
      return questions.map((q, i) => ({
        question: q,
        feedback: "⚠️ AI evaluation unavailable due to quota limit. Please try again tomorrow or upgrade your Gemini API plan. Your answers have been recorded for review.",
        rating: 3, // Default neutral rating
        expected_answer: expectedAnswers[i] || "Not available",
      }));
    }
    
    // Handle other errors
    return questions.map((q, i) => ({
      question: q,
      feedback: "❌ AI evaluation temporarily unavailable. Please try again later.",
      rating: 0,
      expected_answer: expectedAnswers[i] || "Not available",
    }));
  }
}

/**
 * Generate interview questions and concise expected answers for a given category.
 * Returns an array of { question, expected_answer } objects, length == count when possible.
 * Caches per user/interviewId for stability during a session.
 *
 * @param {object} params
 * @param {string} params.interviewId - e.g., "hr-interview"
 * @param {string} params.userId - current user id or "anon"
 * @param {string} params.category - brief topic (e.g., "HR behavioral", "Technical general", "Mock interview")
 * @param {number} [params.count=5] - number of items to generate
 * @param {Array<{question:string, expected_answer:string}>} [params.fallback=[]] - used on errors/quota
 * @returns {Promise<Array<{question:string, expected_answer:string}>>}
 */
export async function generateInterviewQA({ interviewId, userId, category, count = 5, fallback = [] }) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Cache key to keep results stable for a user+interview run
  const storageKey = `aiQA:${userId || "anon"}:${interviewId}:${count}`;
  try {
    const cached = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch (_) {}

  const prompt = `You are an expert interview question generator. Generate ${count} high-quality ${category} interview questions for a candidate. For each question, provide a concise and accurate expected answer that a strong candidate would give.

Return ONLY a strict JSON array with exactly ${count} objects, each of the form:
[
  { "question": "...", "expected_answer": "..." }
]

Constraints:
- Avoid duplicates and ensure variety across topics.
- Keep expected_answer concise (1-2 sentences), objective, and non-personal.
- Do not include explanations outside of JSON.
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanText = responseText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanText);
    const items = Array.isArray(parsed) ? parsed : [];
    const normalized = items
      .filter((it) => it && typeof it.question === "string" && typeof it.expected_answer === "string")
      .slice(0, count);

    if (normalized.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(normalized));
      } catch (_) {}
      return normalized;
    }
  } catch (err) {
    console.error("Gemini Question Gen Error:", err);
    // fall through to fallback
  }

  // Fallback to provided defaults mapped to the unified shape
  if (Array.isArray(fallback) && fallback.length > 0) {
    return fallback.slice(0, count);
  }
  return [];
}
