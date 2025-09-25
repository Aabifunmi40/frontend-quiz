import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://quizzes-2.onrender.com/api/quiz"; // Hardcoded

const AdminAddQuiz = ({ onSave }) => {
  const [subject, setSubject] = useState("English");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validOptions = options.filter((opt) => opt);
    if (!question || validOptions.length !== 4 || !correctAnswer) {
      setError("Question, exactly four options, and a correct answer are required");
      return;
    }

    if (!validOptions.includes(correctAnswer)) {
      setError("Correct answer must match one of the provided options");
      return;
    }

    const retry = async (fn, retries = 5, delay = 3000) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await fn();
        } catch (err) {
          if (i === retries - 1) throw err;
          console.warn(`Retry ${i + 1}/${retries} failed: ${err.message}`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        setError("No authentication token found. Please log in.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const newQuestion = {
        question,
        options: validOptions,
        correctAnswer,
      };

      let quiz = null;
      try {
        console.log("Fetching quiz from:", `${API_URL}?subject=${subject}`);
        const response = await retry(() =>
          fetch(`${API_URL}?subject=${subject}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP ${response.status}: ${errorData.message || "Unknown error"}`);
        }
        const data = await response.json();
        console.log("GET response:", data);
        quiz = data.quizzes && data.quizzes.length > 0 ? data.quizzes[0] : null;
      } catch (fetchError) {
        console.error("GET error:", fetchError.message);
        if (!fetchError.message.includes("HTTP 404")) {
          throw new Error(`Failed to fetch quiz: ${fetchError.message}`);
        }
      }

      let payload;
      if (quiz) {
        payload = {
          subject,
          questions: [
            ...quiz.questions.map((q) => ({
              question: q.questionText,
              options: q.options.map((opt) => opt.text),
              correctAnswer: q.options.find((opt) => opt.isCorrect)?.text || "",
            })),
            newQuestion,
          ],
        };

        console.log("PUT request to:", `${API_URL}/${quiz._id}`);
        const response = await retry(() =>
          fetch(`${API_URL}/${quiz._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          })
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP ${response.status}: ${errorData.message || "Unknown error"}`);
        }
      } else {
        payload = {
          subject,
          questions: [newQuestion],
        };

        console.log("POST request to:", API_URL);
        const response = await retry(() =>
          fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          })
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP ${response.status}: ${errorData.message || "Unknown error"}`);
        }
      }

      console.log("📦 Payload sent:", JSON.stringify(payload, null, 2));
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setError("");
      alert("Question added successfully!");
      if (onSave) onSave();
    } catch (err) {
      console.error("Error adding question:", err.message);
      let errorMessage = "Failed to add question";
      if (err.message.includes("HTTP 401") || err.message.includes("HTTP 403")) {
        errorMessage = "Authentication failed or insufficient permissions. Please log in with an admin account.";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        setTimeout(() => navigate("/login"), 1500);
      } else if (err.message.includes("HTTP 400")) {
        errorMessage = `Invalid request: ${err.message}. Check the payload format or subject value.`;
      } else if (err.message.includes("HTTP 404")) {
        errorMessage = "Quiz endpoint not found. Verify the API URL: https://quizzes-2.onrender.com/api/quiz";
      } else if (err.message.includes("HTTP")) {
        errorMessage = `Server error: ${err.message}. Check the API URL or server status.`;
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage = "Network error: Unable to reach the server. Check your connection, API URL, or CORS settings.";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add New Question</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Subject</label>
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
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question"
            className="w-full p-2 border rounded"
          />
        </div>
        {options.map((opt, idx) => (
          <div key={idx} className="mb-4">
            <label className="block text-gray-700 mb-2">Option {idx + 1}</label>
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[idx] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Option ${idx + 1}`}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select correct answer</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt} disabled={!opt}>
                {opt || `Option ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AdminAddQuiz;