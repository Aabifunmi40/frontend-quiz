import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  // Score + totalQuestions are passed from Quiz.jsx
  const { score, totalQuestions, subject } = location.state || {
    score: 0,
    totalQuestions: 0,
    subject: "Quiz",
  };

  const percentage = totalQuestions
    ? Math.round((score / totalQuestions) * 100)
    : 0;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full"
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          {subject} Results
        </h1>

        {/* Score */}
        <p className="text-lg text-gray-700 mb-2">
          You answered <span className="font-bold">{score}</span> out of{" "}
          <span className="font-bold">{totalQuestions}</span> questions
          correctly.
        </p>
        <p
          className={`text-3xl font-extrabold mb-6 ${
            percentage >= 50 ? "text-green-500" : "text-red-500"
          }`}
        >
          {percentage}%
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/question-selection")}
            className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            className="w-full py-3 rounded-lg bg-green-500 text-white hover:bg-green-600"
          >
            Go to Leaderboard
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
