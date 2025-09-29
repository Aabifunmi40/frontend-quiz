import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Start Quiz",
      desc: "Choose a subject and test your knowledge.",
      action: () => navigate("/select"),
      color: "bg-blue-600",
    },
    {
      title: "Leaderboard",
      desc: "See the top players and scores.",
      action: () => navigate("/leaderboard"),
      color: "bg-green-500",
    },
    {
      title: "Profile",
      desc: "View and manage your account details.",
      action: () => navigate("/profile-form"), // navigate to the first profile page
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Welcome to Your Quiz Dashboard 🎯
        </h1>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {card.title}
                </h2>
                <p className="text-gray-600 mb-6">{card.desc}</p>
              </div>
              <button
                onClick={card.action}
                className={`${card.color} text-white font-medium py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition`}
              >
                {card.title}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
