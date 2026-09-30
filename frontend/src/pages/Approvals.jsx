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
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { getAllApprovals, createApproval, approveApproval, rejectApproval } from "../services/approvalService";
import { getAllCompliances } from "../services/complianceService";
import { getAllEmployees } from "../services/employeeService";
import { getErrorMessage } from "../utils/errorMessage";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import TableSkeleton from "../components/common/TableSkeleton";
import ConfirmDialog from "../components/common/ConfirmDialog";

const EMPTY_APPROVAL = { complianceId: "", approverId: "", remarks: "" };

const STATUS_COLORS = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "error"
};

function Approvals() {

    const [approvals, setApprovals] = useState([]);
    const [compliances, setCompliances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [approval, setApproval] = useState(EMPTY_APPROVAL);
    const [formErrors, setFormErrors] = useState({});

    const [actionTarget, setActionTarget] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadApprovals();
        loadCompliances();
        loadEmployees();
    }, []);

    const loadApprovals = async () => {
        setLoading(true);

        try {
            const response = await getAllApprovals();
            setApprovals(response.data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load approvals."));
        } finally {
            setLoading(false);
        }
    };

    const loadCompliances = async () => {
        try {
            const response = await getAllCompliances();
            setCompliances(response.data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load compliances."));
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

    const handleChange = (e) => {
        setApproval({ ...approval, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: undefined });
    };

    const validate = () => {
        const errors = {};
        if (!approval.complianceId) errors.complianceId = "Compliance is required";
        if (!approval.approverId) errors.approverId = "Approver is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const saveApproval = async () => {
        if (!validate()) return;
        setSaving(true);

        try {
            await createApproval(approval);
            toast.success("Approval created successfully");
            setShowModal(false);
            setApproval(EMPTY_APPROVAL);
            loadApprovals();
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to create approval."));
        } finally {
            setSaving(false);
        }
    };

    const runAction = async () => {
        if (!actionTarget || !actionType) return;
        setActionLoading(true);

        try {
            if (actionType === "approve") {
                await approveApproval(actionTarget.id);
                toast.success("Approved successfully");
            } else {
                await rejectApproval(actionTarget.id);
                toast.success("Rejected successfully");
            }

            setActionTarget(null);
            setActionType(null);
            loadApprovals();
        } catch (error) {
            toast.error(getErrorMessage(error, "Action failed."));
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = useMemo(() => approvals.filter((item) => {
        const approverName = employees.find((emp) => emp.id === item.approverId)?.name || "";

        return (
            approverName.toLowerCase().includes(search.toLowerCase()) ||
            item.status?.toLowerCase().includes(search.toLowerCase()) ||
            item.remarks?.toLowerCase().includes(search.toLowerCase()) ||
            item.complianceId?.toString().includes(search)
        );
    }), [approvals, employees, search]);

    const currentRecords = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            <PageHeader
                title="Approval Management"
                searchValue={search}
                onSearchChange={(value) => { setSearch(value); setPage(0); }}
                searchPlaceholder="Search approvals..."
                actionLabel="Create Approval"
                onAction={() => { setApproval(EMPTY_APPROVAL); setFormErrors({}); setShowModal(true); }}
            />

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Compliance</TableCell>
                            <TableCell>Approver</TableCell>
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
                                        title="No approvals found"
                                        subtitle={search ? "Try a different search term." : "Create an approval to get started."}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentRecords.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.complianceId}</TableCell>
                                    <TableCell>
                                        {employees.find((emp) => emp.id === item.approverId)?.name || item.approverId}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.status}
                                            size="small"
                                            color={STATUS_COLORS[item.status] || "default"}
                                        />
                                    </TableCell>
                                    <TableCell>{item.remarks}</TableCell>
                                    <TableCell align="right">
                                        {item.status === "PENDING" && (
                                            <>
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    startIcon={<CheckIcon />}
                                                    onClick={() => { setActionTarget(item); setActionType("approve"); }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    startIcon={<CloseIcon />}
                                                    onClick={() => { setActionTarget(item); setActionType("reject"); }}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
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
                <DialogTitle>Create Approval</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField
                            select
                            label="Compliance"
                            name="complianceId"
                            value={approval.complianceId}
                            onChange={handleChange}
                            error={!!formErrors.complianceId}
                            helperText={formErrors.complianceId}
                            fullWidth
                            required
                        >
                            {compliances.map((c) => (
                                <MenuItem key={c.id} value={c.id}>Compliance #{c.id}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Approver"
                            name="approverId"
                            value={approval.approverId}
                            onChange={handleChange}
                            error={!!formErrors.approverId}
                            helperText={formErrors.approverId}
                            fullWidth
                            required
                        >
                            {employees.map((emp) => (
                                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Remarks"
                            name="remarks"
                            value={approval.remarks}
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
                        onClick={saveApproval}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={!!actionTarget}
                title={actionType === "approve" ? "Approve Request" : "Reject Request"}
                message={
                    actionType === "approve"
                        ? "Approve this compliance request?"
                        : "Reject this compliance request?"
                }
                confirmLabel={actionType === "approve" ? "Approve" : "Reject"}
                confirmColor={actionType === "approve" ? "success" : "error"}
                loading={actionLoading}
                onClose={() => { setActionTarget(null); setActionType(null); }}
                onConfirm={runAction}
            />
        </Box>
    );
}

export default Approvals;
