import { Alert, Box, Snackbar } from "@mui/material";
import { useState, useEffect } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface FlashcardNotificationContent {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number; // milliseconds, 0 = persistent
}

interface FlashcardNotificationProps {
  notification: FlashcardNotificationContent | null;
  onClose: () => void;
}

export const FlashcardNotification = ({
  notification,
  onClose,
}: FlashcardNotificationProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (notification) {
      setOpen(true);
    }
  }, [notification]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={notification?.duration ?? 5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{
        "& .MuiSnackbar-root": {
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        },
      }}
    >
      <Box
        sx={{
          borderRadius: 2,
          background:
            notification?.type === "error"
              ? "linear-gradient(135deg, #2b1f1f 0%, #3d2a2a 100%)"
              : notification?.type === "success"
                ? "linear-gradient(135deg, #1f2b1f 0%, #2a3d2a 100%)"
                : notification?.type === "warning"
                  ? "linear-gradient(135deg, #2b2a1f 0%, #3d3a2a 100%)"
                  : "linear-gradient(135deg, #1f2a2b 0%, #2a3d3d 100%)",
          border:
            notification?.type === "error"
              ? "1px solid #dc2626"
              : notification?.type === "success"
                ? "1px solid #16a34a"
                : notification?.type === "warning"
                  ? "1px solid #ea580c"
                  : "1px solid #0891b2",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
          padding: "12px 16px",
          maxWidth: 420,
          minWidth: 300,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Alert
            severity={notification?.type}
            onClose={handleClose}
            sx={{
              border: "none",
              background: "transparent",
              color:
                notification?.type === "error"
                  ? "#fca5a5"
                  : notification?.type === "success"
                    ? "#86efac"
                    : notification?.type === "warning"
                      ? "#fdba74"
                      : "#67e8f9",
              "& .MuiAlert-icon": {
                color:
                  notification?.type === "error"
                    ? "#fca5a5"
                    : notification?.type === "success"
                      ? "#86efac"
                      : notification?.type === "warning"
                        ? "#fdba74"
                        : "#67e8f9",
              },
              "& .MuiAlert-message": {
                padding: 0,
                fontSize: "14px",
                fontWeight: 500,
              },
            }}
          >
            {notification?.message}
          </Alert>
        </Box>
      </Box>
    </Snackbar>
  );
};
