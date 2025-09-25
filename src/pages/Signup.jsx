import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await signupUser(formData);
      console.log("Signup response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        localStorage.setItem("role", data.user?.role || "");
      }

      setSuccess((data.message || "Signup successful!") + " Redirecting...");
      setTimeout(() => navigate(data.token ? (data.user?.role === "admin" ? "/admin/add-quiz" : "/dashboard") : "/login"), 1500);
    } catch (err) {
      console.error("Signup error:", err.message);
      let errorMessage = "Signup failed. Please try again.";
      if (err.message.includes("HTTP")) {
        errorMessage = `Server error: ${err.message}. Check the API URL or server status.`;
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage = "Network error: Unable to reach the server. Check your connection or CORS settings.";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h2 className="text-3xl font-bold mb-6">Create an Account</h2>
      <form
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg"
        >
          Sign Up
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
      </form>
      <p className="mt-4">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-blue-400 hover:underline cursor-pointer"
        >
          Login here
        </span>
      </p>
    </div>
  );
}