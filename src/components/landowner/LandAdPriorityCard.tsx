import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface LandAdPriorityCardProps {
  ad: {
    id: string;
    title: string;
    landArea: string;
    location: string;
    soilType: string;
    rentalAmount: string;
    waterAvailability?: string;
    landHistory?: string;
    additionalInfo?: string;
    availableFrom: string;
    availableTo: string;
    image?: string;
    landownerName?: string;
    status: string;
    investorRequests: number;
    [key: string]: unknown;
  };
  defaultImage: string;
  onEdit?: (adId: string) => void;
  onDelete?: (adId: string) => void;
  statusConfig: Record<
    string,
    { label: string; color: "success" | "warning" | "default" }
  >;
  isOpen: boolean;
  isExpired: boolean;
}

const LandAdPriorityCard = ({
  ad,
  defaultImage,
  onEdit,
  onDelete,
  statusConfig,
  isOpen,
  isExpired,
}: LandAdPriorityCardProps) => {
  const [payloadDialogOpen, setPayloadDialogOpen] = useState(false);

  const handleViewPayload = () => {
    setPayloadDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Flexible";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRentalAmount = (value: string) => {
    if (!value) return "LKR 0";
    if (value.toLowerCase().includes("lkr")) return value;
    const numericValue = Number(value.replace(/,/g, ""));
    if (!Number.isNaN(numericValue)) {
      return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue);
    }
    return `LKR ${value}`;
  };

  const config = statusConfig[ad.status];
  const statusLabel = config?.label || "Unknown";
  const statusColor = config?.color || "default";

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(145deg, var(--bg-subtle) 0%, var(--bg-overlay) 100%)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow:
              "0 20px 40px var(--overlay-md), 0 0 20px var(--color-olive-muted)",
          },
        }}
      >
        {/* Image header with priority data overlay */}
        <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={ad.image || defaultImage}
            alt={ad.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.7,
              transition: "opacity 0.3s ease, transform 0.3s ease",
              "&:hover": { opacity: 0.85, transform: "scale(1.05)" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
            }}
          />

          {/* Status chip — top left */}
          <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
            <Chip
              label={statusLabel}
              color={statusColor}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Title + details chip — bottom left */}
          <Box sx={{ position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 10 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
                mb: 0.5,
                textShadow: "0 1px 4px rgba(0,0,0,0.7)",
              }}
            >
              {ad.title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip
                label={ad.landArea}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                }}
              />
              {ad.landownerName && (
                <Chip
                  label={ad.landownerName}
                  size="small"
                  sx={{
                    bgcolor: "rgba(133, 164, 70, 0.3)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Stack>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: 0 }}>
          {/* Priority Data Display */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              mb: 2,
            }}
          >
            {/* Rental Amount */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "var(--surface-tint)",
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Rental / Season
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "var(--color-olive-light)" }}
              >
                {formatRentalAmount(ad.rentalAmount)}
              </Typography>
            </Box>

            {/* Soil Type */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "var(--surface-tint)",
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Soil Type
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, textTransform: "capitalize" }}
              >
                {ad.soilType}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 1.5, opacity: 0.4 }} />

          {/* Location */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Location
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {ad.location}
            </Typography>
          </Box>

          {/* Water Availability */}
          {ad.waterAvailability && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Water Availability
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, textTransform: "capitalize" }}
              >
                {typeof ad.waterAvailability === "string"
                  ? ad.waterAvailability.replace(/-/g, " ")
                  : "Available"}
              </Typography>
            </Box>
          )}

          {/* Investor Requests */}
          {isOpen && (
            <Typography variant="caption" color="text.secondary">
              {ad.investorRequests} investor request
              {ad.investorRequests === 1 ? "" : "s"} received.
            </Typography>
          )}
        </CardContent>

        {/* Footer with actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
            mt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            background: "var(--surface-tint)",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              From
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {formatDate(ad.availableFrom)}
            </Typography>
          </Box>

          {isExpired && (
            <Button
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.7rem", textTransform: "none", px: 1.5 }}
            >
              New Season
            </Button>
          )}

          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              To
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {formatDate(ad.availableTo)}
            </Typography>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 0.5,
            px: 1,
            py: 1,
            background: "var(--surface-tint)",
          }}
        >
          {isOpen && onEdit && (
            <Tooltip title="Edit Ad">
              <IconButton
                size="small"
                onClick={() => onEdit(ad.id)}
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "var(--color-olive-muted)",
                  },
                }}
              >
                <Edit sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="View Full Details">
            <IconButton
              size="small"
              onClick={handleViewPayload}
              sx={{
                color: "primary.main",
                "&:hover": { backgroundColor: "var(--color-olive-muted)" },
              }}
            >
              <Visibility sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Tooltip>

          {isOpen && onDelete && (
            <Tooltip title="Delete Ad">
              <IconButton
                size="small"
                onClick={() => onDelete(ad.id)}
                sx={{
                  color: "error.main",
                  "&:hover": { backgroundColor: "rgba(211,47,47,0.1)" },
                }}
              >
                <Delete sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Card>

      {/* Full Payload Dialog */}
      <Dialog
        open={payloadDialogOpen}
        onClose={() => setPayloadDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "var(--bg-overlay)",
            backgroundImage:
              "linear-gradient(145deg, var(--bg-subtle) 0%, var(--bg-overlay) 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "white",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {ad.title} — Full Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3, color: "text.primary" }}>
          <Box
            component="pre"
            sx={{
              background: "rgba(0, 0, 0, 0.3)",
              p: 2,
              borderRadius: 1,
              overflow: "auto",
              maxHeight: 400,
              fontSize: "0.85rem",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {JSON.stringify(ad, null, 2)}
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, justifyContent: "flex-end" }}
          >
            <Button
              onClick={() => setPayloadDialogOpen(false)}
              variant="contained"
              sx={{
                background: "var(--color-olive-light)",
                color: "white",
                "&:hover": {
                  background: "var(--color-olive-dark)",
                },
              }}
            >
              Close
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LandAdPriorityCard;
