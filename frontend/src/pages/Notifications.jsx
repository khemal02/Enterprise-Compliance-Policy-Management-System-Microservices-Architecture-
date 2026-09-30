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

import { getAllNotifications } from "../services/notificationService";
import { getAllEmployees } from "../services/employeeService";
import { getErrorMessage } from "../utils/errorMessage";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import TableSkeleton from "../components/common/TableSkeleton";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        loadNotifications();
        loadEmployees();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);

        try {
            const response = await getAllNotifications();
            setNotifications(response.data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load notifications."));
        } finally {
            setLoading(false);
        }
    };

    const loadEmployees = async () => {
        try {
            const response = await getAllEmployees();
            setEmployees(response.data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load employees."));
        }
    };

    const filtered = useMemo(() => notifications.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.message?.toLowerCase().includes(search.toLowerCase()) ||
        item.type?.toLowerCase().includes(search.toLowerCase())
    ), [notifications, search]);

    const currentRecords = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            <PageHeader
                title="Notifications"
                searchValue={search}
                onSearchChange={(value) => { setSearch(value); setPage(0); }}
                searchPlaceholder="Search notification..."
            />

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Recipient</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton columns={6} />
                        ) : currentRecords.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <EmptyState
                                        title="No notifications found"
                                        subtitle={search ? "Try a different search term." : "You're all caught up."}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentRecords.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>
                                        {employees.find((emp) => emp.id === item.userId)?.name || item.userId}
                                    </TableCell>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.message}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.sent ? "Sent" : "Pending"}
                                            size="small"
                                            color={item.sent ? "success" : "warning"}
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                                </TableRow>
                            ))
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
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>
        </Box>
    );
}

export default Notifications;
