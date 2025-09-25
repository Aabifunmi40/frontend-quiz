import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();

  // Fetch user profile on load
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://quizzes-2.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load profile. Please log in again.");
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("https://quizzes-2.onrender.com/api/user/profile", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="text-center">
        <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Profile</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="text-center mb-6">
            <img
              src={userData.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            {editing && (
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                disabled={!editing}
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  editing ? "border-gray-300" : "bg-gray-100"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
                disabled={!editing}
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  editing ? "border-gray-300" : "bg-gray-100"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                disabled={!editing}
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  editing ? "border-gray-300" : "bg-gray-100"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
              <textarea
                name="bio"
                value={userData.bio}
                onChange={handleChange}
                rows={3}
                disabled={!editing}
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  editing ? "border-gray-300" : "bg-gray-100"
                }`}
              />
            </div>
            <div className="flex gap-4">
              {editing ? (
                <>
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}