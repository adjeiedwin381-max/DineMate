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
import ProtectedRoute from './pages/auth/components/ProtectedRoute';
import Settings from './pages/settings';
import Cashier from './pages/cashier';
import Bar from './pages/bar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="table-management" element={<TableManagement />} />
        </Route>
        <Route
          path="/app/"
          element={
            <>
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="menu" element={<Menu />} />
          <Route path="tables" element={<TableManagement />} />
          <Route path="admin-tables" element={<AdminTables />} />
          <Route path="menu-items" element={<MenuItems />} />
          <Route path="employees" element={<Employees />} />
          <Route path="report" element={<Report />} />
          <Route path="kitchen" element={<Kitchen />} />
          <Route path="cashier" element={<Cashier />} />
          <Route path="bar" element={<Bar />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;