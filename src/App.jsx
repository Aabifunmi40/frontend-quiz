import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Quiz from "./pages/Quiz";
import QuestionSelect from "./pages/QuestionSelect";
import Results from "./pages/Results";
import AdminDashboard from "./pages/AdminDashboard";

// Import the two-step profile pages
// import ProfileFormPage from "./pages/ProfileFormPage";
// import ProfileUpdatePage from "./pages/ProfileUpdatePage";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<Home />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/select" element={<QuestionSelect />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />

          {/* Profile Pages */}
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/update-profile" element={<ProfileUpdatePage />} /> */}

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
