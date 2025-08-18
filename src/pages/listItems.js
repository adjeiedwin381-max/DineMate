import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import useAppStore from '../lib/appstore';


export const MainListItems = ()=> {
  const { setBreadcrumb } = useAppStore();

  return (
    <React.Fragment>
      <Link to='/app/dashboard' style={{ textDecoration: 'none', color: '#000' }} onClick={() => setBreadcrumb('Dashboard')}>
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </Link>
      <Link to='/app/menu' style={{ textDecoration: 'none', color: '#000'  }} onClick={() => setBreadcrumb('Menu')}>
        <ListItemButton>
          <ListItemIcon>
            <MenuBookIcon />
          </ListItemIcon>
          <ListItemText primary="Menu" />
        </ListItemButton>
      </Link>
      <Link to='/app/tables' style={{ textDecoration: 'none', color: '#000'  }} onClick={() => setBreadcrumb('Tables')}>
        <ListItemButton>
          <ListItemIcon>
            <TableRestaurantIcon />
          </ListItemIcon>
          <ListItemText primary="Tables" />
        </ListItemButton>
      </Link>
      <Link to='/app/kitchen' style={{ textDecoration: 'none', color: '#000'  }} onClick={() => setBreadcrumb('Kitchen')}>
        <ListItemButton>
          <ListItemIcon>
            <SoupKitchenIcon />
          </ListItemIcon>
          <ListItemText primary="Kitchen" />
        </ListItemButton>
      </Link>
    </React.Fragment>
  )
};

export const SecondaryListItems = ()=> {
  const { setBreadcrumb } = useAppStore();
  
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Admin
      </ListSubheader>
      <Link to='/app/employees' style={{ textDecoration: 'none', color: '#000'  }} onClick={() => setBreadcrumb('Employees Management')}>
        <ListItemButton>
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText primary="Employees" />
        </ListItemButton>
      </Link>
      <Link to='/app/menu-items' style={{ textDecoration: 'none', color: '#000'  }} onClick={() => setBreadcrumb('Items Management')}>
        <ListItemButton>
          <ListItemIcon>
            <MenuBookIcon />
          </ListItemIcon>
          <ListItemText primary="Menu Items" />
        </ListItemButton>
      </Link>
      <Link to='/app/admin-tables' style={{ textDecoration: 'none', color: '#000'  }} onClick={() => setBreadcrumb('Tables Management')}>
        <ListItemButton>
          <ListItemIcon>
            <TableRestaurantIcon />
          </ListItemIcon>
          <ListItemText primary="Tables" />
        </ListItemButton>
      </Link>
      <Link to="/app/report" style={{ textDecoration: 'none', color: '#000'  }} onClick={() => setBreadcrumb('Reports')}>
        <ListItemButton>
          <ListItemIcon>
            <TrendingUpIcon />
          </ListItemIcon>
          <ListItemText primary="Report" />
        </ListItemButton>
      </Link>
    </React.Fragment>
  )
};
