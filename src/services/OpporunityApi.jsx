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