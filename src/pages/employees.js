import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Drawer,
  TextField,
  Button,
  Switch,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const EmployeeManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"

  const employees = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Manager",
      status: "Active",
      lastActive: "2h ago",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      email: "alice@restaurant.com",
      phone: "+123 456 789",
    },
    {
      id: 2,
      name: "John Smith",
      role: "Chef",
      status: "Inactive",
      lastActive: "1d ago",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      email: "john@restaurant.com",
      phone: "+987 654 321",
    },
  ];

  const handleRowClick = (params) => {
    setSelectedEmployee(params.row);
    setDrawerOpen(true);
  };

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    {
      field: "avatar",
      headerName: "",
      width: 70,
      renderCell: (params) => (
        <Avatar src={params.value} alt={params.row.name} />
      ),
      sortable: false,
      filterable: false,
    },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Manager" ? "primary" : "secondary"}
          size="small"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Switch checked={params.value === "Active"} color="success" />
      ),
    },
    { field: "lastActive", headerName: "Last Active", flex: 1 },
    {
      field: "actions",
      headerName: "",
      width: 70,
      renderCell: (params) => (
        <IconButton onClick={(e) => handleMenuClick(e, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Employee Management
        </Typography>

        {/* View Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          <ToggleButton value="table">Table View</ToggleButton>
          <ToggleButton value="card">Card View</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Conditional UI */}
      {viewMode === "table" ? (
        <DataGrid
          rows={employees}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          onRowClick={handleRowClick}
          sx={{
            borderRadius: 3,
            "& .MuiDataGrid-columnHeaders": { fontWeight: "bold" },
          }}
        />
      ) : (
        <Grid container spacing={3}>
          {employees.map((emp) => (
            <Grid item xs={12} md={4} key={emp.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  display: "flex",
                  height: 280, // taller card
                  overflow: "hidden",
                }}
              >
                {/* Left Side - Full Height Avatar */}
                <Box
                  sx={{
                    width: "40%",
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    src={emp.avatar}
                    alt={emp.name}
                    sx={{ width: "100%", height: "100%", borderRadius: 0 }}
                  />
                </Box>

                {/* Right Side - Employee Details */}
                <Box
                  sx={{
                    flexGrow: 1,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6">{emp.name}</Typography>
                  <Chip
                    label={emp.role}
                    color="primary"
                    size="small"
                    sx={{ mt: 1, width: "fit-content" }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Last Active: {emp.lastActive}
                  </Typography>

                  <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <Switch checked={emp.status === "Active"} color="success" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {emp.status}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button size="small" onClick={() => setDrawerOpen(true)}>
                      Edit
                    </Button>
                    <Button size="small" color="error">
                      Remove
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu for table actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            setDrawerOpen(true);
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Remove</MenuItem>
      </Menu>

      {/* Drawer for details */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 350, p: 3 } }}
      >
        {selectedEmployee && (
          <Box>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
              />
              <Typography variant="h6">{selectedEmployee.name}</Typography>
              <Chip
                label={selectedEmployee.role}
                color="primary"
                size="small"
              />
            </Box>

            <TextField
              label="Email"
              value={selectedEmployee.email}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              value={selectedEmployee.phone}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Role"
              value={selectedEmployee.role}
              fullWidth
              margin="normal"
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography>Status</Typography>
              <Switch
                checked={selectedEmployee.status === "Active"}
                sx={{ ml: 2 }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button variant="contained" fullWidth>
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => setDrawerOpen(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default EmployeeManagement;
