import type { AlertColor } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

export interface NotificationProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  duration?: number;
  onClose: () => void;
}

/**
 * Reusable Notification Component using Material-UI Snackbar
 * Displays notifications for success, error, warning, or info messages
 * Automatically closes after specified duration (default 5 seconds)
 */
const Notification = ({
  open,
  message,
  severity = 'error',
  duration = 5000,
  onClose,
}: NotificationProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
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
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        elevation={6}
        sx={{
          width: '100%',
          minWidth: '300px',
          fontSize: '0.95rem',
          '& .MuiAlert-message': {
            padding: '8px 0',
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
