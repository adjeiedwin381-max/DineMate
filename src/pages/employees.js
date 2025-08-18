import { useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { Grid, Box, Card, CardContent, CardMedia, CardActions, Typography, Chip, Button, Stack, TextField, LinearProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Avatar from '@mui/material/Avatar';
import useEmployeesStore from '../lib/employeesStore';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Employees = () => {
    const theme = useTheme();
    const {
        employees,
        loading,
        name,
        position,
        editingRow,
        rowData,
        fetchEmployees,
        handleAddEmployee,
        handleEditStart,
        handleEditChange,
        handleEditStop,
        handleSave,
        handleDelete,
        handleEditRole,
        handleUpdateStatus,
    } = useEmployeesStore();

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const columns = [
        {
            field: 'image',
            headerName: 'Avatar',
            flex: 0.5,
            renderCell: (params) => (
                <Avatar alt={params.row.name} src={params.value} />
            ),
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            renderCell: (params) =>
                editingRow === params.id ? (
                    <TextField
                        size="small"
                        value={rowData.name || ''}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: 'status',
            headerName: 'Position',
            flex: 1,
            renderCell: (params) =>
                editingRow === params.id ? (
                    <FormControl size="small" fullWidth>
                        <Select
                            value={rowData.position || ''}
                            onChange={(e) => handleEditChange('status', e.target.value)}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="waiter">Waiter</MenuItem>
                        </Select>
                    </FormControl>
                ) : (
                    params.value
                ),
        },
        {
            field: 'password',
            headerName: 'Password',
            flex: 1,
            renderCell: (params) =>
                editingRow === params.id ? (
                    <TextField
                        size="small"
                        value={rowData.password || ''}
                        onChange={(e) => handleEditChange('password', e.target.value)}
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                editingRow === params.id ? (
                    <GridActionsCellItem
                        icon={<SaveIcon />}
                        label="Save"
                        onClick={() => handleSave(params.id)}
                    />
                ) : (
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => handleEditStart(params.id, params.row)}
                    />
                ),
                editingRow === params.id ? (
                    <GridActionsCellItem
                        icon={<CancelIcon />}
                        label="Cancel"
                        onClick={handleEditStop}
                    />
                ) : (
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDelete(params.id)}
                    />
                ),
            ],
        },
    ];

    return (
        <>
            <Box className="bg-white p-4 shadow-md" sx={{ borderRadius: 1 }}>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'nowrap' }}>
                    <TextField
                        size="large"
                        fullWidth
                        value={name}
                        onChange={(e) => useEmployeesStore.setState({ name: e.target.value })}
                        label="Name"
                        variant="outlined"
                    />
                    <FormControl size="large" fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={position}
                            onChange={(e) => useEmployeesStore.setState({ position: e.target.value })}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="waiter">Waiter</MenuItem>
                            <MenuItem value="waiter">Bartender</MenuItem>
                            <MenuItem value="waiter">Chef</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" sx={{ whiteSpace: 'nowrap' }} onClick={handleAddEmployee} fullWidth>
                        Add New Employee
                    </Button>
                </Stack>
            </Box>

            <Box
                className="my-2 bg-white p-4 shadow-md"
                sx={{
                    borderRadius: 1,
                    // height: loading ? 200 : 800, // Smaller height for loader, larger for table
                    // display: 'flex',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                }}
            >
                {loading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Grid container spacing={4}>
                            {employees.map((employee, i) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                <Card
                                    sx={{
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        cursor: 'pointer',
                                    }}
                                    >
                                    <CardMedia
                                        component="img"
                                        alt={employee.name}
                                        height="180"
                                        image={employee.image}
                                        sx={{ objectFit: 'cover' }}
                                    />

                                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" fontWeight={600}>
                                            {employee.name}
                                        </Typography>
                                        <Chip
                                            label={employee.status === 'active' ? 'Active' : 'Inactive'}
                                            color={employee.status === 'active' ? 'success' : 'error'}
                                            size="large"
                                        />
                                        </Box>
                                        <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        fontWeight={500}
                                        sx={{ textTransform: 'uppercase' }}
                                        >
                                        {employee.role}
                                        </Typography>
                                    </CardContent>

                                    <Box
                                        sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                        p: 2,
                                        }}
                                    >
                                        <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        startIcon={<EditIcon />}
                                        fullWidth
                                        onClick={() => handleEditRole(employee)}
                                        sx={{ py: 1.5 }}
                                        >
                                        Edit Role
                                        </Button>
                                        <Button
                                        variant="contained"
                                        color={employee.status === 'active' ? 'warning' : 'success'}
                                        size="large"
                                        startIcon={employee.status === 'active' ? <PersonOffIcon /> : <PersonAddIcon />}
                                        fullWidth
                                        onClick={() => handleUpdateStatus(employee)}
                                        sx={{ py: 1.5 }}
                                        >
                                        {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </Button>
                                        <Button
                                        variant="contained"
                                        color="error"
                                        size="large"
                                        startIcon={<DeleteIcon />}
                                        fullWidth
                                        onClick={() => handleDelete(employee)}
                                        sx={{ py: 1.5 }}
                                        >
                                        Delete
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                            ))}
                        </Grid>
                    </>
                )}
            </Box>
        </>
    );
};

export default Employees;