import { useState, useEffect } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view the leaderboard.");
        setLoading(false);
        return;
      }

      // Use environment variable for backend URL
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/results/public`, {
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

    // Optional: refresh leaderboard every 5 seconds
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center mt-10">Loading leaderboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!leaderboard.length) return <p className="text-center mt-10">No results yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Leaderboard 🏆</h2>
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
              <td className="border p-2">{result.score} / {result.totalQuestions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
