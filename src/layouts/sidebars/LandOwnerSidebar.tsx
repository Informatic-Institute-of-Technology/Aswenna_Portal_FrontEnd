import { useAuth } from "@/Context/useAuth";
import {
  AccountCircle,
  Domain as AssetIcon,
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
} from "@mui/icons-material";
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

const LandOwnerSidebar = () => {
  const { user, sessionId, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const basePath = `/${sessionId}`;

  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: `${basePath}/dashboard` },
    {
      text: "My Land Ads",
      icon: <Landscape />,
      path: `${basePath}/dashboard/my-land-ads`,
    },
    {
      text: "Received Requests",
      icon: <Description />,
      path: `${basePath}/dashboard/received-requests`,
    },
    {
      text: "Tenant Search",
      icon: <Search />,
      path: `${basePath}/dashboard/tenant-search`,
    },
    {
      text: "Land Analysis",
      icon: <BarChartIcon />,
      path: `${basePath}/dashboard/land-analysis`,
    },
    {
      text: "Income Tracker",
      icon: <AttachMoney />,
      path: `${basePath}/dashboard/income-tracker`,
    },
    {
      text: "Soil & Weather",
      icon: <Cloud />,
      path: `${basePath}/dashboard/soil-weather`,
    },
    {
      text: "Tenant Management",
      icon: <People />,
      path: `${basePath}/dashboard/tenant-management`,
    },
  ];

  const assetItems = [
    {
      text: "Land Asset Register",
      icon: <AssetIcon />,
      path: `${basePath}/dashboard/land-assets`,
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
          Asset Management
        </Typography>
      </Box>
      <List sx={{ py: 0 }}>
        {assetItems.map((item) => (
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

export default LandOwnerSidebar;
