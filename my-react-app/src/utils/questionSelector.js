// Utility for selecting randomized, non-repeating interview questions per user and interview id

/**
 * Returns a stable, randomized selection of questions/answers for a given user and interview.
 * Ensures the newly selected indices differ from the most recent selection when possible.
 * Falls back to any random selection if pool is too small to avoid overlap.
 *
 * Stored in localStorage under key: questionHistory:{userId}:{interviewId}
 * The value is JSON: { indices: number[], ts: number }
 *
 * @param {string} interviewId
 * @param {string[]} poolQuestions
 * @param {string[]} poolExpectedAnswers
 * @param {string} userId
 * @param {number} count
 * @returns {{ questions: string[], expectedAnswers: string[] }}
 */
export function selectQuestionsForUser(
  interviewId,
  poolQuestions,
  poolExpectedAnswers,
  userId,
  count = 5
) {
  const safeQuestions = Array.isArray(poolQuestions) ? poolQuestions : [];
  const safeAnswers = Array.isArray(poolExpectedAnswers) ? poolExpectedAnswers : [];
  const poolSize = Math.min(safeQuestions.length, safeAnswers.length);

  const effectiveCount = Math.min(count, poolSize);

  const storageKey = `questionHistory:${userId || "anon"}:${interviewId}`;
  let last = null;
  try {
    last = JSON.parse(localStorage.getItem(storageKey) || "null");
  } catch (_) {
    last = null;
  }

  // Build a list of indices [0..poolSize-1]
  const indices = Array.from({ length: poolSize }, (_, i) => i);

  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const lastSet = new Set(Array.isArray(last?.indices) ? last.indices : []);

  // Prefer indices that are not in last selection
  const fresh = indices.filter((i) => !lastSet.has(i));
  const selection = [];

  for (let i = 0; i < fresh.length && selection.length < effectiveCount; i++) {
    selection.push(fresh[i]);
  }
  // If not enough fresh, fill from remaining indices (could include overlap)
  if (selection.length < effectiveCount) {
    for (let i = 0; i < indices.length && selection.length < effectiveCount; i++) {
      if (!selection.includes(indices[i])) selection.push(indices[i]);
    }
  }

  // Persist the new selection
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ indices: selection, ts: Date.now() })
    );
  } catch (_) {}

  const selectedQuestions = selection.map((idx) => safeQuestions[idx]);
  const selectedAnswers = selection.map((idx) => safeAnswers[idx]);
  return { questions: selectedQuestions, expectedAnswers: selectedAnswers };
}


