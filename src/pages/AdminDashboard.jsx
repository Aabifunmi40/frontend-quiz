import { useState, useEffect } from "react";
import AdminAddQuiz from "./AdminAddQuiz";
import AdminViewQuizzes from "./AdminViewQuizzes";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("view");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      console.log("Initial load: Setting up dashboard...");
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Your Admin Dashboard 🎯</h1>
        <p className="text-gray-600 mb-8">Manage quizzes and questions for the platform.</p>
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setActiveSection("add")}
            className={`py-3 px-6 rounded-lg text-white ${
              activeSection === "add"
                ? "bg-blue-500"
                : "bg-blue-300 hover:bg-blue-400"
            } transition`}
          >
            Add Question
          </button>
          <button
            onClick={() => setActiveSection("view")}
            className={`py-3 px-6 rounded-lg text-white ${
              activeSection === "view"
                ? "bg-green-500"
                : "bg-green-300 hover:bg-green-400"
            } transition`}
          >
            View Questions
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6">
          {activeSection === "add" && <AdminAddQuiz onSave={() => setActiveSection("view")} />}
          {activeSection === "view" && <AdminViewQuizzes />}
        </div>
      </div>
    </div>
  );
}