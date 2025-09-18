import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Profile() {
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const userId = user?.id;
        if (!userId) return;
        const res = await fetch(`${API_BASE}/api/me/interviews?userId=${encodeURIComponent(userId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        setItems(data.items || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user?.id]);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 px-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">My Profile</h1>
      {loading && <div className="text-center text-gray-600">Loading…</div>}
      {error && <div className="text-center text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="max-w-4xl mx-auto space-y-4">
          {items.length === 0 && (
            <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">No interviews yet.</div>
          )}
          {items.map((it) => (
            <div key={it.id} className="bg-white p-4 rounded-xl shadow border flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">{it.category || 'Interview'}</div>
                <div className="text-sm text-gray-500">{new Date(it.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-700">Questions: {it.total_questions}</div>
                <div className="font-bold {it.overall_score >= 70 ? 'text-green-600' : 'text-yellow-600'}">Score: {it.overall_score ?? '-'}%</div>
                {it.improved === null ? (
                  <span className="text-gray-500 text-sm">First attempt</span>
                ) : it.improved ? (
                  <span className="text-green-600 text-sm">Improved ✅</span>
                ) : (
                  <span className="text-red-600 text-sm">Declined ❌</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


