import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { evaluateAll } from "../gemini";

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    questions = [],
    answers = [],
    expectedAnswers = [],
  } = location.state || {};

  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasEvaluated = useRef(false);

  useEffect(() => {
    const fetchEvaluations = async () => {
      // Prevent multiple calls
      if (hasEvaluated.current || questions.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        hasEvaluated.current = true; // Mark as evaluated
        
        console.log("Starting evaluation...");
        const results = await evaluateAll(questions, answers, expectedAnswers);
        console.log("Evaluation completed");
        
        setEvaluations(results);
      } catch (err) {
        console.error("Error fetching evaluations:", err);
        setError("Failed to load evaluations. Please try again.");
        hasEvaluated.current = false; // Reset on error so user can retry
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluations();
  }, [questions, answers, expectedAnswers]);

  const goBack = () => navigate("/dashboard");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Evaluating your answers...</h2>
          <p className="text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Evaluation Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
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
              {answers[i] || "❌ No Answer"}
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
