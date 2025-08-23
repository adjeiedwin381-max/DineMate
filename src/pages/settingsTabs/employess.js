import {
  Box,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

export default function EmployeeSettingsPanel() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Employee Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage default permissions and rules for your employees.
      </Typography>

      <Stack spacing={3}>
        {/* Section 1: Permissions */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Permissions
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Allow employees to clock in/out from mobile"
            />
            <FormControlLabel
              control={<Switch />}
              label="Allow employees to view sales reports"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Allow managers to invite new employees"
            />
          </CardContent>
        </Card>

        {/* Section 2: Defaults */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Defaults
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Default Role for New Employees
              </Typography>
              <Select
                fullWidth
                defaultValue="Waiter"
                size="small"
                sx={{ mt: 1 }}
              >
                <MenuItem value="Waiter">Waiter</MenuItem>
                <MenuItem value="Chef">Chef</MenuItem>
                <MenuItem value="Cashier">Cashier</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
              </Select>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Max Shift Hours Per Day
              </Typography>
              <Select fullWidth defaultValue={8} size="small" sx={{ mt: 1 }}>
                <MenuItem value={6}>6 Hours</MenuItem>
                <MenuItem value={8}>8 Hours</MenuItem>
                <MenuItem value={10}>10 Hours</MenuItem>
                <MenuItem value={12}>12 Hours</MenuItem>
              </Select>
            </Box>
          </CardContent>
        </Card>

        {/* Section 3: Notifications */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Notifications
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Notify managers when employees request leave"
            />
            <FormControlLabel
              control={<Switch />}
              label="Notify employees of new schedules via email"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Send weekly performance summary to admins"
            />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
