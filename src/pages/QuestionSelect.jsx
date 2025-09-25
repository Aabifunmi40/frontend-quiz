import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function QuestionSelection() {
  const navigate = useNavigate();

  const subjects = [
    { name: "Mathematics", color: "bg-blue-600" },
    { name: "English", color: "bg-green-500" },
    { name: "Current Affairs", color: "bg-yellow-500" },
  ];

  const handleSelect = (subject) => {
    navigate("/quiz", { state: { subject } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Select a Subject 📚
        </h1>

        {/* Subject Buttons */}
        <div className="grid grid-cols-1 gap-4">
          {subjects.map((subject, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(subject.name)}
              className={`${subject.color} text-white font-medium py-4 rounded-xl shadow-md hover:opacity-90 transition`}
            >
              {subject.name}
            </motion.button>
          ))}
        </div>

        {/* Hint */}
        <p className="mt-6 text-gray-500 text-sm">
          Choose a subject to begin your quiz.
        </p>
      </motion.div>
    </div>
  );
}
