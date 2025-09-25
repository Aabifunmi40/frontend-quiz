import axios from "axios";

const API_URL = "https://quizzes-2.onrender.com"; // backend prefix is /api/user

// Signup
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/signup`, userData);
};

// Login
export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/signin`, userData);
};
