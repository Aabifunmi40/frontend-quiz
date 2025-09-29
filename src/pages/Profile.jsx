import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/profileApi";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });
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
      setMessage("Profile updated successfully");
      setProfile(res.data.profile);
    } catch (err) {
      setMessage("Failed to update profile");
      console.error(err);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>My Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email || ""}
          onChange={handleChange}
        />

        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
        />

        <label>Bio:</label>
        <textarea
          name="bio"
          value={form.bio || ""}
          onChange={handleChange}
        />

        <button type="submit" style={{ marginTop: "10px" }}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
