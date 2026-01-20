import { useAuth } from '@/Context/useAuth';
import {
    AccountCircle,
    Assessment,
    AttachMoney,
    Dashboard,
    Logout,
    People,
    Settings,
    Timeline,
    Warning,
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
    { text: 'Dashboard Insights', icon: <Dashboard />, path: '/dashboard' },
    { text: 'User Management', icon: <People />, path: '/dashboard/admin/users' },
    { text: 'Payment Ledger', icon: <AttachMoney />, path: '/dashboard/admin/payments' },
    { text: 'Active Projects', icon: <Assessment />, path: '/dashboard/admin/projects' },
    { text: 'Activity Log', icon: <Timeline />, path: '/dashboard/admin/activity-log' },
    { text: 'Risk & Disputes', icon: <Warning />, path: '/dashboard/admin/disputes' },
  ];

  const secondaryItems = [
    { text: 'Account', icon: <AccountCircle />, path: '/dashboard/account' },
    { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          src={'https://media.licdn.com/dms/image/v2/D5603AQGcdWrGrmsTOA/profile-displayphoto-scale_200_200/B56Zl8G7MMHMAc-/0/1758723825258?e=2147483647&v=beta&t=Uvw7_97CrvgPYSXMD5hlDV-c0V6y_fCROKYAN_Gwo10'}
          alt={user?.firstName || 'Super Admin'}
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 2,
            border: '4px solid',
            borderColor: 'error.main',
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {user?.fullName || 'Error'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'error.main',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Super Administrator
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon
              sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <List sx={{ py: 2 }}>
        {secondaryItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon
              sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default SuperAdminSidebar;
