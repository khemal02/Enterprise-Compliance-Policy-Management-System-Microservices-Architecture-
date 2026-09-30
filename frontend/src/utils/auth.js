export const getToken = () => {
    return localStorage.getItem("token");
};

export const getRole = () => {
    return localStorage.getItem("role");
};

export const isAdmin = () => {
    return getRole() === "ADMIN";
};

export const isManager = () => {
    return getRole() === "MANAGER";
};

export const isEmployee = () => {
    return getRole() === "EMPLOYEE";
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
};