import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getContacts = async () => {
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

    const response = await axios.get(`${API_BASE_URL}/contacts/`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const addContacts = async (formData) => {
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
      `${API_BASE_URL}/contacts/`,
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

export const deleteContacts = async (id) => {
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

    // Fixing the URL by directly embedding the id
    const response = await axios.delete(
      `${API_BASE_URL}/contacts/${id}`,
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

// Updated assignContact function
export const assignContact = async (contactId, assignedUsers) => {
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

    const response = await axios.patch(
      `${API_BASE_URL}/contacts/assign/${contactId}`,
      { salerep_ids: assignedUsers },
      config
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const getContactsById = async () => {
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

    const response = await axios.get(`${API_BASE_URL}/contacts/`, config);

    console.log("API Response:", response.data);

    if (!Array.isArray(response.data.data)) {
      console.error("Unexpected API response:", response.data);
      return [];
    }

    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching contacts:",
      error.response ? error.response.data.message : error.message
    );
    return [];
  }
};

export const updateContact = async (id, formData) => {
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
      `${API_BASE_URL}/contacts/${id}`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating contact: " + error.message);
  }
};
