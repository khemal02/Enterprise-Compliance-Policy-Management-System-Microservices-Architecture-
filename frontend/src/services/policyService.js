import axios from "../utils/axiosConfig";

export const getAllPolicies = (page = 0, size = 10) => {
    return axios.get(`/policy?page=${page}&size=${size}`);
};

export const getPolicyById = (id) => {
    return axios.get(`/policy/${id}`);
};

export const createPolicy = (policy) => {
    return axios.post("/policy", policy);
};

export const updatePolicy = (id, policy) => {
    return axios.put(`/policy/${id}`, policy);
};

export const activatePolicy = (id) => {
    return axios.put(`/policy/${id}/activate`);
};

export const deletePolicy = (id) => {
    return axios.delete(`/policy/${id}`);
};