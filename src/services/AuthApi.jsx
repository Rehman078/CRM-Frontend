import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const role = user?.role;

    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Role: role || "",
      },
    };
    const response = await axios.get(`${API_BASE_URL}/users`, config);
    return response.data;
  } catch (error) {
    console.error("Get users error:", error);
    throw error;
  }
};
