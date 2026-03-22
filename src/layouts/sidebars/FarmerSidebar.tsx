import { useAuth } from "@/Context/useAuth";
import {
  AccountCircle,
  AttachMoney,
  BarChart as BarChartIcon,
  Handshake,
  Home,
  Mail,
  ShoppingCart as ReqIcon,
  Settings,
  TrendingUp,
} from "@mui/icons-material";
import type {} from "@mui/material";
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
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const FarmerSidebar = () => {
  const { user, sessionId, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const basePath = `/${sessionId}`;

  const menuItems = [
    { text: "Insights", icon: <Home />, path: `${basePath}/dashboard` },
    {
      text: "My Projects",
      icon: <BarChartIcon />,
      path: `${basePath}/dashboard/my-projects`,
    },
    {
      text: "Opportunities",
      icon: <TrendingUp />,
      path: `${basePath}/dashboard/opportunities`,
    },
    {
      text: "Match Making",
      icon: <Handshake />,
      path: `${basePath}/dashboard/match-making`,
    },
    {
      text: "Requests",
      icon: <ReqIcon />,
      path: `${basePath}/dashboard/requests`,
    },
    {
      text: "Payments",
      icon: <AttachMoney />,
      path: `${basePath}/dashboard/payments`,
    },
  ];

  const secondaryItems = [
    { text: "Inbox", icon: <Mail />, path: `${basePath}/dashboard/inbox` },
    {
      text: "Account",
      icon: <AccountCircle />,
      path: `${basePath}/dashboard/account`,
    },
    {
      text: "Settings",
      icon: <Settings />,
      path: `${basePath}/dashboard/settings`,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Avatar
          src={(() => {
            const p = user?.personalInfo?.profilePicture;
            if (!p) return undefined;
            if (typeof p === "string") return p;
            return p.url || undefined;
          })()}
          alt={user?.fullName || "null"}
          sx={{
            width: 120,
            height: 120,
            mx: "auto",
            mb: 2,
            border: "4px solid",
            borderColor: "primary.main",
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {user?.fullName || "null"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.role || "null"}
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
              sx={{
                color:
                  location.pathname === item.path ? "primary.main" : "inherit",
              }}
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
              sx={{
                color:
                  location.pathname === item.path ? "primary.main" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <Button variant="contained" fullWidth onClick={logout} sx={{ py: 1.5 }}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default FarmerSidebar;
