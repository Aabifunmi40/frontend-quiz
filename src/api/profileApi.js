import axios from "axios";

const API_URL = "https://quizzes-2.onrender.com/api";

export const getMyProfile = async (token) => {
  return axios.get(`${API_URL}/profile/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateMyProfile = async (token, data) => {
  return axios.put(`${API_URL}/profile/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
