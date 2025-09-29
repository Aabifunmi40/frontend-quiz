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
      <Link to="/profile" className="hover:text-yellow-400">
        My Profile
      </Link>

      {user.role === "admin" && (
        <Link to="/admin/dashboard" className="hover:text-yellow-400">
          Admin Dashboard
        </Link>
      )}
    </>
  )}

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
        <Link
          to="/profile"
          className="block hover:text-yellow-400"
          onClick={() => setIsOpen(false)}
        >
          My Profile
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
