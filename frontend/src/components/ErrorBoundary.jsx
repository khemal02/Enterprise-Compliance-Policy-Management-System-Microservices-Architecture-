import { Component } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";

class ErrorBoundary extends Component {

    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Unhandled UI error:", error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "background.default"
                    }}
                >
                    <Stack spacing={2} sx={{ alignItems: "center", maxWidth: 420, textAlign: "center", p: 3 }}>
                        <ErrorOutlineIcon color="error" sx={{ fontSize: 56 }} />
                        <Typography variant="h6">Something went wrong</Typography>
                        <Typography variant="body2" color="text.secondary">
                            An unexpected error occurred while rendering this page. Try reloading —
                            if the problem continues, contact your administrator.
                        </Typography>
                        <Button variant="contained" onClick={this.handleReload}>
                            Reload Page
                        </Button>
                    </Stack>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
