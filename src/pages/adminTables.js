import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  Modal,
  Fade,
  Backdrop,
  Stack,
  Paper,
} from "@mui/material";
import {
  TableRestaurant,
  EventSeat,
  LocalDining,
  LockClock,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import ColorModeSelect from "./auth/components/shared-theme/AppTheme";

const dummyTables = [
  { id: 1, name: "Table 1", status: "available", seats: 4 },
  { id: 2, name: "Table 2", status: "occupied", seats: 2, waiter: "John" },
  { id: 3, name: "Table 3", status: "reserved", seats: 6 },
  { id: 4, name: "Table 4", status: "occupied", seats: 4, waiter: "Mary" },
  { id: 5, name: "Table 5", status: "available", seats: 8 },
  { id: 6, name: "Table 6", status: "reserved", seats: 2 },
  { id: 7, name: "Table 7", status: "available", seats: 4 },
  { id: 8, name: "Table 8", status: "occupied", seats: 6, waiter: "Sam" },
];

const dummyOrders = {
  2: {
    id: "ORD-1001",
    waiter: "John",
    created_at: "2025-08-23T14:35:00Z",
    items: [
      { id: 1, name: "Cheeseburger", price: 12, qty: 2 },
      { id: 2, name: "Coke", price: 3, qty: 2 },
    ],
  },
  4: {
    id: "ORD-1002",
    waiter: "Mary",
    created_at: "2025-08-23T15:00:00Z",
    items: [
      { id: 1, name: "Pizza", price: 15, qty: 1 },
      { id: 2, name: "Beer", price: 5, qty: 3 },
    ],
  },
  8: {
    id: "ORD-1003",
    waiter: "Sam",
    created_at: "2025-08-23T15:20:00Z",
    items: [{ id: 1, name: "Cocktail", price: 10, qty: 2 }],
  },
};

const statusConfig = {
  available: { color: "success", icon: <EventSeat />, label: "Available" },
  occupied: { color: "warning", icon: <LocalDining />, label: "Occupied" },
  reserved: { color: "info", icon: <LockClock />, label: "Reserved" },
};

export default function TablesDashboard() {
  const [tableStatus, setTableStatus] = useState("all");
  const [selectedTable, setSelectedTable] = useState(null);

  const filteredTables =
    tableStatus === "all"
      ? dummyTables
      : dummyTables.filter((t) => t.status === tableStatus);

  const handleOpenTable = (table) => {
    setSelectedTable(table);
  };

  const handleClose = () => setSelectedTable(null);

  // Summary counts
  const total = dummyTables.length;
  const available = dummyTables.filter((t) => t.status === "available").length;
  const occupied = dummyTables.filter((t) => t.status === "occupied").length;
  const reserved = dummyTables.filter((t) => t.status === "reserved").length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🍽️ Table Management
      </Typography>

      {/* Summary Bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              border: "1px solid #ddd",
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              <TableRestaurant />
            </Avatar>
            <Box>
              <Typography variant="h6">{total}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tables
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              border: "1px solid #ddd",
            }}
          >
            <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
              <EventSeat />
            </Avatar>
            <Box>
              <Typography variant="h6">{available}</Typography>
              <Typography variant="body2" color="text.secondary">
                Available
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              border: "1px solid #ddd",
            }}
          >
            <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
              <LocalDining />
            </Avatar>
            <Box>
              <Typography variant="h6">{occupied}</Typography>
              <Typography variant="body2" color="text.secondary">
                Occupied
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              border: "1px solid #ddd",
            }}
          >
            <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
              <LockClock />
            </Avatar>
            <Box>
              <Typography variant="h6">{reserved}</Typography>
              <Typography variant="body2" color="text.secondary">
                Reserved
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        
        <ToggleButtonGroup
          value={tableStatus}
          exclusive
          onChange={(_, value) => value && setTableStatus(value)}
          sx={{
            "& .MuiToggleButton-root": {
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              border: "1px solid #ddd",
              textTransform: "capitalize",
            },
          }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="available">Available</ToggleButton>
          <ToggleButton value="occupied">Occupied</ToggleButton>
          <ToggleButton value="reserved">Reserved</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Tables Grid - 4 columns */}
      <Grid container spacing={3}>
        {filteredTables.map((table) => {
          const status = statusConfig[table.status];
          return (
            <Grid item xs={12} sm={6} md={3} key={table.id}>
              <Card
                sx={{
                  display: "flex",
                  border: "1px solid #ddd",
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "grey.50",
                  },
                }}
                onClick={() => handleOpenTable(table)}
              >
                {/* Left side avatar / icon */}
                <Box
                  sx={{
                    width: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: `${status.color}.light`,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: `${status.color}.main`,
                      width: 60,
                      height: 60,
                    }}
                  >
                    {status.icon}
                  </Avatar>
                </Box>

                {/* Right side content */}
                <CardContent sx={{ flex: 1 }}>
                  <Stack spacing={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {table.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Seats: {table.seats}
                    </Typography>
                    <Chip
                      label={status.label}
                      color={status.color}
                      size="small"
                      sx={{ width: "fit-content" }}
                    />
                    {table.waiter && (
                      <Typography
                        variant="caption"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        Waiter: {table.waiter}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Modal for Table Orders */}
      <Modal
        open={!!selectedTable}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={!!selectedTable}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 3,
              width: "90%",
              maxWidth: 600,
            }}
          >
            {selectedTable && dummyOrders[selectedTable.id] ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Order: {dummyOrders[selectedTable.id].id}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Waiter: {dummyOrders[selectedTable.id].waiter}
                </Typography>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "1rem",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f0f0f0" }}>
                      <th style={{ padding: "8px", textAlign: "left" }}>
                        Item
                      </th>
                      <th style={{ padding: "8px" }}>Qty</th>
                      <th style={{ padding: "8px" }}>Price</th>
                      <th style={{ padding: "8px" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyOrders[selectedTable.id].items.map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: "8px" }}>{item.name}</td>
                        <td style={{ padding: "8px", textAlign: "center" }}>
                          {item.qty}
                        </td>
                        <td style={{ padding: "8px" }}>${item.price}</td>
                        <td style={{ padding: "8px" }}>
                          ${item.price * item.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Typography fontWeight="bold">
                    Total: $
                    {dummyOrders[selectedTable.id].items.reduce(
                      (acc, i) => acc + i.price * i.qty,
                      0
                    )}
                  </Typography>
                </Box>
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                  >
                    Close Table
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <Typography align="center" fontWeight="bold">
                No active orders for this table.
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
