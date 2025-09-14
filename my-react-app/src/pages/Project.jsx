// src/pages/Project.jsx
import { Link } from "react-router-dom";

export default function Project() {
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <section className="text-center py-16 px-6">
        <h1 className="text-5xl font-bold text-blue-700 mb-6">
          AI-Powered Interview Feedback System
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          Our project leverages Artificial Intelligence and Data Science to
          analyze interview responses, assess candidate performance, and provide
          constructive feedback. The system evaluates communication, confidence,
          technical accuracy, and emotional tone to help candidates improve
          before real interviews.
        </p>

        {/* Buttons above cards */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
          >
            Create Account
          </Link>
        </div>

        {/* ✅ Feature Cards Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-blue-700 mb-3">🚀 AI Analysis</h3>
            <p className="text-gray-600">
              Get instant AI-powered insights on your answers with feedback on
              strengths and weaknesses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-green-700 mb-3">🎤 Realistic Mock</h3>
            <p className="text-gray-600">
              Simulate HR, technical, and full mock interviews anytime, anywhere
              with smart question banks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-purple-700 mb-3">📈 Progress Tracking</h3>
            <p className="text-gray-600">
              Track your improvement over time with detailed reports and
              performance charts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
