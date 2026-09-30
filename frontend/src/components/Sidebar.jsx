import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Box,
    Chip,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import {
    FaUsers,
    FaFileAlt,
    FaClipboardCheck,
    FaCheckCircle,
    FaBell,
    FaHistory,
    FaSignOutAlt
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "./common/ConfirmDialog";

export const SIDEBAR_WIDTH = 250;

const NAV_ITEMS = [
    { to: "/employees", label: "Employees", icon: <FaUsers />, roles: ["ADMIN", "MANAGER"] },
    { to: "/policies", label: "Policies", icon: <FaFileAlt />, roles: ["ADMIN", "MANAGER"] },
    { to: "/compliance", label: "Compliance", icon: <FaClipboardCheck />, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/approvals", label: "Approvals", icon: <FaCheckCircle />, roles: ["ADMIN", "MANAGER"] },
    { to: "/notifications", label: "Notifications", icon: <FaBell />, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/audit", label: "Audit Logs", icon: <FaHistory />, roles: ["ADMIN"] }
];

export { NAV_ITEMS };

function Sidebar() {

    const { role, logout } = useAuth();
    const location = useLocation();
    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

    const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: SIDEBAR_WIDTH,
                        boxSizing: "border-box",
                        bgcolor: "sidebar.background",
                        color: "white",
                        border: "none",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        py: 3,
                        px: 2
                    }
                }}
            >
                <Box>
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                        <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 2 }}>
                            ECPMS
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: "center", mb: 3 }}>
                        <Typography variant="caption" sx={{ color: "sidebar.text" }}>
                            Logged in as
                        </Typography>
                        <Chip
                            label={role}
                            size="small"
                            sx={{
                                display: "block",
                                mt: 1,
                                mx: "auto",
                                width: "fit-content",
                                bgcolor: "primary.main",
                                color: "secondary.main",
                                fontWeight: 700
                            }}
                        />
                    </Box>

                    <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {visibleItems.map((item) => {
                            const active = location.pathname === item.to;

                            return (
                                <ListItemButton
                                    key={item.to}
                                    component={Link}
                                    to={item.to}
                                    selected={active}
                                    sx={{
                                        borderRadius: 2,
                                        color: active ? "secondary.main" : "white",
                                        bgcolor: active ? "primary.main" : "transparent",
                                        "&.Mui-selected": {
                                            bgcolor: "primary.main",
                                            "&:hover": { bgcolor: "primary.main" }
                                        },
                                        "&:hover": {
                                            bgcolor: active ? "primary.main" : "sidebar.hover",
                                            color: active ? "secondary.main" : "primary.main"
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        slotProps={{ primary: { fontWeight: active ? 700 : 500 } }}
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Box>

                <Box>
                    <Divider sx={{ borderColor: "sidebar.hover", mb: 2 }} />
                    <ListItemButton
                        onClick={() => setConfirmLogoutOpen(true)}
                        sx={{
                            borderRadius: 2,
                            justifyContent: "center",
                            bgcolor: "error.main",
                            color: "white",
                            "&:hover": { bgcolor: "#dc2626" }
                        }}
                    >
                        <ListItemIcon sx={{ color: "inherit", minWidth: 32, justifyContent: "center" }}>
                            <FaSignOutAlt />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </Box>
            </Drawer>

            <ConfirmDialog
                open={confirmLogoutOpen}
                title="Log out"
                message="Are you sure you want to log out of ECPMS?"
                confirmLabel="Logout"
                confirmColor="error"
                onClose={() => setConfirmLogoutOpen(false)}
                onConfirm={() => {
                    setConfirmLogoutOpen(false);
                    logout();
                }}
            />
        </>
    );
}

export default Sidebar;
