import { Grid, Typography, Avatar, Button, Card, Divider, Badge, Box, Chip, CardContent, CardActions } from "@mui/material";
import useProfileStore from "../lib/profileStore";
import { useEffect } from "react";
import useAuthStore from "../lib/authStore";
import useRestaurantStore from "../lib/restaurantStore";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorOutline from "@mui/icons-material/ErrorOutline";




const Profile = () => {
  const { getProfile, profile } = useProfileStore();
  const { user } = useAuthStore();
  const { selectedRestaurant } = useRestaurantStore();

  const first_name = user.user.user_metadata.firstName;
  const last_name = user.user.user_metadata.lastName;


    return (
      <>
        <Grid
          container
          spacing={4}
          p={4}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid container spacing={3}>
            {/* Left column - Profile Picture & Basic Info */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 4,
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* Avatar with status badge */}
                <Badge
                  color={
                    user.user.role === "authenticated" ? "success" : "error"
                  }
                  overlap="circular"
                  badgeContent=" "
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  sx={{
                    "& .MuiBadge-badge": {
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "2px solid white",
                    },
                  }}
                >
                  <Avatar
                    src={user.user.user_metadata.profileAvatar}
                    alt="Profile Avatar"
                    sx={{
                      width: 160,
                      height: 160,
                      fontSize: 48,
                      bgcolor: "primary.main",
                    }}
                  >
                    {user.user.email?.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>

                {/* Name & Role */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {`${first_name || ""} ${last_name || ""}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRestaurant?.role || user.user.role}
                  </Typography>
                </Box>

                {/* Upload button */}
                <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                  Upload New Photo
                  <input type="file" hidden />
                </Button>
              </Card>
            </Grid>

            {/* Right column - Profile Details */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Restaurant + Role Badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {selectedRestaurant?.restaurants.name}
                    </Typography>
                    <Chip
                      label={selectedRestaurant?.role}
                      color={
                        selectedRestaurant?.role === "owner"
                          ? "primary"
                          : "secondary"
                      }
                      variant="outlined"
                      size="small"
                      sx={{
                        fontWeight: "medium",
                        textTransform: "capitalize",
                        borderRadius: "6px",
                      }}
                    />
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Personal Info Section */}
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 2, fontWeight: "bold", color: "text.secondary" }}
                  >
                    Personal Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        First Name
                      </Typography>
                      <Typography variant="h6">{first_name}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Last Name
                      </Typography>
                      <Typography variant="h6">{last_name}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Email
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="h6">{user.user.email}</Typography>
                        {user.user.user_metadata.email_verified ? (
                          <Chip
                            icon={<CheckCircle fontSize="small" />}
                            label="Verified"
                            color="success"
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                        ) : (
                          <Chip
                            icon={<ErrorOutline fontSize="small" />}
                            label="Unverified"
                            color="warning"
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Phone
                      </Typography>
                      <Typography variant="h6">
                        {user.user.user_metadata.phone || "—"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        About
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {profile?.bio || "No bio available."}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>

                {/* Actions */}
                <CardActions sx={{ justifyContent: "flex-end", p: 3, gap: 2 }}>
                  <Button variant="outlined">Edit Profile</Button>
                  <Button variant="contained">Change Password</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
}

export default Profile;