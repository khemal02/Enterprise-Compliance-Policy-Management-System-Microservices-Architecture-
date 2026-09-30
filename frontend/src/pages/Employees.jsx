import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from "../services/employeeService";
import { getErrorMessage } from "../utils/errorMessage";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import TableSkeleton from "../components/common/TableSkeleton";
import ConfirmDialog from "../components/common/ConfirmDialog";

const EMPTY_EMPLOYEE = {
    employeeCode: "",
    name: "",
    email: "",
    department: "",
    managerId: ""
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Employees() {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [employee, setEmployee] = useState(EMPTY_EMPLOYEE);
    const [formErrors, setFormErrors] = useState({});

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => { loadEmployees(); }, []);

    const loadEmployees = async () => {
        setLoading(true);

        try {
            const response = await getAllEmployees();
            setEmployees(response.data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load employees."));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: undefined });
    };

    const validate = () => {
        const errors = {};

        if (!employee.employeeCode.trim()) errors.employeeCode = "Employee code is required";
        if (!employee.name.trim()) errors.name = "Name is required";
        if (!employee.email.trim()) errors.email = "Email is required";
        else if (!EMAIL_PATTERN.test(employee.email)) errors.email = "Enter a valid email address";
        if (!employee.department.trim()) errors.department = "Department is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const saveEmployee = async () => {
        if (!validate()) return;

        setSaving(true);

        try {
            if (editingId) {
                await updateEmployee(employee.id, employee);
                toast.success("Employee updated successfully");
            } else {
                await createEmployee(employee);
                toast.success("Employee added successfully");
            }

            setShowModal(false);
            setEditingId(null);
            setEmployee(EMPTY_EMPLOYEE);
            loadEmployees();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    const editEmployee = (emp) => {
        setEmployee({
            id: emp.id,
            employeeCode: emp.employeeCode,
            name: emp.name,
            email: emp.email,
            department: emp.department,
            managerId: emp.managerId ?? ""
        });
        setFormErrors({});
        setEditingId(emp.id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);

        try {
            await deleteEmployee(deleteTarget.id);
            toast.success("Employee deleted successfully");
            setDeleteTarget(null);
            loadEmployees();
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to delete employee."));
        } finally {
            setDeleting(false);
        }
    };

    const filteredEmployees = useMemo(() => employees.filter((emp) =>
        emp.employeeCode?.toLowerCase().includes(search.toLowerCase()) ||
        emp.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.department?.toLowerCase().includes(search.toLowerCase())
    ), [employees, search]);

    const currentEmployees = filteredEmployees.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box>
            <PageHeader
                title="Employee Management"
                searchValue={search}
                onSearchChange={(value) => { setSearch(value); setPage(0); }}
                searchPlaceholder="Search employee..."
                actionLabel="Add Employee"
                onAction={() => {
                    setEditingId(null);
                    setEmployee(EMPTY_EMPLOYEE);
                    setFormErrors({});
                    setShowModal(true);
                }}
            />

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Manager</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton columns={7} />
                        ) : currentEmployees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <EmptyState
                                        title="No employees found"
                                        subtitle={search ? "Try a different search term." : "Add your first employee to get started."}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentEmployees.map((emp) => (
                                <TableRow key={emp.id} hover>
                                    <TableCell>{emp.id}</TableCell>
                                    <TableCell>{emp.employeeCode}</TableCell>
                                    <TableCell>{emp.name}</TableCell>
                                    <TableCell>{emp.email}</TableCell>
                                    <TableCell>{emp.department}</TableCell>
                                    <TableCell>{emp.managerId}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" startIcon={<EditIcon />} onClick={() => editEmployee(emp)}>
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => setDeleteTarget(emp)}
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
                    count={filteredEmployees.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>

            <Dialog open={showModal} onClose={() => !saving && setShowModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editingId ? "Update Employee" : "Add Employee"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField
                            label="Employee Code"
                            name="employeeCode"
                            value={employee.employeeCode}
                            onChange={handleChange}
                            error={!!formErrors.employeeCode}
                            helperText={formErrors.employeeCode}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Name"
                            name="name"
                            value={employee.name}
                            onChange={handleChange}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={employee.email}
                            onChange={handleChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Department"
                            name="department"
                            value={employee.department}
                            onChange={handleChange}
                            error={!!formErrors.department}
                            helperText={formErrors.department}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Manager ID"
                            name="managerId"
                            type="number"
                            value={employee.managerId}
                            onChange={handleChange}
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
                        onClick={saveEmployee}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {editingId ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Employee"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                loading={deleting}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </Box>
    );
}

export default Employees;
