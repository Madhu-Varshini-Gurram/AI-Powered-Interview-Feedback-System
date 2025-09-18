import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function InterviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [interview, setInterview] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const userId = user?.id;
        if (!userId) return;
        
        const res = await fetch(`${API_BASE}/api/interviews/${id}?userId=${encodeURIComponent(userId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        
        setInterview(data.interview);
        setItems(data.items || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id, user?.id]);

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!interview) return <div className="text-center text-gray-600">Interview not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-blue-700 mb-2">{interview.category || 'Interview'}</h1>
              <p className="text-gray-600">Completed on {new Date(interview.created_at).toLocaleString()}</p>
              <p className="text-gray-600">Total Questions: {interview.total_questions}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600 mb-2">{interview.overall_score || 0}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
              {interview.improved === null && <div className="text-sm text-gray-500">First attempt</div>}
              {interview.improved === 1 && <div className="text-sm text-green-600">Improved ✅</div>}
              {interview.improved === 0 && <div className="text-sm text-red-600">Declined ❌</div>}
            </div>
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Question {item.question_idx + 1}: {item.question}
              </h3>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Your Answer:</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">{item.answer || "No answer provided"}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Expected Answer:</h4>
                <p className="text-gray-600 bg-blue-50 p-3 rounded">{item.expected_answer || "No expected answer"}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Feedback:</h4>
                <p className="text-gray-600 bg-yellow-50 p-3 rounded">{item.feedback || "No feedback available"}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-blue-600">
                  Score: {item.score || 0}%
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  (item.score || 0) >= 80 ? 'bg-green-100 text-green-800' :
                  (item.score || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {(item.score || 0) >= 80 ? 'Excellent' : (item.score || 0) >= 60 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
