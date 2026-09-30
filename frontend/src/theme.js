import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#38bdf8",
            contrastText: "#0f172a"
        },
        secondary: {
            main: "#0f172a"
        },
        background: {
            default: "#f1f5f9"
        },
        success: {
            main: "#22c55e"
        },
        error: {
            main: "#ef4444"
        },
        sidebar: {
            background: "#0f172a",
            hover: "#1e293b",
            text: "#cbd5e1"
        }
    },
    shape: {
        borderRadius: 10
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "sans-serif"
        ].join(","),
        h4: {
            fontWeight: 700
        },
        h6: {
            fontWeight: 600
        }
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true
            },
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none"
                }
            }
        }
    }
});

export default theme;
