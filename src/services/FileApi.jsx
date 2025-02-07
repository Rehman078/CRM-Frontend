import axios from "axios";
import { getConfig } from "../utilities/ConfigApi";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addFiles = async (formData) => {
  try {
    const config = getConfig();
    const response = await axios.post(
      `${API_BASE_URL}/files/`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const getFilesByContactId = async (contactId) => {
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
        source: "Contact",
        source_id: contactId,
      },
    };

    const response = await axios.get(`${API_BASE_URL}/files`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching files for contact:", error);
    throw error;
  }
};

export const getFilesByLeadId = async (leadId) => {
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
        source: "Lead",
        source_id: leadId,
      },
    };

    const response = await axios.get(`${API_BASE_URL}/files`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching files for contact:", error);
    throw error;
  }
};

export const deleteFileById = async (id) => {
  try {
    const config = getConfig();
    const response = await axios.delete(
      `${API_BASE_URL}/files/file/${id}`,
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};
