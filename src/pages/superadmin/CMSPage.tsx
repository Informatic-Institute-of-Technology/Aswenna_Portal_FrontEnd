import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    Campaign,
    Edit,
    Notifications,
    Save,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

const CMSPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [termsOfService, setTermsOfService] = useState(
    'By using the Aswenna Platform, you agree to connect Farmers, Investors, and Land Owners through secure tri-party agreements...'
  );
  const [privacyPolicy, setPrivacyPolicy] = useState(
    'Aswenna Platform collects and processes personal information to facilitate agricultural collaboration...'
  );
  const [faqContent, setFaqContent] = useState(
    'Q: How does the escrow system work?\nA: Funds are locked in escrow until milestone completion...'
  );
  const [notification, setNotification] = useState('');

  const handleSaveContent = () => {
    console.log('Saving content for tab:', activeTab);
    // API call to save content
  };

  const handleSendNotification = () => {
    console.log('Sending global notification:', notification);
    // API call to send notification
    setNotification('');
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeaderWithIcon
          icon={Campaign}
          title="CMS & Content Management"
          action={<Chip label="Content Editor" color="primary" />}
        />
        <CardContent>
          {/* Global Notification Section */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Notifications sx={{ color: '#2196F3' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Send Global Notification
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Type your announcement here... (e.g., 'System Maintenance on Jan 25th from 2-4 AM')"
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Notifications />}
                onClick={handleSendNotification}
                disabled={!notification}
              >
                Send to All Users
              </Button>
              <Button variant="outlined">Send to Farmers Only</Button>
              <Button variant="outlined">Send to Investors Only</Button>
              <Button variant="outlined">Send to Land Owners Only</Button>
            </Box>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* Content Management Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Terms of Service" />
              <Tab label="Privacy Policy" />
              <Tab label="FAQ" />
              <Tab label="Platform Settings" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Terms of Service
                </Typography>
                <Chip label="Last updated: Jan 15, 2026" size="small" />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={termsOfService}
                onChange={(e) => setTermsOfService(e.target.value)}
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                sx={{ mt: 2 }}
                onClick={handleSaveContent}
              >
                Save Changes
              </Button>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Privacy Policy
                </Typography>
                <Chip label="Last updated: Jan 10, 2026" size="small" />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                sx={{ mt: 2 }}
                onClick={handleSaveContent}
              >
                Save Changes
              </Button>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Frequently Asked Questions
                </Typography>
                <Button variant="outlined" startIcon={<Edit />} size="small">
                  Add New FAQ
                </Button>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={faqContent}
                onChange={(e) => setFaqContent(e.target.value)}
                variant="outlined"
                placeholder="Q: Your question here?\nA: Your answer here..."
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                sx={{ mt: 2 }}
                onClick={handleSaveContent}
              >
                Save Changes
              </Button>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Platform Fee Configuration
              </Typography>
              
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Transaction Fees
                </Typography>
                <TextField
                  type="number"
                  label="Platform Commission (%)"
                  defaultValue="2.5"
                  sx={{ width: 200 }}
                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                />
              </Paper>

              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Escrow Settings
                </Typography>
                <TextField
                  type="number"
                  label="Escrow Hold Period (days)"
                  defaultValue="7"
                  sx={{ width: 200, mb: 2 }}
                />
                <TextField
                  type="number"
                  label="Dispute Resolution Timeout (days)"
                  defaultValue="30"
                  sx={{ width: 200 }}
                />
              </Paper>

              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Verification Requirements
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="caption">
                    ✅ Farmers: NIC + Farming License
                  </Typography>
                  <Typography variant="caption">
                    ✅ Investors: Passport/NIC + Bank Statement + Business Registration
                  </Typography>
                  <Typography variant="caption">
                    ✅ Land Owners: NIC + Land Deed + Tax Certificate
                  </Typography>
                </Box>
              </Paper>

              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSaveContent}
              >
                Save Platform Settings
              </Button>
            </Box>
          )}

          {/* CMS Guidelines */}
          <Paper sx={{ mt: 3, p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              ⚠️ Content Management Guidelines
            </Typography>
            <Typography variant="body2" component="div">
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Changes to Terms of Service and Privacy Policy require legal review</li>
                <li>Global notifications are sent to all active users immediately</li>
                <li>Platform fee changes affect new transactions only (not retroactive)</li>
                <li>Always save changes before navigating away from the page</li>
                <li>Content changes are logged in the audit trail</li>
              </ul>
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CMSPage;
