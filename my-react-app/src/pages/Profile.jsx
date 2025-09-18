import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = user?.id;
      if (!userId) return;
      
      // Fetch interviews and stats in parallel
      const [interviewsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/me/interviews?userId=${encodeURIComponent(userId)}`),
        fetch(`${API_BASE}/api/me/stats?userId=${encodeURIComponent(userId)}`)
      ]);
      
      const [interviewsData, statsData] = await Promise.all([
        interviewsRes.json(),
        statsRes.json()
      ]);
      
      if (!interviewsRes.ok) throw new Error(interviewsData.error || 'Failed to load interviews');
      if (!statsRes.ok) throw new Error(statsData.error || 'Failed to load stats');
      
      setItems(interviewsData.items || []);
      setStats(statsData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleDelete = async (interviewId) => {
    if (!confirm('Are you sure you want to delete this interview?')) return;
    
    try {
      const userId = user?.id;
      const res = await fetch(`${API_BASE}/api/interviews/${interviewId}?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      
      // Refresh data
      await fetchData();
    } catch (e) {
      alert('Failed to delete interview: ' + e.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 px-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">My Profile</h1>
      {loading && <div className="text-center text-gray-600">Loading…</div>}
      {error && <div className="text-center text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="max-w-6xl mx-auto">
          {/* Overall Stats */}
          {stats && (
            <div className="bg-white p-6 rounded-xl shadow mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.total_interviews}</div>
                  <div className="text-sm text-gray-600">Total Interviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.average_score}%</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.best_score}%</div>
                  <div className="text-sm text-gray-600">Best Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats.improved_count}</div>
                  <div className="text-sm text-gray-600">Improved Sessions</div>
                </div>
              </div>
            </div>
          )}

          {/* Interview List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Interview History</h2>
            {items.length === 0 && (
              <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">No interviews yet.</div>
            )}
            {items.map((it) => (
              <div key={it.id} className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{it.category || 'Interview'}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        (it.overall_score || 0) >= 80 ? 'bg-green-100 text-green-800' :
                        (it.overall_score || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {it.overall_score || 0}%
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(it.created_at).toLocaleString()} • {it.total_questions} questions
                    </div>
                    <div className="flex items-center gap-4">
                      {it.improved === null ? (
                        <span className="text-gray-500 text-sm">First attempt</span>
                      ) : it.improved === 1 ? (
                        <span className="text-green-600 text-sm font-semibold">Improved ✅</span>
                      ) : it.improved === 0 ? (
                        <span className="text-red-600 text-sm font-semibold">Declined ❌</span>
                      ) : (
                        <span className="text-gray-500 text-sm">Unknown</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/interview-detail/${it.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(it.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


