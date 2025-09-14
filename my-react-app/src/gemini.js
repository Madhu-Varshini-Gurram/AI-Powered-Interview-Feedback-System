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
