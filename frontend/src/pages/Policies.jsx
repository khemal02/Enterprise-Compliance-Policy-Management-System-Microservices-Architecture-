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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { getAllPolicies, createPolicy, updatePolicy, deletePolicy, activatePolicy } from "../services/policyService";
import { getErrorMessage } from "../utils/errorMessage";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import TableSkeleton from "../components/common/TableSkeleton";
import ConfirmDialog from "../components/common/ConfirmDialog";

const EMPTY_POLICY = {
    policyName: "",
    description: "",
    effectiveDate: "",
    expiryDate: ""
};

function Policies() {

    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [search, setSearch] = useState("");
    const [policy, setPolicy] = useState(EMPTY_POLICY);
    const [formErrors, setFormErrors] = useState({});

    const [actionTarget, setActionTarget] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadPolicies(); }, [page, rowsPerPage]);

    const loadPolicies = async () => {
        setLoading(true);

        try {
            const response = await getAllPolicies(page, rowsPerPage);
            setPolicies(response.data.content);
            setTotalElements(response.data.totalElements ?? response.data.content.length);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load policies."));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setPolicy({ ...policy, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: undefined });
    };

    const openAddModal = () => {
        setEditing(false);
        setSelectedId(null);
        setPolicy(EMPTY_POLICY);
        setFormErrors({});
        setShowModal(true);
    };

    const openEditModal = (p) => {
        setEditing(true);
        setSelectedId(p.id);
        setPolicy({
            policyName: p.policyName,
            description: p.description,
            effectiveDate: p.effectiveDate,
            expiryDate: p.expiryDate
        });
        setFormErrors({});
        setShowModal(true);
    };

    const validate = () => {
        const errors = {};

        if (!policy.policyName.trim()) errors.policyName = "Policy name is required";
        if (!policy.effectiveDate) errors.effectiveDate = "Effective date is required";
        if (!policy.expiryDate) errors.expiryDate = "Expiry date is required";
        else if (policy.effectiveDate && policy.expiryDate < policy.effectiveDate) {
            errors.expiryDate = "Expiry date cannot be before the effective date";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const savePolicy = async () => {
        if (!validate()) return;

        setSaving(true);

        try {
            if (editing) {
                await updatePolicy(selectedId, policy);
                toast.success("Policy updated successfully");
            } else {
                await createPolicy(policy);
                toast.success("Policy created successfully");
            }

            setShowModal(false);
            loadPolicies();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    const runAction = async () => {
        if (!actionTarget || !actionType) return;
        setActionLoading(true);

        try {
            if (actionType === "delete") {
                await deletePolicy(actionTarget.id);
                toast.success("Policy deleted successfully");
            } else {
                await activatePolicy(actionTarget.id);
                toast.success("Policy activated successfully");
            }

            setActionTarget(null);
            setActionType(null);
            loadPolicies();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setActionLoading(false);
        }
    };

    const filteredPolicies = useMemo(() => policies.filter((p) =>
        p.policyCode?.toLowerCase().includes(search.toLowerCase()) ||
        p.policyName?.toLowerCase().includes(search.toLowerCase())
    ), [policies, search]);

    return (
        <Box>
            <PageHeader
                title="Policy Management"
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search policy..."
                actionLabel="Add Policy"
                onAction={openAddModal}
            />

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton columns={7} />
                        ) : filteredPolicies.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <EmptyState
                                        title="No policies found"
                                        subtitle={search ? "Try a different search term." : "Add your first policy to get started."}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPolicies.map((p) => (
                                <TableRow key={p.id} hover>
                                    <TableCell>{p.id}</TableCell>
                                    <TableCell>{p.policyCode}</TableCell>
                                    <TableCell>{p.policyName}</TableCell>
                                    <TableCell sx={{ maxWidth: 240 }}>{p.description}</TableCell>
                                    <TableCell>{p.version}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.status}
                                            size="small"
                                            color={p.status === "ACTIVE" ? "success" : "default"}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button size="small" startIcon={<EditIcon />} onClick={() => openEditModal(p)}>
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => { setActionTarget(p); setActionType("delete"); }}
                                        >
                                            Delete
                                        </Button>
                                        {p.status === "DRAFT" && (
                                            <Button
                                                size="small"
                                                color="success"
                                                startIcon={<CheckCircleOutlineIcon />}
                                                onClick={() => { setActionTarget(p); setActionType("activate"); }}
                                            >
                                                Activate
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={totalElements}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>

            <Dialog open={showModal} onClose={() => !saving && setShowModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editing ? "Edit Policy" : "Add Policy"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField
                            label="Policy Name"
                            name="policyName"
                            value={policy.policyName}
                            onChange={handleChange}
                            error={!!formErrors.policyName}
                            helperText={formErrors.policyName}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={policy.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            fullWidth
                        />
                        <TextField
                            label="Effective Date"
                            name="effectiveDate"
                            type="date"
                            value={policy.effectiveDate}
                            onChange={handleChange}
                            error={!!formErrors.effectiveDate}
                            helperText={formErrors.effectiveDate}
                            slotProps={{ inputLabel: { shrink: true } }}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Expiry Date"
                            name="expiryDate"
                            type="date"
                            value={policy.expiryDate}
                            onChange={handleChange}
                            error={!!formErrors.expiryDate}
                            helperText={formErrors.expiryDate}
                            slotProps={{ inputLabel: { shrink: true } }}
                            fullWidth
                            required
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setShowModal(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={savePolicy}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {editing ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={!!actionTarget}
                title={actionType === "activate" ? "Activate Policy" : "Delete Policy"}
                message={
                    actionType === "activate"
                        ? `Activate "${actionTarget?.policyName}"? This will make it the current effective version.`
                        : `Delete "${actionTarget?.policyName}"? This action cannot be undone.`
                }
                confirmLabel={actionType === "activate" ? "Activate" : "Delete"}
                confirmColor={actionType === "activate" ? "success" : "error"}
                loading={actionLoading}
                onClose={() => { setActionTarget(null); setActionType(null); }}
                onConfirm={runAction}
            />
        </Box>
    );
}

export default Policies;
