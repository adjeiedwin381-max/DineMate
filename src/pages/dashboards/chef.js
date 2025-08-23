import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Restaurant,
  AssignmentTurnedIn,
  AccessTime,
  Warning,
  LocalDining,
  CheckCircle,
  Kitchen,
} from "@mui/icons-material";

// Dummy Data
const orderQueue = [
  { id: 1, table: "Table 5", item: "Margherita Pizza", status: "Preparing" },
  { id: 2, table: "Table 2", item: "Grilled Chicken", status: "Pending" },
  { id: 3, table: "Table 7", item: "Pasta Alfredo", status: "Preparing" },
  { id: 4, table: "Takeout", item: "Burger & Fries", status: "Pending" },
];

export default function ChefDashboard() {
  return (
    <Box sx={{ p: 3, bgcolor: "#f4f7fb", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 4,
          background:
            "linear-gradient(135deg, rgba(244,81,108,1) 0%, rgba(255,152,0,1) 100%)",
          color: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Welcome Chef 👨‍🍳
        </Typography>
        <Typography variant="body2">
          Track your kitchen’s performance and manage orders in real-time.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3}>
        {[
          {
            title: "Pending Orders",
            value: "12",
            icon: <Restaurant />,
            color: "#f44336",
          },
          {
            title: "In Progress",
            value: "8",
            icon: <AccessTime />,
            color: "#ff9800",
          },
          {
            title: "Completed Today",
            value: "45",
            icon: <AssignmentTurnedIn />,
            color: "#4caf50",
          },
          {
            title: "Low Stock Alerts",
            value: "3",
            icon: <Warning />,
            color: "#2196f3",
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                borderRadius: 3,
                background: item.color,
                color: "#fff",
                boxShadow: "none",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)" }}>
                    {item.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">{item.title}</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Order Queue */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                🍽️ Live Order Queue
              </Typography>
              <List>
                {orderQueue.map((order) => (
                  <React.Fragment key={order.id}>
                    <ListItem
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItemText
                        primary={`${order.item}`}
                        secondary={`From: ${order.table}`}
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          startIcon={<CheckCircle />}
                        >
                          Complete
                        </Button>
                        <Button size="small" variant="outlined" color="warning">
                          Delay
                        </Button>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ⚡ Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: "View Recipes", icon: <LocalDining /> },
                  { label: "Check Stock", icon: <Kitchen /> },
                  { label: "Report Issue", icon: <Warning /> },
                ].map((item, i) => (
                  <Grid item xs={12} key={i}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={item.icon}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        bgcolor:
                          i === 0 ? "#1976d2" : i === 1 ? "#4caf50" : "#f44336",
                        "&:hover": { opacity: 0.9 },
                      }}
                    >
                      {item.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
