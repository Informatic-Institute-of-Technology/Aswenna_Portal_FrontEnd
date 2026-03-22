import type { AlertColor } from "@mui/material";
import {
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Notification from "../../shared/components/Notification";

const ReceivedRequestsPage = () => {
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Opportunities
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review incoming investor proposals for your land opportunities.
          </Typography>
        </Box>


      </Box>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        duration={4000}
        onClose={handleCloseNotification}
      />
    </>
  );
};

export default ReceivedRequestsPage;
