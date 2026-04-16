import {
  Agriculture,
  CheckCircle,
  DoDisturb,
  FileUpload,
  HourglassEmpty,
  LocationOn,
  NotificationsActive,
  RateReview,
  Schedule,
  Verified,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

interface RequestCardProps {
  type: "agreement" | "farmer-request" | "sent-request";
  name: string;
  avatarUrl?: string;
  avatarInitials?: string;
  location: string;
  statusBadge: {
    label: string;
    variant:
      | "action"
      | "pending"
      | "review"
      | "new"
      | "accepted"
      | "rejected"
      | "pending_response"
      | "under_review"
      | "negotiating";
    color?: string;
  };
  tags?: { label: string; variant: "primary" | "secondary" }[];
  description: string;
  timestamp: string;
  primaryAction: { label: string; icon?: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  isVerified?: boolean;
  highlighted?: boolean;
  isSelected?: boolean;
}

const STATUS_STYLE: Record<
  string,
  { text: string; bg: string; Icon: React.ElementType }
> = {
  action: {
    text: "#FBBF24", 
    bg: "#4B330B", 
    Icon: NotificationsActive,
  },
  pending: {
    text: "#FBBF24",
    bg: "#4B330B",
    Icon: HourglassEmpty,
  },
  review: {
    text: "#FBBF24",
    bg: "#4B330B",
    Icon: RateReview,
  },
  new: {
    text: "#94a3b8",
    bg: "rgba(148,163,184,0.15)",
    Icon: Schedule,
  },
  accepted: {
    text: "#34D399",
    bg: "#064E3B",
    Icon: CheckCircle,
  },
  rejected: {
    text: "#F87171",
    bg: "#7F1D1D", 
    Icon: DoDisturb,
  },
  pending_response: {
    text: "#FBBF24",
    bg: "#4B330B",
    Icon: Schedule,
  },
  under_review: {
    text: "#60a5fa",
    bg: "rgba(96,165,250,0.15)",
    Icon: RateReview,
  },
  negotiating: {
    text: "#c084fc",
    bg: "rgba(192,132,252,0.15)",
    Icon: Schedule,
  },
};

const RequestCard = ({
  type,
  name,
  avatarUrl,
  avatarInitials,
  location,
  statusBadge,
  tags = [],
  description,
  timestamp,
  primaryAction,
  secondaryAction,
  isVerified = false,
  isSelected = false,
}: RequestCardProps) => {
  const ss = STATUS_STYLE[statusBadge.variant] ?? STATUS_STYLE.new;
  const StatusIcon = ss.Icon;
  const isAgreement = type === "agreement";

  return (
    <Box
      sx={{
        borderRadius: 2.5,
        overflow: "hidden",
        background: isSelected ? "rgba(163, 230, 53, 0.05)" : "#18181B",
        border: "1px solid",
        borderColor: isSelected ? "rgba(163, 230, 53, 0.3)" : "#27272A",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        "&:hover": {
          borderColor: "rgba(255,255,255,0.12)",
          transform: "translateY(-2px)",
        },
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pl: 3,
          pr: 2,
          pt: 2,
          pb: 1,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}
        >
          {avatarUrl ? (
            <Avatar src={avatarUrl} alt={name} sx={{ width: 44, height: 44 }} />
          ) : (
            <Avatar
              sx={{
                width: 44,
                height: 44,
                background: "#262626",
                fontWeight: 800,
                fontSize: "0.95rem",
                color: "#cbd5e1",
              }}
            >
              {avatarInitials}
            </Avatar>
          )}

          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 800,
                  color: "#F4F4F5",
                  fontSize: "0.9rem",
                  lineHeight: 1.2,
                }}
              >
                {name}
              </Typography>
              {isVerified && (
                <Verified sx={{ fontSize: 15, color: "#85a446" }} />
              )}
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: 0.25 }}
            >
              <LocationOn sx={{ fontSize: 12, color: "#A1A1AA" }} />
              <Typography
                variant="caption"
                sx={{ color: "#A1A1AA", fontSize: "0.72rem" }}
              >
                {location}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.6,
            px: 1.25,
            py: 0.55,
            borderRadius: 1.5,
            background: ss.bg,
            flexShrink: 0,
          }}
        >
          <StatusIcon sx={{ fontSize: 13, color: ss.text }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: ss.text,
              fontSize: "0.7rem",
              whiteSpace: "nowrap",
              letterSpacing: 0.3,
            }}
          >
            {statusBadge.label}
          </Typography>
        </Box>
      </Box>

      {tags.length > 0 && (
        <Box sx={{ pl: 3, pr: 2, pb: 1 }}>
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {tags.map((tag, i) => (
              <Chip
                key={i}
                label={tag.label}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  background: "#3F3F46",
                  color: "#F4F4F5",
                  border: "1px solid #4B5563",
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <Typography
        variant="body2"
        sx={{
          p: "0 16px 14px 24px",
          fontSize: "0.82rem",
          lineHeight: 1.65,
          color: "#A1A1AA",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {description}
      </Typography>

      <Divider sx={{ borderColor: "#27272A", mx: 3 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pl: 3,
          pr: 2,
          py: 1.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "#71717A", fontSize: "0.7rem", fontWeight: 500 }}
        >
          {timestamp}
        </Typography>

        <Stack direction="row" spacing={1}>
          {secondaryAction && (
            <Button
              size="small"
              variant="outlined"
              onClick={secondaryAction.onClick}
              sx={{
                fontSize: "0.72rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1.5,
                borderColor: "rgba(255,255,255,0.12)",
                color: "#94a3b8",
                py: 0.5,
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "#fff",
                },
              }}
            >
              {secondaryAction.label}
            </Button>
          )}

          <Button
            size="small"
            variant="contained"
            startIcon={
              isAgreement ? (
                <FileUpload sx={{ fontSize: 14 }} />
              ) : (
                <Agriculture sx={{ fontSize: 14 }} />
              )
            }
            onClick={primaryAction.onClick}
            sx={{
              fontSize: "0.72rem",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: 1.5,
              py: 0.55,
              background: "linear-gradient(135deg, #85a446 0%, #aed95c 100%)",
              color: "#fff",
              boxShadow: "0 3px 12px rgba(133,164,70,0.35)",
              "&:hover": {
                boxShadow: "0 5px 18px rgba(133,164,70,0.45)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {primaryAction.label}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default RequestCard;
