import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { evaluateAll } from "../gemini";
import { useUser } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const {
    questions = [],
    answers = [],
    expectedAnswers = [],
  } = location.state || {};
  const category = (location.state && location.state.category) || "Interview";
  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasEvaluated = useRef(false);

  useEffect(() => {
    const fetchEvaluations = async () => {
      setIsLoading(true);
      setError(null);
      hasEvaluated.current = true;

      console.log("Starting evaluation...");

      try {
        // Start AI evaluation
        const aiPromise = evaluateAll(questions, answers, expectedAnswers);

        // Add minimum delay (4.5s for spinner)
        const delayPromise = new Promise((resolve) => setTimeout(resolve, 4500));

        // Wait for both AI and delay
        const results = await aiPromise;
        await delayPromise;

        console.log("Evaluation completed");

        // 🔹 Force rating = 0 if no answer, but keep AI feedback
        const fixedResults = results.map((res, i) => {
          if (!answers[i] || answers[i] === "❌ No Answer") {
            return { ...res, rating: 0 };
          }
          return res;
        });

        setEvaluations(fixedResults);

        // Save to backend
        try {
          const payload = {
            userId: user?.id || "anon",
            category,
            questions,
            answers,
            expectedAnswers,
          };
          await fetch(`${API_BASE}/api/interviews/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (e) {
          console.warn('Failed to save interview:', e);
        }
      } catch (err) {
        console.error("Error fetching evaluations:", err);
        setError("Failed to load evaluations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluations();
  }, []); // only once on mount

  const goBack = () => navigate("/career-options");

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: "120px",
            height: "120px",
            border: "10px solid #ddd",
            borderTop: "10px solid #007bff",
            borderRadius: "50%",
            marginBottom: "40px",
            animation: "spin 1s linear infinite",
          }}
        ></div>

        <h1
          style={{
            fontSize: "40px",
            color: "#333",
            marginBottom: "20px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          AI is Processing Your Interview
        </h1>

        <p
          style={{
            fontSize: "22px",
            color: "#666",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          Please wait few seconds while AI analyzes your answers...
        </p>

        {/* Progress bar */}
        <div
          style={{
            width: "500px",
            height: "10px",
            backgroundColor: "#ddd",
            borderRadius: "5px",
            marginBottom: "30px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#007bff",
              borderRadius: "5px",
              animation: "progress 9s linear infinite",
            }}
          ></div>
        </div>

        {/* Loading text */}
        <div
          style={{
            fontSize: "20px",
            color: "#007bff",
            fontWeight: "bold",
            animation: "pulse 2s infinite",
          }}
        >
          Generating AI Response...
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
              }
            `,
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
        📊 Interview Summary
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {evaluations.map((evalResult, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-200"
          >
            <h2 className="font-semibold text-lg text-gray-800">
              Q{i + 1}: {evalResult.question}
            </h2>

            <p className="mt-3 text-gray-700">
              <span className="font-semibold">🧑 Your Answer:</span>{" "}
              {answers[i] && answers[i] !== "" ? answers[i] : "❌ No Answer"}
            </p>

            <p className="mt-2 text-gray-700">
              <span className="font-semibold">✅ Expected Answer:</span>{" "}
              {evalResult.expected_answer || "—"}
            </p>

            <p className="mt-3 text-gray-700">
              <span className="font-semibold">💡 Feedback:</span>{" "}
              {evalResult.feedback || "—"}
            </p>

            <p className="mt-3 font-bold text-blue-600">
              Score:{" "}
              {evalResult.rating !== undefined
                ? evalResult.rating + " / 5"
                : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={goBack}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
