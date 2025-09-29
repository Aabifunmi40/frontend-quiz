import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white shadow-md ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* QuizMaster Logo → always goes to homepage */}
          <Link to="/" className="text-2xl font-bold hover:text-yellow-400">
            QuizMaster
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link to="/dashboard" className="hover:text-yellow-400">
                  Dashboard
                </Link>
                <Link to="/leaderboard" className="hover:text-yellow-400">
                  Leaderboard
                </Link>
                <Link to="/select" className="hover:text-yellow-400">
                  Select Quiz
                </Link>
                
                <Link to="/profile">My Profile</Link>

                {/* Admin Dashboard link */}
                {user.role === "admin" && (
                  <Link to="/admin/dashboard" className="hover:text-yellow-400">
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}

            {/* Auth Buttons */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-700 px-4 pb-4 space-y-2">
          {user && (
            <>
              <Link
                to="/dashboard"
                className="block hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/leaderboard"
                className="block hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                Leaderboard
              </Link>
              <Link
                to="/select"
                className="block hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                Select Quiz
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="block hover:text-yellow-400"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="block w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
