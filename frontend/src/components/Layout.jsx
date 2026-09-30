import { AppBar, Box, Chip, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

import Sidebar, { SIDEBAR_WIDTH, NAV_ITEMS } from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const PAGE_TITLES = {
    "/dashboard": "Dashboard",
    ...Object.fromEntries(NAV_ITEMS.map((item) => [item.to, item.label]))
};

function Layout({ children }) {

    const location = useLocation();
    const { role } = useAuth();
    const title = PAGE_TITLES[location.pathname] || "ECPMS";

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
            <Sidebar />

            <Box sx={{ flexGrow: 1, ml: `${SIDEBAR_WIDTH}px` }}>
                <AppBar
                    position="sticky"
                    color="inherit"
                    elevation={0}
                    sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                >
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <Typography variant="h6">{title}</Typography>
                        <Chip label={role} size="small" color="primary" variant="outlined" />
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default Layout;
