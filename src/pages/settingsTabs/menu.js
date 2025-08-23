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

export default function MenuSettingsPanel() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Menu Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure how your menu items are displayed, priced, and managed.
      </Typography>

      <Stack spacing={3}>
        {/* Section 1: Availability */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Availability
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Allow online ordering"
            />
            <FormControlLabel
              control={<Switch />}
              label="Hide out-of-stock items automatically"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable scheduled availability (time-based menus)"
            />
          </CardContent>
        </Card>

        {/* Section 2: Pricing */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Pricing & Discounts
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Default Tax Rate (%)
              </Typography>
              <TextField
                fullWidth
                size="small"
                defaultValue={7.5}
                type="number"
                sx={{ mt: 1 }}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Global Discount Option
              </Typography>
              <Select fullWidth defaultValue="none" size="small" sx={{ mt: 1 }}>
                <MenuItem value="none">No Discounts</MenuItem>
                <MenuItem value="happyhour">Happy Hour (10% off)</MenuItem>
                <MenuItem value="lunch">Lunch Specials (15% off)</MenuItem>
                <MenuItem value="custom">Custom Rule</MenuItem>
              </Select>
            </Box>
          </CardContent>
        </Card>

        {/* Section 3: Categories */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Categories & Organization
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable categories (Starters, Mains, Drinks)"
            />
            <FormControlLabel
              control={<Switch />}
              label="Allow multiple categories per item"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Auto-sort items alphabetically"
            />
          </CardContent>
        </Card>

        {/* Section 4: Dietary Options */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Dietary Labels
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Highlight vegetarian items"
            />
            <FormControlLabel
              control={<Switch />}
              label="Highlight vegan items"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Highlight gluten-free items"
            />
            <FormControlLabel
              control={<Switch />}
              label="Show calorie information"
            />
          </CardContent>
        </Card>

        {/* Section 5: Automation */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Automation
            </Typography>
            <FormControlLabel
              control={<Switch />}
              label="Auto-hide seasonal items when out of date"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable smart recommendations (upsell related items)"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable low-stock alerts for menu items"
            />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
