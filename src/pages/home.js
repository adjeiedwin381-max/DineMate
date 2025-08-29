import { Outlet } from "react-router-dom";
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Popover from '@mui/material/Popover';
import Badge from '@mui/material/Badge';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import logo from '../assets/logo.jpeg'; 
import { supabase } from '../lib/supabase';
import dayjs from 'dayjs';
import RestaurantGrid from './restaurantSelectionPage';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from "@mui/icons-material/Settings";
import CachedIcon from "@mui/icons-material/Cached";

import { MainListItems, SecondaryListItems } from './listItems';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import image from '../assets/image5.jpeg';
import useDashboardStore from "../lib/dashboardStore";
import { database_logs } from "../lib/logActivities";
import useAuthStore from "../lib/authStore";
import useAppStore from "../lib/appstore";
import useRestaurantStore from "../lib/restaurantStore";


function Copyright(props) {
  return (
    <Typography variant="body2" color="#fff" align="center" {...props}>
      {'© '}
      {new Date().getFullYear()} {' '}
      <Link color="#fff" href="https://cyaneltechnologies.com/" underline="hover">
        Addai Johnson Exploration Technologies (AJxT)
      </Link>
      {'. Developed in Accra, Ghana.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});



const Layout = () => {
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { breadcrumb, setBreadcrumb } = useAppStore();
  const { getRestaurants, getRestaurantById, selectedRestaurant, setSelectedRestaurant, restaurants } = useRestaurantStore();

  const { fetchUser } = useDashboardStore();
  const { signOut, memberships, user } = useAuthStore();

  const first_name = user.user.user_metadata.firstName;
  const last_name = user.user.user_metadata.lastName;

  useEffect(() => {
    console.log(user.user.user_metadata);
    console.log(selectedRestaurant);
    getRestaurants(user.user.id);
  }, [getRestaurants]);

  useEffect(() => {
    const intervalId = setInterval(() => {
        setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (restaurants.length === 1 && !selectedRestaurant) {
      setSelectedRestaurant(restaurants[0]);
    }

    console.log(selectedRestaurant);
  }, [restaurants, selectedRestaurant]);

  const formatDate = (date) => {
    return dayjs(date).format('ddd, DD MMMM YYYY, h:mm:ss A');
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser])

  const navigate = useNavigate(); 

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
 
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const logout = async () => {
    signOut();

    localStorage.clear();
    localStorage.removeItem("auth-store");
    localStorage.removeItem("restaurant-store");
    setSelectedRestaurant(null);
    navigate('/sign-in');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openNotification = Boolean(anchorEl);
  const id = openNotification ? 'simple-popover' : undefined;

  return (
    <>
      {selectedRestaurant && (
        <ThemeProvider theme={mdTheme}>
          <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
            <CssBaseline />
            <ThemeProvider theme={darkTheme}>
              <AppBar position="absolute" open={open}>
                <Toolbar sx={{ pr: "20px" }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                      marginRight: "30px",
                      ...(open && { display: "none" }),
                    }}
                  >
                    <MenuIcon />
                  </IconButton>

                  <img
                    src={logo}
                    alt="Logo"
                    style={{ height: "40px", marginRight: "16px" }}
                  />

                  <Typography
                    component="h1"
                    variant="h5"
                    color="inherit"
                    noWrap
                    sx={{ mr: 2, fontWeight: "900" }}
                  >
                    {selectedRestaurant?.restaurants?.name}{" "}
                    <span style={{ fontWeight: "normal", fontSize: "14px" }}>
                      * {breadcrumb}
                    </span>
                  </Typography>

                  {/* Centered Time & Date */}
                  <Box sx={{ mx: "auto" }}>
                    <Typography
                      variant="title"
                      color="inherit"
                      sx={{ fontWeight: "900" }}
                      noWrap
                    >
                      {formatDate(currentTime)}
                    </Typography>
                  </Box>

                  <Tooltip title="Switch Restaurant">
                    <IconButton
                      size="large"
                      aria-label="show 17 new notifications"
                      color="inherit"
                      onClick={()=> navigate('/restaurant-selection')}
                    >
                      <CachedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Notifications">
                    <IconButton
                      size="large"
                      aria-label="show 17 new notifications"
                      color="inherit"
                      onClick={handleClick}
                    >
                      <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                    <Popover
                      id={id}
                      open={openNotification}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <Typography sx={{ p: 2 }}>
                        The content of the Popover.The content of the Popover.
                      </Typography>
                    </Popover>
                  </Tooltip>

                  

                  <IconButton color="inherit">
                    <Box sx={{ flexGrow: 0 }}>
                      <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                          <Avatar alt="Remy Sharp" src={user?.image} />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        sx={{ mt: "45px" }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        <MenuItem disabled>
                          <Typography
                            variant="title"
                            color="inherit"
                            sx={{ fontWeight: "900" }}
                            noWrap
                          >
                            {first_name + " " + last_name}
                          </Typography>
                        </MenuItem>
                        <Divider/>
                        <MenuItem
                          onClick={() => {
                            handleCloseUserMenu();
                            navigate("dashboard");
                          }}
                        >
                          <DashboardIcon sx={{ mr: 1 }} />
                          <Typography textAlign="center">Dashboard</Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleCloseUserMenu();
                            navigate("profile");
                            setBreadcrumb("Profile");
                          }}
                        >
                          <PersonIcon sx={{ mr: 1 }} />
                          <Typography textAlign="center">Profile</Typography>
                        </MenuItem>
                        {selectedRestaurant.role === "owner" && (
                          <MenuItem
                            onClick={() => {
                              handleCloseUserMenu();
                              navigate("settings");
                              setBreadcrumb("Settings");
                            }}
                          >
                            <SettingsIcon sx={{ mr: 1 }} />
                            <Typography textAlign="center">Settings</Typography>
                          </MenuItem>
                        )}
                        <Divider component="li" />
                        <MenuItem onClick={logout}>
                          <LogoutIcon sx={{ mr: 1 }} />
                          <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                      </Menu>
                    </Box>
                  </IconButton>
                </Toolbar>
              </AppBar>
            </ThemeProvider>
            <Drawer variant="permanent" open={open}>
              <Toolbar
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  px: [1],
                }}
              >
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              <List component="nav">
                <MainListItems />
                <Divider sx={{ my: 1 }} />
                <SecondaryListItems />
              </List>
            </Drawer>
            <Box
              component="main"
              sx={{
                backgroundColor: "#f5f6fa",
                flexGrow: 1,
                overflow: "auto",
              }}
            >
              <Toolbar />
              <Box sx={{ minHeight: "90vh", padding: "20px", flexGrow: 1 }}>
                <Outlet />
              </Box>
              <Copyright sx={{ pt: 4 }} />
            </Box>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
}

export default Layout


