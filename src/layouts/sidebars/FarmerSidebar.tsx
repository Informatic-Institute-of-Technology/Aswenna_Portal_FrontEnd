import { useAuth } from '@/Context/useAuth';
import {
  AccountCircle,
  BarChart as BarChartIcon,
  Handshake,
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

const FarmerSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Insights', icon: <Home />, path: '/dashboard' },
    { text: 'My Projects', icon: <BarChartIcon />, path: '/dashboard/my-projects' },
    { text: 'Investors', icon: <People />, path: '/dashboard/investors' },
    { text: 'Land Owners', icon: <Landscape />, path: '/dashboard/land-owners' },
    { text: 'Match Making', icon: <Handshake />, path: '/dashboard/match-making' },
    { text: 'Opportunities', icon: <TrendingUp />, path: '/dashboard/opportunities' },
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
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJP8vN8tGwjdGdBoNRb3S7qP1VA0Q1F-SfWg&s"
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

export default FarmerSidebar;
