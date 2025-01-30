import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getLeads = async () => {
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

    const response = await axios.get(`${API_BASE_URL}/leads/`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const addleads = async (formData) => {
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

    const response = await axios.post(
      `${API_BASE_URL}/leads/`,
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

export const deleteLead = async (id) => {
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

    const response = await axios.delete(`${API_BASE_URL}/leads/${id}`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const getLeadsById = async (id) => {

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

    const response = await axios.get(`${API_BASE_URL}/leads/${id}`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const updateLead = async (id, formData) => {
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

    const response = await axios.put(
      `${API_BASE_URL}/leads/${id}`,
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

export const assignLead = async (leadId, assignedUsers) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const role = user?.role;

    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Role: role || "",
        "Content-Type": "application/json",
      },
    };

    const response = await axios.patch(
      `${API_BASE_URL}/leads/assign/${leadId}`,
      { salerep_ids: assignedUsers },
      config
    );

    return response.data;
  } catch (error) {
    console.error("Error assigning lead:", error.message);
    throw error;
  }
};
