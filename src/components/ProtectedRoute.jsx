// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user")); // from login response

  if (!user) {
    return <Navigate to="/login" />; // not logged in
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />; // not the right role
  }

  return children;
};

export default ProtectedRoute;
