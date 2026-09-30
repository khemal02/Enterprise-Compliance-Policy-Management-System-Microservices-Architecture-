import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

function PageHeader({
    title,
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search...",
    actionLabel,
    onAction,
    actionIcon = <AddIcon />
}) {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 3
            }}
        >
            <Typography variant="h5" fontWeight={700}>
                {title}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                {onSearchChange && (
                    <TextField
                        size="small"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        sx={{ minWidth: 240 }}
                    />
                )}

                {actionLabel && (
                    <Button variant="contained" startIcon={actionIcon} onClick={onAction}>
                        {actionLabel}
                    </Button>
                )}
            </Stack>
        </Box>
    );
}

export default PageHeader;
