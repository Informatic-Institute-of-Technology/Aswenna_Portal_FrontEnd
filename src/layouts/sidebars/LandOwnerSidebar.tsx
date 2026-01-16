import { useAuth } from '@/Context/useAuth';
import {
    AccountCircle,
    AttachMoney,
    BarChart as BarChartIcon,
    Cloud,
    Description,
    Home,
    Landscape,
    Mail,
    People,
    Search,
    Settings,
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

const LandOwnerSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: '/dashboard' },
    { text: 'My Land Ads', icon: <Landscape />, path: '/dashboard/my-land-ads' },
    { text: 'Received Requests', icon: <Description />, path: '/dashboard/received-requests' },
    { text: 'Tenant Search', icon: <Search />, path: '/dashboard/tenant-search' },
    { text: 'Land Analysis', icon: <BarChartIcon />, path: '/dashboard/land-analysis' },
    { text: 'Income Tracker', icon: <AttachMoney />, path: '/dashboard/income-tracker' },
    { text: 'Soil & Weather', icon: <Cloud />, path: '/dashboard/soil-weather' },
    { text: 'Tenant Management', icon: <People />, path: '/dashboard/tenant-management' },
  ];

  const secondaryItems = [
    { text: 'Inbox', icon: <Mail />, path: '/dashboard/inbox' },
    { text: 'Account', icon: <AccountCircle />, path: '/dashboard/account' },
    { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=landowner"
          alt={user?.name || 'Land Owner'}
          sx={{ 
            width: 120, 
            height: 120, 
            mx: 'auto', 
            mb: 2,
            border: '4px solid',
            borderColor: 'primary.main',
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {user?.name || 'Land Owner'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Land Owner
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
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
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
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={logout}
          sx={{ py: 1.5 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default LandOwnerSidebar;
