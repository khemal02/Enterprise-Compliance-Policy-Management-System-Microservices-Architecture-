import axios from "../utils/axiosConfig";

export const getAllNotifications = () => {
    return axios.get("/notification");
};

export const getNotificationById = (id) => {
    return axios.get(`/notification/${id}`);
};

export const createNotification = (data) => {
    return axios.post("/notification", data);
};