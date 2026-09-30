import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { getAllCompliances, createCompliance, updateComplianceStatus, deleteCompliance } from "../services/complianceService";
import { getAllEmployees } from "../services/employeeService";
import { getAllPolicies } from "../services/policyService";
import { getErrorMessage } from "../utils/errorMessage";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import TableSkeleton from "../components/common/TableSkeleton";
import ConfirmDialog from "../components/common/ConfirmDialog";

const EMPTY_COMPLIANCE = { employeeId: "", policyId: "", remarks: "" };

const STATUS_COLORS = {
    PENDING: "warning",
    COMPLETED: "success",
    REJECTED: "error"
};

function Compliance() {

    const [compliances, setCompliances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [compliance, setCompliance] = useState(EMPTY_COMPLIANCE);
    const [formErrors, setFormErrors] = useState({});

    const [statusUpdatingId, setStatusUpdatingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadCompliances();
        loadEmployees();
        loadPolicies();
    }, []);

    const loadCompliances = async () => {
        setLoading(true);

        try {
            const response = await getAllCompliances();
            setCompliances(response.data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load compliance records."));
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

    const loadPolicies = async () => {
        try {
            const response = await getAllPolicies();
            setPolicies(response.data.content);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load policies."));
        }
    };

    const handleChange = (e) => {
        setCompliance({ ...compliance, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: undefined });
    };

    const validate = () => {
        const errors = {};
        if (!compliance.employeeId) errors.employeeId = "Employee is required";
        if (!compliance.policyId) errors.policyId = "Policy is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const saveCompliance = async () => {
        if (!validate()) return;
        setSaving(true);

        try {
            await createCompliance(compliance);
            toast.success("Compliance assigned successfully");
            setShowModal(false);
            setCompliance(EMPTY_COMPLIANCE);
            loadCompliances();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    const changeStatus = async (id, status) => {
        setStatusUpdatingId(id);

        try {
            await updateComplianceStatus(id, status);
            toast.success("Status updated");
            loadCompliances();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);

        try {
            await deleteCompliance(deleteTarget.id);
            toast.success("Deleted successfully");
            setDeleteTarget(null);
            loadCompliances();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setDeleting(false);
        }
    };

    const filtered = useMemo(() => compliances.filter((c) =>
        c.employeeId?.toString().includes(search) ||
        c.policyId?.toString().includes(search) ||
        c.status?.toLowerCase().includes(search.toLowerCase())
    ), [compliances, search]);

    const currentRecords = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            <PageHeader
                title="Compliance Management"
                searchValue={search}
                onSearchChange={(value) => { setSearch(value); setPage(0); }}
                searchPlaceholder="Search compliance..."
                actionLabel="Assign Compliance"
                onAction={() => { setCompliance(EMPTY_COMPLIANCE); setFormErrors({}); setShowModal(true); }}
            />

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Employee</TableCell>
                            <TableCell>Policy</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Remarks</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton columns={6} />
                        ) : currentRecords.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <EmptyState
                                        title="No compliance records found"
                                        subtitle={search ? "Try a different search term." : "Assign a compliance record to get started."}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentRecords.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>
                                        {employees.find((emp) => emp.id === item.employeeId)?.name || item.employeeId}
                                    </TableCell>
                                    <TableCell>
                                        {policies.find((p) => p.id === item.policyId)?.policyName || item.policyId}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                            <Chip
                                                label={item.status}
                                                size="small"
                                                color={STATUS_COLORS[item.status] || "default"}
                                            />
                                            <Select
                                                size="small"
                                                value={item.status}
                                                disabled={statusUpdatingId === item.id}
                                                onChange={(e) => changeStatus(item.id, e.target.value)}
                                            >
                                                <MenuItem value="PENDING">PENDING</MenuItem>
                                                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                                                <MenuItem value="REJECTED">REJECTED</MenuItem>
                                            </Select>
                                            {statusUpdatingId === item.id && <CircularProgress size={16} />}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{item.remarks}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => setDeleteTarget(item)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
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

            <Dialog open={showModal} onClose={() => !saving && setShowModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>Assign Compliance</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField
                            select
                            label="Employee"
                            name="employeeId"
                            value={compliance.employeeId}
                            onChange={handleChange}
                            error={!!formErrors.employeeId}
                            helperText={formErrors.employeeId}
                            fullWidth
                            required
                        >
                            {employees.map((emp) => (
                                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Policy"
                            name="policyId"
                            value={compliance.policyId}
                            onChange={handleChange}
                            error={!!formErrors.policyId}
                            helperText={formErrors.policyId}
                            fullWidth
                            required
                        >
                            {policies.map((p) => (
                                <MenuItem key={p.id} value={p.id}>{p.policyName}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Remarks"
                            name="remarks"
                            value={compliance.remarks}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setShowModal(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={saveCompliance}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Compliance Record"
                message="Are you sure you want to delete this compliance record? This action cannot be undone."
                confirmLabel="Delete"
                loading={deleting}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </Box>
    );
}

export default Compliance;
