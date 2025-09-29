import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // Make sure .env is: REACT_APP_API_URL=https://your-app.onrender.com/api

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState(""); // Optional subject filter
  const token = localStorage.getItem("token");

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("You must be logged in to view the leaderboard.");
        return;
      }

      const res = await axios.get(`${API_URL}/results/public${subject ? `?subject=${subject}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLeaderboard(res.data);
    } catch (err) {
      console.error("Leaderboard Fetch Error:", err.response?.data || err.message);
      setError("Failed to load leaderboard. Check backend URL or token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Optional: refresh leaderboard every 10 seconds
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [subject]); // refetch when subject changes

  if (loading) return <p className="text-center mt-10">Loading leaderboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!leaderboard.length) return <p className="text-center mt-10">No results yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Leaderboard 🏆</h2>

      {/* Optional subject filter */}
      <div className="mb-4 flex justify-center gap-2">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Subjects</option>
          <option value="Math">Math</option>
          <option value="English">English</option>
          <option value="Current Affairs">Current Affairs</option>
        </select>
        <button
          onClick={fetchLeaderboard}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">#</th>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Subject</th>
            <th className="border p-2 text-left">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((result, idx) => (
            <tr key={result._id} className="hover:bg-gray-50">
              <td className="border p-2">{idx + 1}</td>
              <td className="border p-2">{result.user?.name || "Unknown"}</td>
              <td className="border p-2">{result.subject}</td>
              <td className="border p-2">
                {result.score} / {result.totalQuestions}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

