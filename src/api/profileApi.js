import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
