import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function Quiz({ subject: initialSubject = "Current Affairs" }) {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState(initialSubject);

  // Align subjects with ViewQuiz for consistency
  const validSubjects = ["Math", "English", "Current Affairs"];

  const fetchQuestions = async () => {
    if (!validSubjects.includes(subject)) {
      setError(`Invalid subject: ${subject}. Choose: ${validSubjects.join(", ")}.`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to take a quiz.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const apiUrl = `https://quizzes-2.onrender.com/api/quiz?subject=${encodeURIComponent(subject)}`;
      console.log("Fetching:", apiUrl);
      setLoading(true);
      setError(null);

      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response:", res.data);

      let allQuestions = [];
      if (Array.isArray(res.data)) {
        allQuestions = res.data.flatMap((quiz) => quiz.questions || []);
      } else if (res.data?.message === "No quizzes found") {
        allQuestions = [];
      } else if (res.data?.quizzes) {
        allQuestions = res.data.quizzes.flatMap((quiz) => quiz.questions || []);
      }

      if (allQuestions.length === 0) {
        setError(`No questions found for ${subject}. Please contact an admin.`);
      }

      setQuestions(allQuestions);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      let errorMessage = "Failed to fetch questions.";
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "Authentication failed. Please log in again.";
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          setTimeout(() => navigate("/login"), 1500);
        } else if (err.response.status === 400) {
          errorMessage = `Invalid request: ${err.response.data?.message || "Bad request"}`;
        } else if (err.response.status === 404) {
          errorMessage = `No questions found for ${subject}.`;
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
    fetchQuestions();
  }, [subject]);

  const handleAnswer = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, index) => {
      const chosen = selectedAnswers[index];
      const correct = q.options.find((opt) => opt.isCorrect)?.text;
      if (chosen === correct) score++;
    });

    navigate("/results", {
      state: { score, totalQuestions: questions.length, subject },
    });
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setError(null);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
          <p className="mt-2 text-gray-600">Loading {subject} questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full"
      >
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

        {error && (
          <div className="text-center text-red-500 mb-6 p-4 bg-red-100 rounded-lg">
            <p>{error}</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={fetchQuestions}
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

        {questions.length === 0 && !error && (
          <div className="text-center">
            <p>No questions found for {subject}.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {questions.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Question {currentQuestion + 1} of {questions.length}:{" "}
              {questions[currentQuestion]?.questionText || "No question available"}
            </h2>

            <div className="grid gap-3 mb-6">
              {Array.isArray(questions[currentQuestion]?.options) &&
                questions[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt.text)}
                    className={`py-3 px-4 rounded-lg border ${
                      selectedAnswers[currentQuestion] === opt.text
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } transition`}
                  >
                    {opt.text || "No option text"}
                  </button>
                ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="py-3 px-6 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedAnswers[currentQuestion]}
                className="py-3 px-6 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-50"
              >
                {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}