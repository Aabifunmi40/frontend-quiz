import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [subject, setSubject] = useState("Math");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validSubjects = ["Math", "English", "Current Affairs"];

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view the leaderboard.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const apiUrl = `https://quizzes-2.onrender.com/api/leaderboard?subject=${encodeURIComponent(subject)}`;
      console.log("Fetching leaderboard:", apiUrl);
      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : res.data?.leaderboard || [];
      if (data.length === 0) {
        setError(`No leaderboard data found for ${subject}.`);
      } else {
        // Sort by score descending (in case backend doesn't)
        setLeaderboard(data.sort((a, b) => b.score - a.score));
      }
      setLoading(false);
    } catch (err) {
      console.error("Leaderboard error:", err);
      let errorMessage = "Failed to load leaderboard.";
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "Authentication failed. Please log in again.";
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          setTimeout(() => navigate("/login"), 1500);
        } else if (err.response.status === 404) {
          errorMessage = `No leaderboard data for ${subject}.`;
        } else {
          errorMessage = `Error ${err.response.status}: ${err.response.data?.message || err.message}`;
        }
      } else {
        errorMessage = `Network Error: ${err.message}`;
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [subject]);

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    setLeaderboard([]);
    setError(null);
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Leaderboard 🏆
        </h1>

        <div className="mb-6">
          <label htmlFor="subject" className="block text-gray-800 font-semibold mb-2">
            Select Subject
          </label>
          <select
            id="subject"
            value={subject}
            onChange={handleSubjectChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {validSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 mx-auto text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
            <p className="mt-2 text-gray-600">Loading leaderboard...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 mb-6 p-4 bg-red-100 rounded-lg">
            <p>{error}</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={fetchLeaderboard}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {!loading && !error && leaderboard.length === 0 && (
          <div className="text-center text-gray-600">
            <p>No leaderboard data available for {subject}.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {!loading && leaderboard.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">Rank</th>
                  <th className="p-3 text-left">Player</th>
                  <th className="p-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="p-3 font-medium text-gray-700">
                      #{index + 1}
                    </td>
                    <td className="p-3 text-gray-800">{player.username}</td>
                    <td className="p-3 text-right font-bold text-blue-600">
                      {player.score}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Scores are updated after each quiz attempt.
        </p>
      </motion.div>
    </div>
  );
}