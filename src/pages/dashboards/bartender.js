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
  LocalBar,
  DoneAll,
  Star,
  Warning,
  MonetizationOn,
  Notifications,
} from "@mui/icons-material";

const BartenderDashboard = () => {
  // Dummy data
  const activeDrinks = [
    { id: 1, drink: "Mojito", table: 4, status: "Mixing" },
    { id: 2, drink: "Old Fashioned", table: 8, status: "Shaking" },
  ];

  const readyDrinks = [
    { id: 3, drink: "Margarita", table: 2 },
    { id: 4, drink: "Gin & Tonic", table: 6 },
  ];

  const specialRequests = [
    { id: 1, drink: "Custom Cocktail", note: "Less sugar" },
    { id: 2, drink: "Whiskey Sour", note: "Extra lemon" },
  ];

  const notifications = [
    { id: 1, message: "Low stock: Tequila" },
    { id: 2, message: "Bar area requested cleaning" },
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
              backgroundColor: "#fce4ec",
            }}
          >
            <Avatar sx={{ backgroundColor: "#c2185b", mr: 2 }}>
              <LocalBar />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#880e4f" }}
              >
                {activeDrinks.length}
              </Typography>
              <Typography variant="body2" sx={{ color: "#ad1457" }}>
                Pending Drinks
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
            <Avatar sx={{ backgroundColor: "#2e7d32", mr: 2 }}>
              <DoneAll />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1b5e20" }}
              >
                25
              </Typography>
              <Typography variant="body2" sx={{ color: "#388e3c" }}>
                Completed Drinks
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
            <Avatar sx={{ backgroundColor: "#ef6c00", mr: 2 }}>
              <Star />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#e65100" }}
              >
                {specialRequests.length}
              </Typography>
              <Typography variant="body2" sx={{ color: "#ef6c00" }}>
                Special Requests
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
              <Warning />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#f57f17" }}
              >
                2
              </Typography>
              <Typography variant="body2" sx={{ color: "#f9a825" }}>
                Inventory Alerts
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
              <MonetizationOn />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#0d47a1" }}
              >
                $42
              </Typography>
              <Typography variant="body2" sx={{ color: "#1565c0" }}>
                Tips Today
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Active Drinks */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardHeader
              title="Active Drink Orders"
              sx={{ backgroundColor: "#c2185b", color: "#fff" }}
            />
            <CardContent>
              <List>
                {activeDrinks.map((drink) => (
                  <ListItem
                    key={drink.id}
                    sx={{
                      mb: 1.5,
                      py: 1.5,
                      px: 2,
                      backgroundColor: "#fce4ec",
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: "#880e4f" }}>
                        {drink.drink}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ad1457" }}>
                        Table {drink.table} • {drink.status}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Ready Drinks */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardHeader
              title="Ready for Pickup"
              sx={{ backgroundColor: "#2e7d32", color: "#fff" }}
            />
            <CardContent>
              <List>
                {readyDrinks.map((drink) => (
                  <ListItem
                    key={drink.id}
                    sx={{
                      mb: 1.5,
                      py: 1.5,
                      px: 2,
                      backgroundColor: "#e8f5e9",
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: "#1b5e20" }}>
                        {drink.drink}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#388e3c" }}>
                        Table {drink.table}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Special Requests */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <CardHeader
          title="Special Drink Requests"
          sx={{ backgroundColor: "#ef6c00", color: "#fff" }}
        />
        <CardContent>
          <List>
            {specialRequests.map((req) => (
              <ListItem
                key={req.id}
                sx={{
                  mb: 1.5,
                  py: 1.5,
                  px: 2,
                  backgroundColor: "#fff3e0",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: "#e65100" }}>
                    {req.drink}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ef6c00" }}>
                    {req.note}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardHeader
          title="Bar Notifications"
          sx={{ backgroundColor: "#1976d2", color: "#fff" }}
        />
        <CardContent>
          {notifications.length === 0 ? (
            <Typography textAlign="center" sx={{ color: "#9e9e9e" }}>
              No notifications
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
                    backgroundColor: "#e3f2fd",
                    borderRadius: 2,
                  }}
                >
                  <Avatar sx={{ backgroundColor: "#1976d2", mr: 2 }}>
                    <Notifications />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: "#0d47a1" }}>
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

export default BartenderDashboard;
