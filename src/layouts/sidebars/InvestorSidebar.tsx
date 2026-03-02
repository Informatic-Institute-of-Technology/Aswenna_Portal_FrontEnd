import { useAuth } from "@/Context/useAuth";
import {
  AccountBalance,
  AccountCircle,
  AttachMoney,
  BarChart as BarChartIcon,
  BusinessCenter,
  Description,
  Home,
  Landscape,
  Mail,
  Payment,
  Settings,
  TrendingUp,
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

const InvestorSidebar = () => {
  const { user, sessionId, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const basePath = `/${sessionId}`;

  const mainItems = [
    { text: "Dashboard", icon: <Home />, path: `${basePath}/dashboard` },
    {
      text: "My Offers",
      icon: <AttachMoney />,
      path: `${basePath}/dashboard/my-offers`,
    },
    {
      text: "Opportunities",
      icon: <BusinessCenter />,
      path: `${basePath}/dashboard/opportunities`,
    },
    {
      text: "Land Search",
      icon: <Landscape />,
      path: `${basePath}/dashboard/land-search`,
    },
    {
      text: "Requests",
      icon: <Description />,
      path: `${basePath}/dashboard/requests`,
    },
    {
      text: "ROI / Market Analysis",
      icon: <TrendingUp />,
      path: `${basePath}/dashboard/roi-analysis`,
    },
    {
      text: "Profitability Charts",
      icon: <BarChartIcon />,
      path: `${basePath}/dashboard/profitability`,
    },
  ];

  const financeItems = [
    {
      text: "Finance Ledger",
      icon: <AccountBalance />,
      path: `${basePath}/dashboard/finance-ledger`,
    },
    {
      text: "Payment Pipeline",
      icon: <Payment />,
      path: `${basePath}/dashboard/payment-pipeline`,
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
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWHUQslqLEawVVIzUcGFkYYRm30cguWYwuhg&s"
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

      <List sx={{ flex: 1, py: 1, overflowY: "auto" }}>
        {mainItems.map((item) => (
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

        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.65rem",
            }}
          >
            Finance & Analytics
          </Typography>
        </Box>
        {financeItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              "&.Mui-selected": {
                bgcolor: "var(--color-olive-muted)",
                borderRight: "3px solid",
                borderColor: "primary.main",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.path
                    ? "primary.main"
                    : "text.secondary",
                minWidth: 36,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
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

export default InvestorSidebar;
