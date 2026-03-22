import type { AlertColor } from "@mui/material";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

export interface NotificationProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  duration?: number;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  onClose: () => void;
}

const Notification = ({
  open,
  message,
  severity = "error",
  duration = 5000,
  anchorOrigin = { vertical: "top", horizontal: "right" },
  onClose,
}: NotificationProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpen(false);
    onClose();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      sx={anchorOrigin.vertical === "top" ? { mt: 8 } : { mb: 2, mr: 1 }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        elevation={6}
        sx={{
          width: "100%",
          minWidth: "300px",
          fontSize: "0.95rem",
          "& .MuiAlert-message": {
            padding: "8px 0",
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
