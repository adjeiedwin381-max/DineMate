import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";

export default function SecuritySettingsPanel() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Security Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your password and account security options.
      </Typography>

      <Stack spacing={3}>
        {/* Section 1: Change Password */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Change Password
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                size="small"
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                size="small"
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                size="small"
              />
              <Button variant="contained" color="primary">
                Update Password
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Section 2: Deactivate Account */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Deactivate Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Temporarily disable your account. You can reactivate it anytime by
              logging back in.
            </Typography>
            <Button variant="outlined" color="warning">
              Deactivate Account
            </Button>
          </CardContent>
        </Card>

        {/* Divider */}
        <Divider />

        {/* Section 3: Delete Account */}
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            borderColor: "error.main",
            backgroundColor: "error.lighter",
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="error"
              gutterBottom
            >
              Delete Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </Typography>
            <Button variant="contained" color="error">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}