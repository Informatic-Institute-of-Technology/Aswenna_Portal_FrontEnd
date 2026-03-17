import { useAuth } from "@/Context/useAuth";
import {
  AccountCircle,
  Agriculture as AgriIcon,
  BarChart as BarChartIcon,
  Gavel,
  Handshake,
  Home,
  Landscape,
  Mail,
  People,
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
      text: "Investors",
      icon: <People />,
      path: `${basePath}/dashboard/investors`,
    },
    {
      text: "Land Owners",
      icon: <Landscape />,
      path: `${basePath}/dashboard/land-owners`,
    },
    {
      text: "Agreement",
      icon: <Gavel />,
      path: `${basePath}/dashboard/agreement`,
    },
    {
      text: "Match Making",
      icon: <Handshake />,
      path: `${basePath}/dashboard/match-making`,
    },
    {
      text: "Opportunities",
      icon: <TrendingUp />,
      path: `${basePath}/dashboard/opportunities`,
    },
  ];

  const operationsItems = [
    {
      text: "Crop Jobs",
      icon: <AgriIcon />,
      path: `${basePath}/dashboard/crop-jobs`,
    },
    {
      text: "Requests",
      icon: <ReqIcon />,
      path: `${basePath}/dashboard/requests`,
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

      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: 10,
          }}
        >
          Operations
        </Typography>
      </Box>
      <List sx={{ py: 0 }}>
        {operationsItems.map((item) => (
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
