import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addNote = async(note) =>{
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
          `${API_BASE_URL}/notes/`,
          note,
          config
        );
        return response.data;
      } catch (error) {
        throw new Error(
          error.response ? error.response.data.message : error.message
        );
      }

}

