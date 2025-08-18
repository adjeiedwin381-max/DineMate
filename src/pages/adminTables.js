import Box from '@mui/material/Box';
import { useEffect } from "react";
import { 
    Grid, 
    Button, 
    Stack, 
    TextField, 
    FormControl, 
    Modal, 
    Fade, 
    Backdrop, 
    InputLabel, 
    Select, 
    MenuItem, 
    LinearProgress,
    Typography
} from '@mui/material';
import TableCard from '../components/TableCard';
import useAdminTablesStore from '../lib/adminTablesStore';
import { format } from 'date-fns';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '800px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AdminTables = () => {
    const {
        tables,
        loading,
        table_no,
        getTables,
        handleAddTable,
        handleAssign,
        openAvailable,
        open,
        handleAssignAdmin,
        handleResetTable,
        handleOpenOccupied,
        handleClose,
        handleCloseAvailable,
        employee,
        getEmployee,
        getEmployees,
        employees,
        selectedTable,
        itemsLoading,
        assignEmployee,
        items,
        order,
        totalQty,
        totalPrice,
    } = useAdminTablesStore();

    useEffect(() => {
        getEmployee();
        getEmployees();
        getTables();
    }, [getTables, getEmployees, getEmployee]);

    function formatDateTime(isoString) {
        const date = new Date(isoString);
        return format(date, "EEE dd MMM yy, hh:mm a").toUpperCase();;
    }

    return (
        <>
            <Box className="my-2 bg-white p-4 rounded-lg shadow-md" sx={{ borderRadius: '4px', marginBottom: 3 }}>
                <Stack direction="row" spacing={2}  >
                    <TextField
                        size="large"
                        value={table_no}
                        onChange={(e) => useAdminTablesStore.setState({ table_no: e.target.value })}
                        label="Table Number"
                        variant="outlined"
                    />
                    <Button variant="contained" sx={{ whiteSpace: 'nowrap' }} onClick={handleAddTable} >
                        Add New Table
                    </Button>
                </Stack>
            </Box>

            <Box
                className="my-2 bg-white p-4 rounded-lg shadow-md"
            >
                {loading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {tables?.map((table, i) => (
                                <Grid item xs={12} sm={6} md={3} lg={3} key={i}>
                                    <TableCard table={table} handleAssign={() => handleAssign(table, employee)} handleOpenOccupied={() => handleOpenOccupied(table, employee)} isAdmin={true} />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
            </Box>

            {/* Modal for available */}
            {openAvailable && (
                <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openAvailable}
                onClose={handleCloseAvailable}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                    timeout: 500,
                    },
                }}
                >
                <Fade in={openAvailable}>
                    <Box sx={style}>
                    <FormControl fullWidth>
                        <InputLabel id="assign-waiter-label">Assign Waiter</InputLabel>
                        <Select
                            labelId="assign-waiter-label"
                            id="assign-waiter"
                            value={assignEmployee}
                            label="Assign Waiter"
                            onChange={handleAssignAdmin}
                        >
                        {employees?.map((employee) => (
                            <MenuItem key={employee.id} value={employee.id}>{employee.name}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </Box>
                </Fade>
                </Modal>
            )}

            {/* Modal for occupied */}
            {open && (
                <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                    timeout: 500,
                    },
                }}
                sx={{ minWidth: 950 }}
                >
                <Fade in={open}>
                    <Box sx={style}>
                    { itemsLoading ? 
                        <LinearProgress /> 
                        : 
                        (
                        <span>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="title">
                                    ORDER NO. {order?.id}
                                </Typography>
                                <Typography variant="title">
                                    SERVED BY {order?.waiter?.name}
                                </Typography>
                                <Typography variant="body1">
                                    ORDERED AT {formatDateTime(order?.created_at)}
                                </Typography>
                            </Box>
                            {items.length > 0 ? (
                            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <table className="table table-striped">
                                <thead className="table-dark">
                                    <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {item?.menuItems ? (
                                        <>
                                            <td>{item.menuItems.item_name} {item.menuItems.description}</td>
                                            <td>&#163; {item.menuItems.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>&#163; {item.menuItems.price * item.quantity}</td>
                                        </>
                                        ) : (
                                        <>
                                            <td>{item.drinks.name.toUpperCase()}</td>
                                            <td>&#163; {item.drinks.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>&#163; {item.total}</td>
                                        </>
                                        )}
                                    </tr>
                                    ))}
                                    <tr className="table-dark">
                                    <td colSpan="3">Total</td>
                                    <td>{totalQty}</td>
                                    <td>&#163; {totalPrice.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            ) : (
                            <div className="text-center">
                                <p><em><strong>NOTHING ORDERED YET</strong></em></p>
                                <button className="btn btn-danger" onClick={() => handleResetTable(selectedTable)}>Close Table</button>
                            </div>
                            )}
                        </span>
                        )
                    }
                    </Box>
                </Fade>
                </Modal>
            )}
        </>
    );
};

export default AdminTables;