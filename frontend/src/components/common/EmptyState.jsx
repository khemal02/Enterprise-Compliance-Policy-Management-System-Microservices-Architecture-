import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

function EmptyState({ title = "No records found", subtitle, icon }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                py: 6,
                color: "text.secondary"
            }}
        >
            {icon || <InboxIcon sx={{ fontSize: 40, opacity: 0.5 }} />}
            <Typography variant="subtitle1" fontWeight={600}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
}

export default EmptyState;
