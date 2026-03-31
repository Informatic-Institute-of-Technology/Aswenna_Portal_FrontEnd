import { useAuth } from "@/Context/useAuth";
import {
  AccountCircle,
  Logout,
  Mail,
  Menu,
  Notifications,
  Settings,
  SupportAgent,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LoadingAnimation from "../components/common/LoadingAnimation";
import type { NotificationItem } from "../components/common/NotificationPopup";
import NotificationPopup from "../components/common/NotificationPopup";
import { notificationsData } from "../data/json";
import {
  FarmerSidebar,
  InvestorSidebar,
  LandOwnerSidebar,
  SuperAdminSidebar,
} from "./sidebars";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const expandedDrawerWidth = 280;
const collapsedDrawerWidth = 88;

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    (notificationsData as NotificationItem[]).filter(
      (n) => n.userId === user?._id,
    ),
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isSidebarExpanded = sidebarPinned || isSidebarHovered;
  const activeDrawerWidth = isSidebarExpanded
    ? expandedDrawerWidth
    : collapsedDrawerWidth;

  const userProfilePicture = (() => {
    const profilePicture = user?.personalInfo?.profilePicture;
    if (!profilePicture) return undefined;
    if (typeof profilePicture === "string") return profilePicture;
    return profilePicture.url || undefined;
  })();

  const handleNotificationClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleSidebarToggle = () => {
    setSidebarPinned((prev) => !prev);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileClose();
    logout();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderSidebar = () => {
    switch (user?.role) {
      case "farmer":
        return <FarmerSidebar collapsed={!isSidebarExpanded} />;
      case "investor":
        return <InvestorSidebar collapsed={!isSidebarExpanded} />;
      case "landowner":
        return <LandOwnerSidebar collapsed={!isSidebarExpanded} />;
      case "superadmin":
        return <SuperAdminSidebar collapsed={!isSidebarExpanded} />;
    }
  };

  const getDashboardTitle = () => {
    switch (user?.role) {
      case "farmer":
        return "Farmer Portal";
      case "investor":
        return "Investor Portal";
      case "landowner":
        return "Land Owner Portal";
      case "superadmin":
        return "Super Admin Portal";
      default:
        return "Portal";
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        PaperProps={{
          onMouseEnter: () => setIsSidebarHovered(true),
          onMouseLeave: () => setIsSidebarHovered(false),
        }}
        sx={{
          width: activeDrawerWidth,
          flexShrink: 0,
          transition: "width 0.25s ease",
          "& .MuiDrawer-paper": {
            width: activeDrawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
            transition: "width 0.25s ease",
          },
        }}
      >
        {renderSidebar()}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${activeDrawerWidth}px)` },
          transition: "width 0.25s ease",
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3 },
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              color="inherit"
              onClick={handleSidebarToggle}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {getDashboardTitle()}
            </Typography>
          </Stack>

          <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
            <IconButton
              color="inherit"
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <Badge badgeContent={3} color="error">
                <Mail />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
              onClick={handleProfileClick}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                px: 1.2,
                py: 0.75,
                cursor: "pointer",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 2,
                },
              }}
            >
              <Avatar
                src={userProfilePicture}
                alt={user?.fullName || "User"}
                sx={{ width: 34, height: 34 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, lineHeight: 1.2 }}
                >
                  {user?.fullName || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role || "Member"}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Toolbar>

        <NotificationPopup
          anchorEl={anchorEl}
          onClose={handleNotificationClose}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllAsRead}
          onMarkAsRead={handleMarkAsRead}
        />

        <Popover
          open={Boolean(profileAnchorEl)}
          anchorEl={profileAnchorEl}
          onClose={handleProfileClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1.25,
              width: 280,
              p: 2,
              borderRadius: 3,
              boxShadow: 4,
            },
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src={userProfilePicture}
                alt={user?.fullName || "User"}
                sx={{ width: 48, height: 48 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {user?.fullName || "User"}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {user?.email || "randomuser@domain.com"}
                </Typography>
                <Typography variant="caption" color="primary.main">
                  {user?.role || "Member"}
                </Typography>
              </Box>
            </Stack>

            <List dense disablePadding>
              <ListItemButton onClick={handleProfileClose}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Edit profile" />
              </ListItemButton>
              <ListItemButton onClick={handleProfileClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Account settings" />
              </ListItemButton>
              <ListItemButton onClick={handleProfileClose}>
                <ListItemIcon>
                  <SupportAgent fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Support" />
              </ListItemButton>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sign out" />
              </ListItemButton>
            </List>
          </Stack>
        </Popover>

        {loading ? (
          <Container maxWidth="xl">
            <LoadingAnimation message="Loading Dashboard..." />
          </Container>
        ) : (
          (children ?? <Outlet />)
        )}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
