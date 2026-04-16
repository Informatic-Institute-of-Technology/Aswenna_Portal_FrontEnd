import AswendLogo from "@/assets/Aswenna Logo.png";
import { useAuth } from "@/Context/useAuth";
import {
  AccountBalance,
  AccountCircle,
  AttachMoney,
  BusinessCenter,
  Description,
  Home,
  Landscape,
  Logout,
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

interface InvestorSidebarProps {
  collapsed?: boolean;
  onLogoutRequest?: () => void;
}

const InvestorSidebar = ({
  collapsed = false,
  onLogoutRequest,
}: InvestorSidebarProps) => {
  const { sessionId, logout } = useAuth();
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
      text: "Smart Match Making",
      icon: <TrendingUp />,
      path: `${basePath}/dashboard/smart-match-making`,
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
      <Box sx={{ p: collapsed ? 1.5 : 3, textAlign: "center" }}>
        <Avatar
          src={AswendLogo}
          alt="Aswenna Logo"
          sx={{
            width: collapsed ? 44 : 120,
            height: collapsed ? 44 : 120,
            mx: "auto",
            mb: collapsed ? 0 : 2,
            border: "none",
          }}
        />
        {!collapsed && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Aswenna.lk
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Investor Portal
            </Typography>
          </>
        )}
      </Box>

      <Divider />

      <List sx={{ flex: 1, py: 2, overflowY: "auto" }}>
        {mainItems.map((item) => (
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
          px: collapsed ? 1.5 : 2,
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
            letterSpacing: "0.1em",
            fontSize: "0.65rem",
          }}
        >
          Finance & Analytics
        </Typography>
      </Box>

      <List sx={{ py: 1.5 }}>
        {financeItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              justifyContent: collapsed ? "center" : "initial",
              px: collapsed ? 1.5 : 2,
              py: 1.25,
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
                  location.pathname === item.path ? "primary.main" : "inherit",
                minWidth: collapsed ? 0 : 40,
                mr: collapsed ? 0 : 1,
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: location.pathname === item.path ? 600 : 500,
                }}
              />
            )}
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
            onClick={onLogoutRequest ?? logout}
            sx={{ py: 1.5 }}
          >
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default InvestorSidebar;
