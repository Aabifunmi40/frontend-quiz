import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfileFormPage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    profilePicture: "",
  });
  const [file, setFile] = useState(null); // for converting to Base64
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://quizzes-2.onrender.com/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData({
        name: res.data.name || "",
        email: res.data.email || "",
        username: res.data.username || "",
        bio: res.data.bio || "",
        profilePicture: res.data.profilePicture || "",
      });
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => setUserData((prev) => ({ ...prev, profilePicture: reader.result }));
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleNext = () => {
    // pass userData and file (for Base64 conversion) to the next page
    navigate("/update-profile", { state: { userData, file } });
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <input
        type="text"
        name="name"
        value={userData.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="text"
        name="username"
        value={userData.username}
        onChange={handleChange}
        placeholder="Username"
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 mb-3 border rounded"
      />
      <textarea
        name="bio"
        value={userData.bio}
        onChange={handleChange}
        placeholder="Bio"
        rows={3}
        className="w-full p-2 mb-3 border rounded"
      />
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />

      <button
        onClick={handleNext}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Next: Update Profile
      </button>
    </div>
  );
}
