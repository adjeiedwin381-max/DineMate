import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Modal,
  Fade,
  Backdrop,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  InputLabel,
  MenuItem,
  Select,
  LinearProgress,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  TableBar,
  EventSeat,
  HourglassBottom,
  CheckCircle,
} from "@mui/icons-material";
import useTablesStore from "../lib/tablesStore";
import { format } from "date-fns";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "850px",
  bgcolor: "background.paper",
  borderRadius: 3,
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
    handleCloseAvailable,
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
    return format(date, "EEE dd MMM yy, hh:mm a").toUpperCase();
  }

  return (
    <>
      {/* Filter Buttons */}
      <Box sx={{ my: 2 }}>
        <ToggleButtonGroup
          value={tableStatus}
          exclusive
          onChange={(_, value) => value && setTableStatus(value)}
          sx={{
            width: "100%",
            "& .MuiToggleButton-root": {
              flex: 1,
              py: 3,
              fontSize: "1rem",
              fontWeight: 600,
              border: "1px solid #ddd",
              borderRadius: "12px !important",
              textTransform: "capitalize",
              transition: "0.2s",
              "&.Mui-selected": {
                color: "#fff",
              },
            },
          }}
        >
          <ToggleButton
            value="all"
            sx={{
              bgcolor: tableStatus === "all" ? "primary.main" : "grey.100",
              color: tableStatus === "all" ? "white" : "text.primary",
            }}
          >
            <TableBar sx={{ mr: 1 }} /> All
          </ToggleButton>
          <ToggleButton
            value="available"
            sx={{
              bgcolor:
                tableStatus === "available" ? "success.main" : "grey.100",
              color: tableStatus === "available" ? "white" : "text.primary",
            }}
          >
            <EventSeat sx={{ mr: 1 }} /> Available
          </ToggleButton>
          <ToggleButton
            value="occupied"
            sx={{
              bgcolor: tableStatus === "occupied" ? "warning.main" : "grey.100",
              color: tableStatus === "occupied" ? "white" : "text.primary",
            }}
          >
            <HourglassBottom sx={{ mr: 1 }} /> Occupied
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Table Cards */}
      <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2 }}>
        {loading ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={3}>
            {tables?.map((table, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "scale(1.03)",
                    },
                  }}
                  onClick={() =>
                    table.status === "occupied"
                      ? handleOpenOccupied(table, employee)
                      : handleAssign(table, employee)
                  }
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Table {table.number}
                    </Typography>
                    <Chip
                      label={table.status.toUpperCase()}
                      color={
                        table.status === "available"
                          ? "success"
                          : table.status === "occupied"
                          ? "warning"
                          : "default"
                      }
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Modal for assigning waiter */}
      {openAvailable && (
        <Modal
          open={openAvailable}
          onClose={handleCloseAvailable}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={openAvailable}>
            <Box sx={modalStyle}>
              <Typography variant="h6" mb={2} fontWeight="bold">
                Assign Waiter
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="assign-waiter-label">Waiter</InputLabel>
                <Select
                  labelId="assign-waiter-label"
                  id="assign-waiter"
                  value={assignEmployee}
                  onChange={handleAssignAdmin}
                >
                  {employees?.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleCloseAvailable}
              >
                Confirm
              </Button>
            </Box>
          </Fade>
        </Modal>
      )}

      {/* Modal for occupied tables */}
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={open}>
            <Box sx={modalStyle}>
              {itemsLoading ? (
                <LinearProgress />
              ) : (
                <>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Order #{order?.id}
                    </Typography>
                    <Typography>{order?.waiter?.name}</Typography>
                    <Typography variant="body2">
                      {formatDateTime(order?.created_at)}
                    </Typography>
                  </Box>
                  {items.length > 0 ? (
                    <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
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
                              <td>
                                {item?.menuItems
                                  ? `${item.menuItems.item_name} ${item.menuItems.description}`
                                  : item.drinks?.name}
                              </td>
                              <td>
                                £{" "}
                                {item?.menuItems
                                  ? item.menuItems.price
                                  : item.drinks?.price}
                              </td>
                              <td>{item.quantity}</td>
                              <td>
                                £{" "}
                                {item.total ||
                                  item.menuItems.price * item.quantity}
                              </td>
                            </tr>
                          ))}
                          <tr className="table-dark">
                            <td colSpan="3">Total</td>
                            <td>{totalQty}</td>
                            <td>£ {totalPrice.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        No items ordered yet
                      </Typography>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ mt: 2 }}
                        onClick={() => handleResetTable(selectedTable)}
                      >
                        Close Table
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
};

export default Tables;