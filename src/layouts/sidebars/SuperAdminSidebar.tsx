import { useAuth } from '@/Context/useAuth';
import {
    AccountBalance,
    Assessment,
    Campaign,
    Description,
    Gavel,
    Home,
    Logout,
    ManageAccounts,
    Security,
    Settings,
    VerifiedUser,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const SuperAdminSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Command Center', icon: <Home />, path: '/dashboard' },
    { text: 'User Management', icon: <ManageAccounts />, path: '/dashboard/users' },
    { text: 'Verification Queue', icon: <VerifiedUser />, path: '/dashboard/verification' },
    { text: 'Project Oversight', icon: <Assessment />, path: '/dashboard/projects' },
    { text: 'Dispute Resolution', icon: <Gavel />, path: '/dashboard/disputes' },
    { text: 'Payment Ledger', icon: <AccountBalance />, path: '/dashboard/payments' },
    { text: 'Escrow Management', icon: <Security />, path: '/dashboard/escrow' },
  ];

  const secondaryItems = [
    { text: 'Audit Logs', icon: <Description />, path: '/dashboard/audit-logs' },
    { text: 'CMS & Content', icon: <Campaign />, path: '/dashboard/cms' },
    { text: 'System Settings', icon: <Settings />, path: '/dashboard/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1a1a1a' }}>
      {/* Profile Section */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '2px solid #f44336' }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mx: 'auto',
            mb: 2,
            bgcolor: '#f44336',
            fontSize: '2.5rem',
          }}
        >
          SA
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f44336' }}>
          Super Admin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email || 'admin@aswenna.com'}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            px: 2,
            py: 0.5,
            bgcolor: 'rgba(244, 67, 54, 0.2)',
            borderRadius: 2,
            color: '#f44336',
            fontWeight: 600,
          }}
        >
          🔐 GOD MODE ACTIVE
        </Typography>
      </Box>

      <Divider />

      {/* Main Navigation */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'rgba(244, 67, 54, 0.2)',
                borderLeft: '4px solid #f44336',
              },
            }}
          >
            <ListItemIcon
              sx={{ color: location.pathname === item.path ? '#f44336' : 'inherit' }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      {/* Secondary Navigation */}
      <List sx={{ py: 2 }}>
        {secondaryItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'rgba(244, 67, 54, 0.2)',
                borderLeft: '4px solid #f44336',
              },
            }}
          >
            <ListItemIcon
              sx={{ color: location.pathname === item.path ? '#f44336' : 'inherit' }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={logout}
          sx={{ py: 1.5, fontWeight: 600 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default SuperAdminSidebar;
