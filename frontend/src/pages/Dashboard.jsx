import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardActionArea, Grid, Skeleton, Stack, Typography } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HistoryIcon from "@mui/icons-material/History";

import { getDashboardData } from "../services/dashboardService";
import { getErrorMessage } from "../utils/errorMessage";
import { toast } from "react-toastify";

const STAT_TILES = [
    { key: "employees", label: "Employees", icon: <PeopleAltIcon fontSize="large" />, to: "/employees" },
    { key: "policies", label: "Policies", icon: <DescriptionIcon fontSize="large" />, to: "/policies" },
    { key: "compliances", label: "Compliances", icon: <FactCheckIcon fontSize="large" />, to: "/compliance" },
    { key: "approvals", label: "Approvals", icon: <CheckCircleIcon fontSize="large" />, to: "/approvals" },
    { key: "notifications", label: "Notifications", icon: <NotificationsIcon fontSize="large" />, to: "/notifications" },
    { key: "audits", label: "Audit Logs", icon: <HistoryIcon fontSize="large" />, to: "/audit" }
];

function Dashboard() {

    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);

        try {
            const response = await getDashboardData();
            setData(response);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load dashboard summary."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={3}>
            <Typography variant="h5" fontWeight={700}>Dashboard</Typography>

            <Grid container spacing={2}>
                {STAT_TILES.map((tile) => (
                    <Grid key={tile.key} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardActionArea
                                onClick={() => navigate(tile.to)}
                                sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}
                            >
                                <Stack sx={{ color: "primary.main" }}>{tile.icon}</Stack>
                                <Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {tile.label}
                                    </Typography>
                                    {loading ? (
                                        <Skeleton width={60} height={40} />
                                    ) : (
                                        <Typography variant="h4">{data?.[tile.key] ?? 0}</Typography>
                                    )}
                                </Stack>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}

export default Dashboard;
