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
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import { register } from "../services/authService";
import { getErrorMessage } from "../utils/errorMessage";

const ROLE_OPTIONS = ["ADMIN", "MANAGER", "EMPLOYEE"];

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setFormError("");
        setLoading(true);

        try {
            await register({ username, password, role });

            toast.success("Registration Successful");
            navigate("/");
        } catch (error) {
            const message = getErrorMessage(error, "Registration failed. Please try again.");
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
                    <PersonAddAltIcon color="primary" sx={{ fontSize: 36 }} />
                    <Typography variant="h5" fontWeight={700}>Register</Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Create your ECPMS account
                    </Typography>
                </Stack>

                {formError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {formError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleRegister} noValidate>
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

                        <TextField
                            select
                            label="Role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            fullWidth
                        >
                            {ROLE_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                        >
                            {loading ? "Creating Account..." : "Register"}
                        </Button>
                    </Stack>
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    <Link to="/" style={{ color: "inherit" }}>
                        Already have an account? Login
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}

export default Register;
