import axios from "../utils/axiosConfig";

export const getAllAudits = () => {
    return axios.get("/audit");
};
