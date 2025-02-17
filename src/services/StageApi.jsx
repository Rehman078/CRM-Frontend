import axios from "axios";
import { getConfig } from "../utilities/ConfigApi";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getStageByPiplineId = async (piplineId) => {
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
            pipline_id: piplineId,
          },
        };
      const response = await axios.get(`${API_BASE_URL}/stages/pipline/`, config);
      return response?.data;
    } catch (error) {
      throw new Error(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  export const addStage = async (data) => {
    try {
      const config = getConfig();
      const response = await axios.post(
        `${API_BASE_URL}/stages/`,
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

  export const deleteStage = async (id) => {
    try {
      const config = getConfig();
      const response = await axios.delete(
        `${API_BASE_URL}/stages/${id}`,
        config
      );
  
      return response.data;
    } catch (error) {
      throw new Error(
        error.response ? error.response.data.message : error.message
      );
    }
  };