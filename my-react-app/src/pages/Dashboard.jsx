import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen pt-24 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Welcome to Your Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Select one of the options below to begin your interview preparation.
      </p>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-blue-700 mb-3">HR Interview</h3>
          <p className="text-gray-600 mb-4">Practice HR-style questions focusing on personality, teamwork, and behavior.</p>
          <button onClick={() => navigate("/hr-interview")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Start HR Interview
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Mock Practice</h3>
          <p className="text-gray-600 mb-4">Run a full mock interview session to test your skills and get instant feedback.</p>
          <button onClick={() => navigate("/mock-interview")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Start Mock Practice
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Technical Interview</h3>
          <p className="text-gray-600 mb-4">Prepare for technical questions with AI-driven coding and theory evaluations.</p>
          <button onClick={() => navigate("/technical-interview")} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
            Start Technical Interview
          </button>
        </div>
      </div>
    </div>
  );
}
