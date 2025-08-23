import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Stack,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

export default function KitchenSettingsPanel() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Kitchen & Chef Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure how orders are displayed, managed, and communicated to your
        kitchen staff.
      </Typography>

      <Stack spacing={3}>
        {/* Section 1: Order Display */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Order Display
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable Kitchen Display System (KDS)"
            />
            <FormControlLabel
              control={<Switch />}
              label="Show order timers on screen"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Highlight delayed orders in red"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Display Mode
              </Typography>
              <Select fullWidth defaultValue="grid" size="small" sx={{ mt: 1 }}>
                <MenuItem value="grid">Grid View</MenuItem>
                <MenuItem value="list">List View</MenuItem>
              </Select>
            </Box>
          </CardContent>
        </Card>

        {/* Section 2: Notifications */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Notifications
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Sound alert for new orders"
            />
            <FormControlLabel
              control={<Switch />}
              label="Vibrate tablet on urgent order"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Notify chef when order is modified"
            />
          </CardContent>
        </Card>

        {/* Section 3: Order Routing */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Order Routing
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Automatically route to station (grill, fryer, bar)"
            />
            <FormControlLabel
              control={<Switch />}
              label="Allow chefs to claim orders manually"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Max Orders per Chef
              </Typography>
              <TextField
                type="number"
                size="small"
                fullWidth
                defaultValue={5}
                sx={{ mt: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Section 4: Recipe & Instructions */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Recipe & Instructions
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Show cooking instructions with orders"
            />
            <FormControlLabel
              control={<Switch />}
              label="Show allergen information"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable photo previews of dishes"
            />
          </CardContent>
        </Card>

        {/* Section 5: Performance Tracking */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Performance Tracking
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Track preparation time per dish"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable chef leaderboard (gamification)"
            />
            <FormControlLabel
              control={<Switch />}
              label="Send weekly performance reports to chefs"
            />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}