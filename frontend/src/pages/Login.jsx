import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errorMessage";

function Login() {

    const navigate = useNavigate();
    const { login: setSession } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();
        setFormError("");
        setLoading(true);

        try {

            const response = await login({ username, password });

            setSession(response.data.token, response.data.role);

            toast.success("Login Successful");

            navigate("/dashboard");

        } catch (error) {

            const message = error?.response?.status === 401
                ? "Invalid username or password."
                : getErrorMessage(error);

            setFormError(message);
            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "secondary.main",
                p: 2
            }}
        >
            <Paper elevation={6} sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 3 }}>
                <Stack spacing={1} sx={{ alignItems: "center", mb: 3 }}>
                    <LockOutlinedIcon color="primary" sx={{ fontSize: 36 }} />
                    <Typography variant="h5" fontWeight={700}>ECPMS</Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Employees Compliance Policy Management System
                    </Typography>
                </Stack>

                {formError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {formError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin} noValidate>
                    <Stack spacing={2.5}>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                        />

                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                        >
                            {loading ? "Signing In..." : "Login"}
                        </Button>
                    </Stack>
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    <Link to="/register" style={{ color: "inherit" }}>
                        New user? Register
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}

export default Login;
