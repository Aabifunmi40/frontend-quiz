import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-6">QuizMaster 🎯</h1>
      <p className="mb-6 text-lg">Challenge yourself with fun quizzes!</p>

      <div className="space-x-4">
        <Link
          to="/signup"
          className="px-6 py-3 bg-yellow-500 rounded-lg hover:bg-yellow-600 text-black font-semibold"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
