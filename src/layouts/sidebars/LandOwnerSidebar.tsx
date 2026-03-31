import AswendLogo from "@/assets/Aswenna Logo.png";
import { useAuth } from "@/Context/useAuth";
import {
  AccountCircle,
  Description,
  Home,
  Landscape,
  Logout,
  Mail,
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

interface LandOwnerSidebarProps {
  collapsed?: boolean;
}

const LandOwnerSidebar = ({ collapsed = false }: LandOwnerSidebarProps) => {
  const { sessionId, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const basePath = `/${sessionId}`;

  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: `${basePath}/dashboard` },
    {
      text: "My Offers",
      icon: <Landscape />,
      path: `${basePath}/dashboard/my-land-ads`,
    },
    {
      text: "Opportunities",
      icon: <Description />,
      path: `${basePath}/dashboard/received-requests`,
    },
    {
      text: "Smart Matchmaking",
      icon: <Description />,
      path: `${basePath}/dashboard/smart-matchmaking`,
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
      <Box sx={{ p: collapsed ? 1.5 : 3, textAlign: "center" }}>
        <Avatar
          src={AswendLogo}
          alt="Aswenna Logo"
          sx={{
            width: collapsed ? 44 : 120,
            height: collapsed ? 44 : 120,
            mx: "auto",
            mb: collapsed ? 0 : 2,
          }}
        />
        {!collapsed && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Aswenna.lk
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Land Owner Portal
            </Typography>
          </>
        )}
      </Box>

      <Divider />

      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              justifyContent: collapsed ? "center" : "initial",
              px: collapsed ? 1.5 : 2,
              py: 1.25,
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.path ? "primary.main" : "inherit",
                minWidth: collapsed ? 0 : 40,
                mr: collapsed ? 0 : 1,
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && <ListItemText primary={item.text} />}
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 0.5,
          minHeight: 30,
          visibility: collapsed ? "hidden" : "visible",
        }}
      >
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

      <Divider />

      <List sx={{ py: 2 }}>
        {secondaryItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              justifyContent: collapsed ? "center" : "initial",
              px: collapsed ? 1.5 : 2,
              py: 1.25,
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.path ? "primary.main" : "inherit",
                minWidth: collapsed ? 0 : 40,
                mr: collapsed ? 0 : 1,
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && <ListItemText primary={item.text} />}
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        {collapsed ? (
          <Button
            variant="contained"
            fullWidth
            onClick={logout}
            sx={{ py: 1.2 }}
          >
            <Logout fontSize="small" />
          </Button>
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={logout}
            sx={{ py: 1.5 }}
          >
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default LandOwnerSidebar;
