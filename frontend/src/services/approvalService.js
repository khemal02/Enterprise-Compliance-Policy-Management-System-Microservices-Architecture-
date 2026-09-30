import axios from "../utils/axiosConfig";

export const getAllApprovals = () => {
    return axios.get("/approval");
};

export const getApprovalById = (id) => {
    return axios.get(`/approval/${id}`);
};

export const createApproval = (data) => {
    return axios.post("/approval", data);
};

export const approveApproval = (id) => {
    return axios.put(`/approval/${id}/approve`);
};

export const rejectApproval = (id) => {
    return axios.put(`/approval/${id}/reject`);
};