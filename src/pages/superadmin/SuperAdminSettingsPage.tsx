import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Save, Settings as SettingsIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Paper,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

const SuperAdminSettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    console.log('Saving settings...');
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeaderWithIcon icon={SettingsIcon} title="System Settings" />
        <CardContent>
          {/* Admin Account Settings */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Admin Account Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Admin Email" defaultValue="admin@aswenna.com" fullWidth />
              <TextField label="Admin Name" defaultValue="Super Administrator" fullWidth />
              <TextField
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                fullWidth
              />
              <TextField
                label="New Password"
                type="password"
                placeholder="Enter new password"
                fullWidth
              />
              <Button variant="contained" color="primary" startIcon={<Save />} sx={{ alignSelf: 'flex-start' }}>
                Update Account
              </Button>
            </Box>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* Security Settings */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Security Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body1">Email Notifications</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Receive email alerts for critical system events
                  </Typography>
                </Box>
                <Switch
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body1">Two-Factor Authentication</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Additional security layer for admin login
                  </Typography>
                </Box>
                <Switch
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                />
              </Box>
            </Box>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* System Settings */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              System Configuration
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body1">Automatic Database Backup</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Daily automated backups at 2:00 AM
                  </Typography>
                </Box>
                <Switch checked={autoBackup} onChange={(e) => setAutoBackup(e.target.checked)} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body1" sx={{ color: maintenanceMode ? '#f44336' : 'inherit' }}>
                    Maintenance Mode
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Block all user access (SuperAdmin only)
                  </Typography>
                </Box>
                <Switch
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  color="error"
                />
              </Box>
              <TextField
                label="Session Timeout (minutes)"
                type="number"
                defaultValue="30"
                sx={{ width: 250 }}
              />
              <TextField
                label="Max Failed Login Attempts"
                type="number"
                defaultValue="5"
                sx={{ width: 250 }}
              />
            </Box>
          </Paper>

          {/* Save Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined">Reset to Default</Button>
            <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSave}>
              Save All Changes
            </Button>
          </Box>

          {/* Warning Notice */}
          <Paper sx={{ mt: 3, p: 2, bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#f44336' }}>
              ⚠️ Critical Settings Warning
            </Typography>
            <Typography variant="body2">
              Changes to security and system settings can affect all platform users. Ensure you
              understand the implications before making modifications. All changes are logged in the
              audit trail.
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SuperAdminSettingsPage;
