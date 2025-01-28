import axios from "axios";

const API_BASE_URL = "http://localhost:2025/api";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/login`, credentials);
  return response.data;
};
