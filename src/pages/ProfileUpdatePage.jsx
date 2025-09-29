import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function ProfileUpdatePage() {
  const { state } = useLocation();
  const { userData } = state || {};
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!userData) {
    return <p className="text-center mt-10">No profile data found. Go back and fill your info first.</p>;
  }

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Send JSON directly (profilePicture is already Base64 string)
      await axios.put(
        "https://quizzes-2.onrender.com/api/profile",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/dashboard"), 2000); // redirect to dashboard
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-500 mb-3">{success}</p>}

      <div className="mb-4">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Bio:</strong> {userData.bio}</p>
        {userData.profilePicture && (
          <img src={userData.profilePicture} alt="Profile" className="w-24 h-24 rounded-full mt-2" />
        )}
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
}
