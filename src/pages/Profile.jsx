import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/profileApi";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile(token);
        setProfile(res.data);
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateMyProfile(token, form);
      setMessage("✅ Profile updated successfully!");
      setProfile(res.data.profile);
    } catch (err) {
      setMessage("❌ Failed to update profile");
      console.error(err);
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-center mb-4">My Profile</h2>
      {message && <p className="text-center mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
