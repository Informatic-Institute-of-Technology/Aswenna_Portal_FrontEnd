import {
  AttachMoney,
  Cancel,
  CheckCircle,
  Circle,
  DoneAll,
  NotificationsNone,
  SwapHoriz,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React, { useMemo, useState } from "react";
import { notificationsData } from "../../data/json";

export interface NotificationMeta {
  requestId?: string;
  oldStatus?: string;
  newStatus?: string;
  amount?: number;
  currency?: string;
  projectName?: string;
  icon?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: "financial_update" | "approval_status" | "request_status";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  meta?: NotificationMeta;
}

interface NotificationPopupProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (
  type: string,
  metaIcon?: string,
  newStatus?: string,
) => {
  if (type === "financial_update") {
    return (
      <Box
        sx={{
          color: "#FBBF24",
          background: "rgba(251, 191, 36, 0.15)",
          borderRadius: "50%",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <AttachMoney fontSize="small" />
      </Box>
    );
  }

  if (type === "approval_status" || metaIcon === "check_circle" || newStatus === "accepted") {
    const isReject = metaIcon === "cancel" || newStatus === "rejected";
    const color = isReject ? "#F87171" : "#34D399";
    const bg = isReject ? "rgba(248, 113, 113, 0.15)" : "rgba(52, 211, 153, 0.15)";
    const IconComponent = isReject ? Cancel : CheckCircle;
    return (
      <Box sx={{
        color,
        background: bg,
        borderRadius: "50%",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <IconComponent fontSize="small" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        color: "#60A5FA",
        background: "rgba(96, 165, 250, 0.15)",
        borderRadius: "50%",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <SwapHoriz fontSize="small" />
    </Box>
  );
};

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  anchorEl,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
}) => {
  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const { todayNotifications, earlierNotifications } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayItems: NotificationItem[] = [];
    const earlierItems: NotificationItem[] = [];

    notifications.forEach((n) => {
      if (new Date(n.timestamp) >= today) {
        todayItems.push(n);
      } else {
        earlierItems.push(n);
      }
    });

    return {
      todayNotifications: todayItems,
      earlierNotifications: earlierItems,
    };
  }, [notifications]);

  const renderNotificationList = (
    items: NotificationItem[],
    label: string,
  ) => {
    if (items.length === 0) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            px: 2,
            py: 1,
            color: "#A1A1AA",
            fontWeight: 700,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </Typography>
        <Stack spacing={0.5}>
          {items.map((n) => (
            <Box
              key={n.id}
              onClick={() => onMarkAsRead(n.id)}
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                cursor: "pointer",
                borderRadius: 2,
                mx: 1,
                transition: "all 0.2s",
                background: n.read ? "transparent" : "rgba(255, 255, 255, 0.03)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.06)",
                },
              }}
            >
              {getNotificationIcon(n.type, n.meta?.icon, n.meta?.newStatus)}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: n.read ? "#E4E4E7" : "#FFFFFF",
                    fontWeight: n.read ? 500 : 700,
                    mb: 0.5,
                  }}
                >
                  {n.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="#A1A1AA"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    mb: 0.5,
                    lineHeight: 1.4,
                  }}
                >
                  {n.message}
                </Typography>
                <Typography
                  variant="caption"
                  color="#71717A"
                  sx={{ fontWeight: 500, fontSize: "0.65rem" }}
                >
                  {formatDistanceToNow(new Date(n.timestamp), {
                    addSuffix: true,
                  })}
                </Typography>
              </Box>
              {!n.read && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Circle sx={{ color: "#3B82F6", fontSize: 10 }} />
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1.5,
            width: 380,
            overflow: "hidden",
            borderRadius: 3,
            background: "rgba(24, 24, 27, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
            backgroundImage: "none",
          },
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#F4F4F5" }}>
          Notifications
        </Typography>
        {unreadCount > 0 && (
          <Button
            size="small"
            startIcon={<DoneAll sx={{ fontSize: 16 }} />}
            onClick={onMarkAllAsRead}
            sx={{
              textTransform: "none",
              color: "#3B82F6",
              fontSize: "0.75rem",
              fontWeight: 600,
              "&:hover": { background: "rgba(59, 130, 246, 0.1)" },
            }}
          >
            Mark all as read
          </Button>
        )}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <Box sx={{ maxHeight: 420, overflowY: "auto", py: 1 }}>
        {notifications.length === 0 ? (
          <Box
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <NotificationsNone
              sx={{ fontSize: 48, color: "rgba(255,255,255,0.1)", mb: 2 }}
            />
            <Typography variant="body1" sx={{ color: "#A1A1AA", fontWeight: 600 }}>
              No notifications yet
            </Typography>
            <Typography variant="caption" sx={{ color: "#71717A" }}>
              When you get notifications, they'll show up here
            </Typography>
          </Box>
        ) : (
          <>
            {renderNotificationList(todayNotifications, "New")}
            {renderNotificationList(earlierNotifications, "Earlier")}
          </>
        )}
      </Box>
    </Popover>
  );
};

export default NotificationPopup;
