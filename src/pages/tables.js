import React, { useEffect } from 'react';
import { Box, Grid, Typography, Modal, Fade, Backdrop, FormControl, ToggleButtonGroup, ToggleButton, Button, InputLabel, MenuItem, Select, LinearProgress } from '@mui/material';
import TableCard from '../components/TableCard';
import useTablesStore from '../lib/tablesStore';
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

const Tables = () => {
  const {
    tables,
    employee,
    tableStatus,
    openAvailable,
    open,
    selectedTable,
    assignEmployee,
    order,
    items,
    totalQty,
    totalPrice,
    employees,
    loading,
    itemsLoading,
    setTableStatus,
    getTables,
    getEmployee,
    getEmployees,
    getTablesByStatus,
    handleAssign,
    handleAssignAdmin,
    handleResetTable,
    handleOpenOccupied,
    handleClose,
    handleCloseAvailable
  } = useTablesStore();


  useEffect(() => {
    getEmployee();
    getEmployees();
    getTables();
  }, [getTables, getEmployees, getEmployee]);

  useEffect(() => {
    if (employee.role) {
      getTablesByStatus(tableStatus);
    }
  }, [tableStatus, employee, getTablesByStatus]);


  function formatDateTime(isoString) {
    const date = new Date(isoString);
    return format(date, "EEE dd MMM yy, hh:mm a").toUpperCase();;
  }

  const isAdmin = employee.role === 'admin';

  return (
    <>
      <Box
        sx={{
          my: 1,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <ToggleButtonGroup
          value={tableStatus}
          exclusive
          onChange={(_, value) => value && setTableStatus(value)}
          sx={{
            width: '100%',
            '& .MuiToggleButton-root': {
              flex: 1,
              py: 4,
              fontSize: '1.2rem',
              fontWeight: 600,
              border: 'none',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                color: '#fff',
              },
            },
          }}
        >
          <ToggleButton value="all" sx={{ bgcolor: tableStatus === 'all' ? 'primary.main' : 'grey.200' }}>
            All
          </ToggleButton>
          <ToggleButton value="available" sx={{ bgcolor: tableStatus === 'available' ? 'success.main' : 'grey.200' }}>
            Available
          </ToggleButton>
          <ToggleButton value="occupied" sx={{ bgcolor: tableStatus === 'occupied' ? 'warning.main' : 'grey.200' }}>
            Occupied
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box className="bg-white p-4 rounded-lg shadow-md" sx={{ borderRadius: 1 }}>
        {loading ? (
          <Box>
            <LinearProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {tables?.map((table, i) => (
              <Grid item xs={12} sm={6} md={3} lg={3} key={i}>
                <TableCard table={table} handleAssign={() => handleAssign(table, employee)} handleOpenOccupied={() => handleOpenOccupied(table, employee)} isAdmin={false} />
              </Grid>
            ))}
          </Grid>
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
                        {order?.waiter?.name}
                      </Typography>
                      <Typography variant="body1">
                        {formatDateTime(order?.created_at)}
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
                      <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary" fontStyle="italic" fontWeight="bold">
                          NOTHING ORDERED YET
                        </Typography>
                        <Button
                          variant="contained"
                          color="error"
                          size="large"
                          sx={{ mt: 2, px: 4, borderRadius: 2 }}
                          onClick={() => handleResetTable(selectedTable)}
                        >
                          Close Table
                        </Button>
                      </Box>

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

export default Tables;