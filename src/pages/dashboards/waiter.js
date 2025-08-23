import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  List,
  ListItem,
} from "@mui/material";
import {
  TableBar,
  ListAlt,
  LocalDining,
  DoneAll,
  MonetizationOn,
  Notifications,
} from "@mui/icons-material";

const WaiterDashboard = () => {
  // Dummy data
  const assignedTables = [
    { id: 1, number: 5, status: "Occupied", orders: 2 },
    { id: 2, number: 7, status: "Occupied", orders: 1 },
    { id: 3, number: 10, status: "Waiting", orders: 0 },
  ];

  const activeOrders = [
    { id: 1, item: "Pasta Alfredo", table: 5, status: "Cooking" },
    { id: 2, item: "Caesar Salad", table: 7, status: "Ready" },
  ];

  const notifications = [
    { id: 1, table: 5, message: "Needs water" },
    { id: 2, table: 10, message: "Calling waiter" },
  ];

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              backgroundColor: "#f3e5f5",
            }}
          >
            <Avatar sx={{ backgroundColor: "#8e24aa", mr: 2 }}>
              <TableBar />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#4a148c" }}
              >
                {assignedTables.length}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6a1b9a" }}>
                Assigned Tables
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              backgroundColor: "#e3f2fd",
            }}
          >
            <Avatar sx={{ backgroundColor: "#1976d2", mr: 2 }}>
              <ListAlt />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#0d47a1" }}
              >
                {activeOrders.length}
              </Typography>
              <Typography variant="body2" sx={{ color: "#1565c0" }}>
                Active Orders
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              backgroundColor: "#fff3e0",
            }}
          >
            <Avatar sx={{ backgroundColor: "#f57c00", mr: 2 }}>
              <LocalDining />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#e65100" }}
              >
                4
              </Typography>
              <Typography variant="body2" sx={{ color: "#ef6c00" }}>
                Pending Deliveries
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              backgroundColor: "#e8f5e9",
            }}
          >
            <Avatar sx={{ backgroundColor: "#43a047", mr: 2 }}>
              <DoneAll />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1b5e20" }}
              >
                12
              </Typography>
              <Typography variant="body2" sx={{ color: "#2e7d32" }}>
                Completed Orders
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              backgroundColor: "#fffde7",
            }}
          >
            <Avatar sx={{ backgroundColor: "#fbc02d", mr: 2 }}>
              <MonetizationOn />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#f57f17" }}
              >
                $85
              </Typography>
              <Typography variant="body2" sx={{ color: "#fbc02d" }}>
                Tips Today
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Assigned Tables */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardHeader
              title="Assigned Tables"
              sx={{ backgroundColor: "#8e24aa", color: "#fff" }}
            />
            <CardContent>
              <List>
                {assignedTables.map((table) => (
                  <ListItem
                    key={table.id}
                    sx={{
                      mb: 1.5,
                      py: 1.5,
                      px: 2,
                      backgroundColor: "#f3e5f5",
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: "#6a1b9a" }}>
                        Table {table.number}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#4a148c" }}>
                        Status: {table.status} • Orders: {table.orders}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Orders */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardHeader
              title="Active Orders"
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            />
            <CardContent>
              <List>
                {activeOrders.map((order) => (
                  <ListItem
                    key={order.id}
                    sx={{
                      mb: 1.5,
                      py: 1.5,
                      px: 2,
                      backgroundColor: "#e3f2fd",
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: "#0d47a1" }}>
                        {order.item}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#1565c0" }}>
                        Table {order.table} • {order.status}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notifications */}
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardHeader
          title="Table Requests / Notifications"
          sx={{ backgroundColor: "#f57c00", color: "#fff" }}
        />
        <CardContent>
          {notifications.length === 0 ? (
            <Typography textAlign="center" sx={{ color: "#9e9e9e" }}>
              No active requests
            </Typography>
          ) : (
            <List>
              {notifications.map((note) => (
                <ListItem
                  key={note.id}
                  sx={{
                    mb: 1.5,
                    py: 1.5,
                    px: 2,
                    backgroundColor: "#fff3e0",
                    borderRadius: 2,
                  }}
                >
                  <Avatar sx={{ backgroundColor: "#f57c00", mr: 2 }}>
                    <Notifications />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: "#e65100" }}>
                      Table {note.table}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ef6c00" }}>
                      {note.message}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WaiterDashboard;
