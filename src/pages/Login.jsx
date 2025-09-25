import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(formData);
      console.log("Login response:", data);

      if (!data || !data.token) {
        setError(data?.message || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      localStorage.setItem("role", data.user?.role || "");

      setFormData({ email: "", password: "" });
      navigate(data.user?.role === "admin" ? "/admin/add-quiz" : "/dashboard");
    } catch (err) {
      console.error("Login error:", err.message);
      let errorMessage = "Login failed. Please try again.";
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
      <h2 className="text-3xl font-bold mb-6">Login to Your Account</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
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
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg"
        >
          Login
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
      <p className="mt-4">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-blue-400 hover:underline cursor-pointer"
        >
          Sign up here
        </span>
      </p>
    </div>
  );
}