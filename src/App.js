import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Menu from './pages/menu';
import Login from './pages/login';
import Tables from './pages/tables';
import Employees from './pages/employees';
import AdminTables from './pages/adminTables';
import MenuItems from './pages/menuItems';
import Report from './pages/report';
import Kitchen from './pages/kitchen';
import Profile from './pages/profile';
import SignIn from './pages/auth/signIn';
import SignUp from './pages/auth/signUp';
import TableManagement from './pages/tableManagement';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import React, { useState } from 'react';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('tables');
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<Login />}/>
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="table-management" element={<TableManagement />} />
        </Route>
        <Route path="/app/" element={<Home />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="menu" element={<Menu/>} />
          <Route path="tables" element={<Tables />} />
          <Route path="admin-tables" element={<AdminTables />} />
          <Route path="menu-items" element={<MenuItems />} />
          <Route path="employees" element={<Employees />} />
          <Route path="report" element={<Report />} />
          <Route path="kitchen" element={<Kitchen />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;