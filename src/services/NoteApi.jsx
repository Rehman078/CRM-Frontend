import axios from "axios";
import { getConfig } from "../utilities/ConfigApi";
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

export const getNotesByContactId = async(contactId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const role = user?.role;

    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Role: role || "",
      },
      params: {
        note_type: "Contact",
        note_to: contactId,
      },
    };

    const response = await axios.get(`${API_BASE_URL}/notes/`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching files for contact:", error);
    throw error;
  }
}

export const getNotesByLeadId = async(noteId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const role = user?.role;

    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Role: role || "",
      },
      params: {
        note_type: "Lead",
        note_to: noteId,
      },
    };

    const response = await axios.get(`${API_BASE_URL}/notes/`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching files for note:", error);
    throw error;
  }
}