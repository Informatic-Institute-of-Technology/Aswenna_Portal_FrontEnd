import AswendLogo from "@/assets/Aswenna Logo.png";
import { useAuth } from "@/Context/useAuth";
import {
  AccountCircle,
  Assessment,
  AttachMoney,
  Dashboard,
  Logout,
  People,
  Settings,
  Timeline,
  ViewList,
  Warning,
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

interface SuperAdminSidebarProps {
  collapsed?: boolean;
  onLogoutRequest?: () => void;
}

const SuperAdminSidebar = ({
  collapsed = false,
  onLogoutRequest,
}: SuperAdminSidebarProps) => {
  const { sessionId, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const basePath = `/${sessionId}`;

  const menuItems = [
    {
      text: "Dashboard Insights",
      icon: <Dashboard />,
      path: `${basePath}/dashboard`,
    },
    {
      text: "User Management",
      icon: <People />,
      path: `${basePath}/dashboard/admin/users`,
    },
    {
      text: "Payment Ledger",
      icon: <AttachMoney />,
      path: `${basePath}/dashboard/admin/payments`,
    },
    {
      text: "All Projects",
      icon: <ViewList />,
      path: `${basePath}/dashboard/admin/all-projects`,
    },
    {
      text: "Active Projects",
      icon: <Assessment />,
      path: `${basePath}/dashboard/admin/projects`,
    },
    {
      text: "Activity Log",
      icon: <Timeline />,
      path: `${basePath}/dashboard/admin/activity-log`,
    },
    {
      text: "Risk & Disputes",
      icon: <Warning />,
      path: `${basePath}/dashboard/admin/disputes`,
    },
  ];

  const secondaryItems = [
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
            <Typography
              variant="body2"
              sx={{
                color: "#03ffabff",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Super Admin Portal
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

      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={collapsed ? undefined : <Logout />}
          onClick={onLogoutRequest ?? handleLogout}
          sx={{
            py: collapsed ? 1.2 : 1.5,
            fontWeight: 600,
            background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5568D3 0%, #65408C 100%)",
            },
          }}
        >
          {collapsed ? <Logout fontSize="small" /> : "Logout"}
        </Button>
      </Box>
    </Box>
  );
};

export default SuperAdminSidebar;
