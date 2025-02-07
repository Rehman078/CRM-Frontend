import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addNote = async (note) => {
  try {
    const config = getConfig();
    const response = await axios.post(`${API_BASE_URL}/notes/`, note, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};
