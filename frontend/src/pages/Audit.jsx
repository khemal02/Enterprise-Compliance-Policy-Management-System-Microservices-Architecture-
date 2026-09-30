import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
    Box,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";

import { getAllAudits } from "../services/auditService";
import { getErrorMessage } from "../utils/errorMessage";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import TableSkeleton from "../components/common/TableSkeleton";

const ACTION_COLORS = {
    CREATE: "success",
    UPDATE: "info",
    DELETE: "error",
    APPROVE: "success",
    REJECT: "error",
    LOGIN: "default"
};

function formatTimestamp(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function Audit() {

    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => { loadAudits(); }, []);

    const loadAudits = async () => {
        setLoading(true);

        try {
            const response = await getAllAudits();
            setAudits(response.data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load audit logs."));
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => audits.filter((item) => {
        const term = search.toLowerCase();
        const actor = item.actor || item.username || item.performedBy || "";
        const action = item.action || item.eventType || "";
        const entity = item.entity || item.module || "";
        const details = item.details || item.description || "";

        return (
            actor.toLowerCase().includes(term) ||
            action.toLowerCase().includes(term) ||
            entity.toLowerCase().includes(term) ||
            details.toLowerCase().includes(term)
        );
    }), [audits, search]);

    const currentRecords = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            <PageHeader
                title="Audit Logs"
                searchValue={search}
                onSearchChange={(value) => { setSearch(value); setPage(0); }}
                searchPlaceholder="Search audit logs..."
            />

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Entity</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton columns={6} />
                        ) : currentRecords.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <EmptyState
                                        title="No audit activity found"
                                        subtitle={search ? "Try a different search term." : "System activity will appear here as it happens."}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentRecords.map((item) => {
                                const action = item.action || item.eventType || "—";

                                return (
                                    <TableRow key={item.id} hover>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.actor || item.username || item.performedBy || "System"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={action}
                                                size="small"
                                                color={ACTION_COLORS[action?.toUpperCase()] || "default"}
                                            />
                                        </TableCell>
                                        <TableCell>{item.entity || item.module || "—"}</TableCell>
                                        <TableCell>{item.details || item.description || "—"}</TableCell>
                                        <TableCell>{formatTimestamp(item.createdAt || item.timestamp)}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={filtered.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[10, 25, 50]}
                />
            </TableContainer>
        </Box>
    );
}

export default Audit;
