import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { getToken, getRole, logout as clearSession } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setTokenState] = useState(getToken);
    const [role, setRoleState] = useState(getRole);

    const login = useCallback((newToken, newRole) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);
        setTokenState(newToken);
        setRoleState(newRole);
    }, []);

    const logout = useCallback(() => {
        setTokenState(null);
        setRoleState(null);
        clearSession();
    }, []);

    const value = useMemo(() => ({
        token,
        role,
        isAuthenticated: !!token,
        isAdmin: role === "ADMIN",
        isManager: role === "MANAGER",
        isEmployee: role === "EMPLOYEE",
        login,
        logout
    }), [token, role, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
