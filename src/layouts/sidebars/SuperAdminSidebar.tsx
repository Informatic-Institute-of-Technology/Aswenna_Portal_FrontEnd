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

const SuperAdminSidebar = () => {
  const { user, sessionId, logout } = useAuth();
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
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Box
          sx={{
            position: "relative",
            width: 128,
            height: 128,
            borderRadius: "50%",
            mx: "auto",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              background:
                "linear-gradient(90deg, var(--color-brand-accent), var(--color-brand-accent), var(--color-amber), var(--color-success), var(--color-info-blue), var(--color-purple), var(--color-brand-accent))",
              backgroundSize: "400% 400%",
              animation: "gradient-rotate 4s linear infinite",
              zIndex: 0,
            },
            "@keyframes gradient-rotate": {
              "0%": {
                backgroundPosition: "0% 50%",
              },
              "50%": {
                backgroundPosition: "100% 50%",
              },
              "100%": {
                backgroundPosition: "0% 50%",
              },
            },
          }}
        >
          <Avatar
            src={
              "https://media.licdn.com/dms/image/v2/D5603AQGcdWrGrmsTOA/profile-displayphoto-scale_200_200/B56Zl8G7MMHMAc-/0/1758723825258?e=2147483647&v=beta&t=Uvw7_97CrvgPYSXMD5hlDV-c0V6y_fCROKYAN_Gwo10"
            }
            alt={user?.firstName || "Super Admin"}
            sx={{
              width: 124,
              height: 124,
              position: "relative",
              zIndex: 1,
              border: "3px solid var(--bg-overlay)",
            }}
          />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {user?.fullName || "Error"}
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

      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            py: 1.5,
            fontWeight: 600,
            background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5568D3 0%, #65408C 100%)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default SuperAdminSidebar;
