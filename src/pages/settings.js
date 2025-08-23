import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useAuthStore from "../lib/authStore";
import useRestaurantStore from "../lib/restaurantStore";
import RestaurantDetailsPanel from "./settingsTabs/restaurantDetails";
import EmployeesPanel from "./settingsTabs/employess";
import TablesPanel from "./settingsTabs/tables";
import MenuPanel from "./settingsTabs/menu";
import ReportsSettingsPanel from "./settingsTabs/reports";
import KitchenSettingsPanel from "./settingsTabs/kitchen";
import DashboardSettingsPanel from "./settingsTabs/dashboard";
import SecuritySettingsPanel from "./settingsTabs/security";  

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Settings = () => {
    const [value, setValue] = React.useState(0);
    const { user } = useAuthStore();
    const { selectedRestaurant } = useRestaurantStore();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          p: 9,
          height: "70vh",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          {selectedRestaurant.role === "owner" && (
            <Tab label="Restaurant Info" {...a11yProps(0)} />
          )}
          <Tab label="Employees" {...a11yProps(1)} />
          <Tab label="Tables" {...a11yProps(2)} />
          <Tab label="Menu" {...a11yProps(3)} />
          <Tab label="Reports" {...a11yProps(4)} />
          <Tab label="Kitchen" {...a11yProps(5)} />
          <Tab label="Dashboard" {...a11yProps(6)} />
          <Tab label="Security" {...a11yProps(7)} />
        </Tabs>
        {selectedRestaurant.role === "owner" && (
          <TabPanel value={value} index={0}>
            <RestaurantDetailsPanel
              restaurant={selectedRestaurant.restaurants}
            />
          </TabPanel>
        )}
        <TabPanel value={value} index={1}>
          <EmployeesPanel />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <TablesPanel />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <MenuPanel />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <ReportsSettingsPanel />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <KitchenSettingsPanel />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <DashboardSettingsPanel />
        </TabPanel>
        <TabPanel value={value} index={7}>
          <SecuritySettingsPanel />
        </TabPanel>
      </Box>
    );
};

export default Settings;
