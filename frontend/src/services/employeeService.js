import axios from "../utils/axiosConfig";

// Get all employees
export const getAllEmployees = () => {
    return axios.get("/employee");
};

// Get employee by ID
export const getEmployeeById = (id) => {
    return axios.get(`/employee/${id}`);
};

// Create employee
export const createEmployee = (employee) => {
    return axios.post("/employee", employee);
};

// Update employee
export const updateEmployee = (id, employee) => {
    return axios.put(`/employee/${id}`, employee);
};

// Delete employee
export const deleteEmployee = (id) => {
    return axios.delete(`/employee/${id}`);
};

// Get employees by manager
export const getEmployeesByManager = (managerId) => {
    return axios.get(`/employee/manager/${managerId}`);
};