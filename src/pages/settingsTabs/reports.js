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
  TextField,
} from "@mui/material";

export default function ReportsSettingsPanel() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Reports Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage how reports are generated, delivered, and displayed for your
        restaurant.
      </Typography>

      <Stack spacing={3}>
        {/* Section 1: Report Types */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Report Types
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable Sales Reports"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable Inventory Reports"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable Employee Performance Reports"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable Customer Insights"
            />
          </CardContent>
        </Card>

        {/* Section 2: Export & File Format */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Export Options
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Default Export Format
              </Typography>
              <Select fullWidth defaultValue="pdf" size="small" sx={{ mt: 1 }}>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="xlsx">Excel (.xlsx)</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </Box>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Include charts in exports"
              sx={{ mt: 2 }}
            />
            <FormControlLabel
              control={<Switch />}
              label="Password-protect report files"
            />
          </CardContent>
        </Card>

        {/* Section 3: Scheduling */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Scheduling & Automation
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable automatic daily reports"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable weekly summary reports"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable monthly performance reports"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Default Delivery Time
              </Typography>
              <TextField
                type="time"
                size="small"
                fullWidth
                defaultValue="09:00"
                sx={{ mt: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Section 4: Access Control */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Data & Access Control
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Allow managers to access all reports"
            />
            <FormControlLabel
              control={<Switch />}
              label="Restrict sensitive financial data to owners only"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable employee-specific performance reports"
            />
          </CardContent>
        </Card>

        {/* Section 5: Notifications */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Notifications
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Send email when new report is generated"
            />
            <FormControlLabel
              control={<Switch />}
              label="Send push notifications for key metrics"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable low-stock alerts in inventory reports"
            />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}