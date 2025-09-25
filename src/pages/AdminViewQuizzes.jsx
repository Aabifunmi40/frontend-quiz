import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://quizzes-2.onrender.com/api/quiz"; // Hardcoded

const ViewQuiz = () => {
  const [subject, setSubject] = useState("English");
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState(null);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const response = await fetch(`${API_URL}?subject=${subject}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${errorData.message || "Unknown error"}`);
      }
      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      console.error("Error fetching quizzes:", err.message);
      let errorMessage = "Failed to fetch quizzes";
      if (err.message.includes("HTTP 401") || err.message.includes("HTTP 403")) {
        errorMessage = "Authentication failed. Please log in again.";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        setTimeout(() => navigate("/login"), 1500);
      } else if (err.message.includes("HTTP 400")) {
        errorMessage = `Invalid request: ${err.message}. Check the subject value.`;
      } else if (err.message.includes("HTTP 404")) {
        errorMessage = "No quizzes found for this subject.";
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage = "Network error: Unable to reach the server. Check your connection or CORS settings.";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [subject]);

  const handleDelete = async (quizId, questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const response = await fetch(`${API_URL}/${quizId}/question/${questionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete question");
      }
      fetchQuizzes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditStart = (quizId, question) => {
    setEditingQuizId(quizId);
    setEditingQuestionId(question._id);
    setEditedQuestion({
      number: question.number,
      questionText: question.questionText,
      options: question.options.map((opt) => ({ text: opt.text, isCorrect: opt.isCorrect })),
    });
  };

  const handleEditCancel = () => {
    setEditingQuizId(null);
    setEditingQuestionId(null);
    setEditedQuestion(null);
  };

  const handleEditSave = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const response = await fetch(`${API_URL}/${editingQuizId}/question/${editingQuestionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedQuestion),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update question");
      }
      handleEditCancel();
      fetchQuizzes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuestionChange = (e) => {
    setEditedQuestion({ ...editedQuestion, questionText: e.target.value });
  };

  const handleNumberChange = (e) => {
    setEditedQuestion({ ...editedQuestion, number: parseInt(e.target.value, 10) || 0 });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index][field] = field === "isCorrect" ? value : value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">View Quizzes</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Math">Math</option>
          <option value="English">English</option>
          <option value="Current Affairs">Current Affairs</option>
        </select>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500">Loading quizzes...</p>}
      {!loading && quizzes.length === 0 && !error && (
        <p className="text-gray-500">No quizzes found for {subject}.</p>
      )}
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="mb-6 p-4 border rounded">
          <h3 className="text-xl font-semibold">{quiz.subject}</h3>
          {quiz.questions.map((q) => {
            const isEditing = editingQuizId === quiz._id && editingQuestionId === q._id;
            return (
              <div key={q._id} className="mt-4">
                {isEditing ? (
                  <div>
                    <label className="block text-gray-700">Question Number</label>
                    <input
                      type="number"
                      value={editedQuestion.number}
                      onChange={handleNumberChange}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <label className="block text-gray-700">Question Text</label>
                    <textarea
                      value={editedQuestion.questionText}
                      onChange={handleQuestionChange}
                      className="w-full p-2 border rounded mb-2"
                    />
                    {editedQuestion.options.map((opt, idx) => (
                      <div key={idx} className="mb-2">
                        <label className="block text-gray-700">Option {idx + 1}</label>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                        <label className="flex items-center mt-1">
                          <input
                            type="checkbox"
                            checked={opt.isCorrect}
                            onChange={(e) => handleOptionChange(idx, "isCorrect", e.target.checked)}
                          />
                          <span className="ml-2">Correct</span>
                        </label>
                      </div>
                    ))}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleEditSave}
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium">{q.number}. {q.questionText}</p>
                    <ul className="list-disc pl-6">
                      {q.options.map((opt, idx) => (
                        <li
                          key={idx}
                          className={opt.isCorrect ? "text-green-600 font-semibold" : ""}
                        >
                          {opt.text}
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleEditStart(quiz._id, q)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(quiz._id, q._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <button
        onClick={() => navigate("/admin/add-quiz")}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Add New Question
      </button>
    </div>
  );
};

export default ViewQuiz;