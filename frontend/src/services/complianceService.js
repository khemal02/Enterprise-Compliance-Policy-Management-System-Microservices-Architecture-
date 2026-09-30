import axios from "../utils/axiosConfig";


export const createCompliance = (data) => {
    return axios.post("/compliance", data);
};

export const getAllCompliances = () => {
    return axios.get("/compliance");
};

export const getComplianceById = (id) => {
    return axios.get(`/compliance/${id}`);
};

export const updateComplianceStatus = (id, status) => {
    return axios.put(`/compliance/${id}/status?status=${status}`);
};

export const deleteCompliance = (id) => {
    return axios.delete(`/compliance/${id}`);
};