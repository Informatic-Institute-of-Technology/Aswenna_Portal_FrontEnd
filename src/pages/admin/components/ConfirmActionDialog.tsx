import type { GlobalUser } from "@/types/admin.types";
import {
  Block,
  CheckCircleOutline,
  Pending,
  PersonOff,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { ActionType } from "../utils/userManagement.utils";
import {
  getAvatarColor,
  getInitials,
  getRoleColor,
} from "../utils/userManagement.utils";

interface ActionConfig {
  title: string;
  body: string;
  color: string;
  icon: React.ReactNode;
}

const ACTION_CONFIGS: Record<ActionType, ActionConfig> = {
  approve: {
    title: "Approve Account",
    body: "This will activate the account and grant the user full access to the portal.",
    color: "#22c55e",
    icon: <CheckCircleOutline sx={{ fontSize: 40, color: "#22c55e" }} />,
  },
  reject: {
    title: "Reject Account",
    body: "This will permanently reject and remove this user's application. The user will be notified.",
    color: "#ef4444",
    icon: <PersonOff sx={{ fontSize: 40, color: "#ef4444" }} />,
  },
  suspend: {
    title: "Suspend Account",
    body: "This will temporarily block the user from accessing the portal. You can reactivate them later.",
    color: "#f97316",
    icon: <Block sx={{ fontSize: 40, color: "#f97316" }} />,
  },
  reactivate: {
    title: "Reactivate Account",
    body: "This will restore the user's access to the portal.",
    color: "#22c55e",
    icon: <CheckCircleOutline sx={{ fontSize: 40, color: "#22c55e" }} />,
  },
  set_pending: {
    title: "Set to Pending",
    body: "This will move the user back to Pending status, awaiting review.",
    color: "#f59e0b",
    icon: <Pending sx={{ fontSize: 40, color: "#f59e0b" }} />,
  },
};

interface ConfirmActionDialogProps {
  open: boolean;
  action: ActionType | null;
  user: GlobalUser | null;
  loading: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmActionDialog = ({
  open,
  action,
  user,
  loading,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmActionDialogProps) => {
  if (!action || !user) return null;

  const cfg = ACTION_CONFIGS[action];

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onCancel()}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "var(--bg-overlay)",
          border: `1px solid ${cfg.color}40`,
          boxShadow: `0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px ${cfg.color}20`,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          height: 4,
          background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`,
        }}
      />

      <DialogTitle sx={{ pt: 3, pb: 1.5, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: `${cfg.color}14`,
              border: `2px solid ${cfg.color}35`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cfg.icon}
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "white", lineHeight: 1.25 }}
          >
            {cfg.title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 0, pb: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "var(--color-olive-muted)",
            border: "1px solid var(--color-olive-muted-strong)",
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: getAvatarColor(user.fullName),
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            {getInitials(user.fullName)}
          </Avatar>
          <Box>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ color: "white" }}
            >
              {user.fullName}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.5)", display: "block" }}
            >
              {user.email}
            </Typography>
            <Chip
              label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              size="small"
              sx={{
                mt: 0.5,
                height: 18,
                fontSize: "0.65rem",
                fontWeight: 700,
                bgcolor: `${getRoleColor(user.role)}20`,
                color: getRoleColor(user.role),
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
            lineHeight: 1.6,
            mb: 2.5,
          }}
        >
          {cfg.body}
        </Typography>

        {errorMessage && (
          <Alert
            severity="error"
            sx={{ mb: 1.5, borderRadius: 2, fontSize: "0.8rem" }}
          >
            {errorMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          disabled={loading}
          onClick={onCancel}
          sx={{
            borderColor: "rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.65)",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              borderColor: "rgba(255,255,255,0.35)",
              bgcolor: "rgba(255,255,255,0.05)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={loading}
          onClick={onConfirm}
          sx={{
            bgcolor: cfg.color,
            color: "white",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: `0 4px 16px ${cfg.color}50`,
            "&:hover": { bgcolor: cfg.color, filter: "brightness(1.1)" },
            "&.Mui-disabled": { opacity: 0.55 },
          }}
        >
          {loading ? (
            <CircularProgress size={18} sx={{ color: "inherit" }} />
          ) : (
            `Confirm ${cfg.title}`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmActionDialog;
