import { useAuth } from '@/Context/useAuth';
import {
  AccountCircle,
  AttachMoney,
  BarChart as BarChartIcon,
  Description,
  Home,
  Landscape,
  Mail,
  People,
  Settings,
  TrendingUp,
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

const InvestorSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: '/dashboard' },
    { text: 'My Offers', icon: <AttachMoney />, path: '/dashboard/my-offers' },
    { text: 'Farmer Search', icon: <People />, path: '/dashboard/farmer-search' },
    { text: 'Land Search', icon: <Landscape />, path: '/dashboard/land-search' },
    { text: 'Requests', icon: <Description />, path: '/dashboard/requests' },
    { text: 'ROI / Market Analysis', icon: <TrendingUp />, path: '/dashboard/roi-analysis' },
    { text: 'Profitability Charts', icon: <BarChartIcon />, path: '/dashboard/profitability' },
  ];

  const secondaryItems = [
    { text: 'Inbox', icon: <Mail />, path: '/dashboard/inbox' },
    { text: 'Account', icon: <AccountCircle />, path: '/dashboard/account' },
    { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Profile Section */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=investor"
          alt={user?.fullName || 'null'}
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
          {user?.fullName || 'null'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.role || 'null'}
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
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
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
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      {/* Logout Button */}
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

export default InvestorSidebar;
