import axios from "axios";
import { getConfig } from "../utilities/ConfigApi";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AddOpportunites = async (data) => {
  try {
    const config = getConfig();
    const response = await axios.post(
      `${API_BASE_URL}/opportunities/`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const getOpportunities = async () => {
  try {
    const config = getConfig();
    const response = await axios.get(`${API_BASE_URL}/opportunities/`, config);
    return response?.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const deleteOpportunities = async (id) => {
  try {
    const config = getConfig();
    const response = await axios.delete(
      `${API_BASE_URL}/opportunities/${id}`,
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const getOpportuntyByContactId = async (contactId) => {
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
        type: "Contact",
        assignedTo: contactId,
      },
    };

    const response = await axios.get(
      `${API_BASE_URL}/opportunities/details/`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching opportunity by id:", error);
    throw error;
  }
};

export const getOpportuntyByLeadId = async (leadId) => {
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
        type: "Lead",
        assignedTo: leadId,
      },
    };

    const response = await axios.get(
      `${API_BASE_URL}/opportunities/details/`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching opportunity by id:", error);
    throw error;
  }
};

export const getOpporuintyById = async (id) => {
  try {
    const config = getConfig();
    const response = await axios.get(
      `${API_BASE_URL}/opportunities/${id}`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const updateOpportunityStage = async (opportunityId, newStageId) => {
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
        opportunityId,
        stageId: newStageId,
      },
    };
    const response = await axios.patch(
      `${API_BASE_URL}/opportunities/update/stage/`,
      {},
      config
    );

    return response.data;
  } catch (error) {
    console.error("Error updating opportunity stage:", error);
    throw error;
  }
};

export const getOpportunitiesByPipelineId = async (pipelineId) => {
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
        pipelineId: pipelineId
        
      },
    };
    const response = await axios.get(
      `${API_BASE_URL}/opportunities/opportunity`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
}
