import {
  CalendarToday,
  Close,
  Email,
  Grain,
  Handshake,
  History,
  Info,
  Landscape,
  LocationOn,
  NavigateBefore,
  NavigateNext,
  PaidOutlined,
  Person,
  WaterDrop,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import type {
  LandownerAdApiItem,
  LandownerInfo,
  LocationData,
} from "../../services/landownerAds.service";

interface LandAdDetailDialogProps {
  open: boolean;
  onClose: () => void;
  ad: LandownerAdApiItem | null;
  onHire?: (ad: LandownerAdApiItem) => void;
}

const formatCurrency = (amount?: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getLandownerInfo = (landowner?: string | LandownerInfo) => {
  if (!landowner || typeof landowner === "string") {
    return { name: "Landowner", email: null, avatar: null };
  }
  return {
    name: landowner.fullName || landowner.email?.split("@")[0] || "Landowner",
    email: landowner.email ?? null,
    avatar: landowner.personalInfo?.profilePicture?.url ?? null,
  };
};

const getLocationString = (location?: string | LocationData): string => {
  if (!location) return "Location not specified";
  if (typeof location === "string") return location;
  const loc: LocationData = location;
  const parts = [
    loc.street,
    loc.city,
    loc.district,
    loc.province,
    loc.postalCode,
  ].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  if (loc.latitude && loc.longitude)
    return `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
  return "Location not specified";
};

const soilColorMap: Record<string, string> = {
  loamy: "#9ca3af",
  clay: "#f97316",
  sandy: "#eab308",
  peaty: "#8b5cf6",
  chalky: "#06b6d4",
  silt: "#ec4899",
};

const getSoilColor = (soilType?: string) =>
  soilColorMap[(soilType ?? "").toLowerCase()] ?? "#9ca3af";

const landHistoryLabels: Record<string, string> = {
  "organic-previous": "🌿 Previously Organic",
  "chemical-previous": "⚗️ Previously Chemical",
  fallow: "🌾 Fallow",
  new: "✨ New Land",
};

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  accent?: string;
  iconEl: React.ReactElement<{ sx?: object }>;
}

const InfoRow: React.FC<InfoRowProps> = ({
  iconEl,
  label,
  value,
  accent = "#9ca3af",
}) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 0.5 }}>
    <Box
      sx={{
        mt: 0.1,
        width: 32,
        height: 32,
        borderRadius: "8px",
        bgcolor: `${accent}14`,
        border: `1px solid ${accent}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        "& svg": { fontSize: 16, color: accent },
      }}
    >
      {iconEl}
    </Box>
    <Box>
      <Typography
        sx={{
          color: "var(--text-secondary)",
          fontSize: "0.72rem",
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: "var(--text-primary)",
          fontWeight: 600,
          fontSize: "0.9rem",
          mt: 0.3,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

const LandAdDetailDialog: React.FC<LandAdDetailDialogProps> = ({
  open,
  onClose,
  ad,
  onHire,
}) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  if (!ad) return null;

  const images = ad.images?.filter((i) => i.url) ?? [];
  const coverImg = !imgError && images.length > 0 ? images[imgIdx]?.url : null;
  const landowner = getLandownerInfo(ad.landowner);
  const locationStr = getLocationString(ad.location);
  const soilColor = getSoilColor(ad.soilType);
  const historyLabel =
    landHistoryLabels[ad.landHistory ?? ""] ?? ad.landHistory;

  const handlePrev = () =>
    setImgIdx((p) => (p - 1 + images.length) % images.length);
  const handleNext = () => setImgIdx((p) => (p + 1) % images.length);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0b0b0b",
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        },
      }}
    >
      {/* ── Image Gallery Header ── */}
      <Box sx={{ position: "relative", height: 280, bgcolor: "#0f0f0f" }}>
        {coverImg ? (
          <Box
            component="img"
            src={coverImg}
            alt={ad.title}
            onError={() => setImgError(true)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              background:
                "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Landscape sx={{ fontSize: 80, color: "rgba(255,255,255,0.18)" }} />
          </Box>
        )}

        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Image nav arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.55)",
                color: "#fff",
                backdropFilter: "blur(6px)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
              }}
            >
              <NavigateBefore />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.55)",
                color: "#fff",
                backdropFilter: "blur(6px)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
              }}
            >
              <NavigateNext />
            </IconButton>
            {/* Dot indicators */}
            <Stack
              direction="row"
              spacing={0.6}
              sx={{
                position: "absolute",
                bottom: 14,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {images.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setImgIdx(i)}
                  sx={{
                    width: i === imgIdx ? 20 : 7,
                    height: 7,
                    borderRadius: "4px",
                    bgcolor:
                      i === imgIdx ? "#e5e7eb" : "rgba(255,255,255,0.35)",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </Stack>
          </>
        )}

        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "#fff",
            backdropFilter: "blur(6px)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <Close />
        </IconButton>

        {/* Status badge */}
        {ad.status === "ACTIVE" && (
          <Chip
            label="● Active"
            size="small"
            sx={{
              position: "absolute",
              top: 14,
              left: 14,
              bgcolor: "rgba(255,255,255,0.08)",
              color: "#e5e7eb",
              border: "1px solid rgba(255,255,255,0.2)",
              fontWeight: 700,
              fontSize: "0.72rem",
              backdropFilter: "blur(8px)",
            }}
          />
        )}

        {/* Bottom-left: land area */}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: 18,
            display: "flex",
            alignItems: "center",
            gap: 0.6,
          }}
        >
          <Landscape sx={{ fontSize: 16, color: "#e5e7eb" }} />
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.1rem",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {ad.landArea} acres
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* ── Title & Location ── */}
          <Typography
            variant="h5"
            sx={{
              color: "var(--text-primary)",
              fontWeight: 800,
              mb: 0.8,
              lineHeight: 1.2,
            }}
          >
            {ad.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
            <LocationOn sx={{ fontSize: 16, color: "#e5e7eb" }} />
            <Typography
              sx={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}
            >
              {locationStr}
            </Typography>
          </Box>

          {/* ── Tags Row ── */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
            {ad.soilType && (
              <Chip
                icon={
                  <Grain
                    sx={{
                      fontSize: "14px !important",
                      color: `${soilColor} !important`,
                    }}
                  />
                }
                label={`${ad.soilType} Soil`}
                size="small"
                sx={{
                  bgcolor: `${soilColor}14`,
                  border: `1px solid ${soilColor}40`,
                  color: soilColor,
                  fontWeight: 600,
                }}
              />
            )}
            {historyLabel && (
              <Chip
                label={historyLabel}
                size="small"
                sx={{
                  bgcolor: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#818cf8",
                  fontWeight: 600,
                }}
              />
            )}
            {ad.waterAvailability && (
              <Chip
                icon={
                  <WaterDrop
                    sx={{
                      fontSize: "14px !important",
                      color: "#06b6d4 !important",
                    }}
                  />
                }
                label={ad.waterAvailability}
                size="small"
                sx={{
                  bgcolor: "rgba(6,182,212,0.1)",
                  border: "1px solid rgba(6,182,212,0.3)",
                  color: "#06b6d4",
                  fontWeight: 600,
                }}
              />
            )}
          </Box>

          {/* ── Rental Highlight ── */}
          <Box
            sx={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              p: 2,
              mb: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                bgcolor: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PaidOutlined sx={{ color: "#e5e7eb", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography
                sx={{ color: "var(--text-secondary)", fontSize: "0.72rem" }}
              >
                Rental Amount per Month
              </Typography>
              <Typography
                sx={{
                  color: "#f5f5f5",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  lineHeight: 1.2,
                }}
              >
                {formatCurrency(ad.rentalAmount)}
              </Typography>
            </Box>
          </Box>

          {/* ── Info Grid ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              p: 2,
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
              mb: 2.5,
            }}
          >
            <InfoRow
              iconEl={<CalendarToday />}
              label="Available From"
              value={formatDate(ad.availableFrom)}
              accent="#06b6d4"
            />
            <InfoRow
              iconEl={<CalendarToday />}
              label="Available To"
              value={formatDate(ad.availableTo)}
              accent="#f97316"
            />
          </Box>

          {/* ── Additional Info ── */}
          {ad.additionalInfo && (
            <Box
              sx={{
                p: 2,
                bgcolor: "rgba(255,255,255,0.025)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
                mb: 2.5,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1 }}
              >
                <Info sx={{ fontSize: 16, color: "#818cf8" }} />
                <Typography
                  sx={{ color: "#818cf8", fontWeight: 700, fontSize: "0.8rem" }}
                >
                  Additional Information
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                }}
              >
                {ad.additionalInfo}
              </Typography>
            </Box>
          )}

          {/* ── Land History (verbose) ── */}
          {ad.landHistory && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}
            >
              <History sx={{ fontSize: 16, color: "#a78bfa" }} />
              <Typography
                sx={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}
              >
                <span style={{ color: "#a78bfa", fontWeight: 600 }}>
                  Land History:{" "}
                </span>
                {historyLabel || ad.landHistory}
              </Typography>
            </Box>
          )}

          <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mb: 2.5 }} />

          {/* ── Landowner Card ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              bgcolor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              mb: 3,
            }}
          >
            <Avatar
              src={landowner.avatar ?? undefined}
              sx={{
                width: 52,
                height: 52,
                fontSize: "1.25rem",
                fontWeight: 800,
                bgcolor: "rgba(255,255,255,0.08)",
                color: "#f5f5f5",
                border: "2px solid rgba(255,255,255,0.18)",
              }}
            >
              {landowner.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                {landowner.name}
              </Typography>
              {landowner.email && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.3,
                  }}
                >
                  <Email
                    sx={{ fontSize: 13, color: "var(--text-secondary)" }}
                  />
                  <Typography
                    sx={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}
                  >
                    {landowner.email}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.2,
                }}
              >
                <Person sx={{ fontSize: 13, color: "var(--text-secondary)" }} />
                <Typography
                  sx={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}
                >
                  Land Owner
                </Typography>
              </Box>
            </Box>
            <Chip
              label="Contact"
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#f5f5f5",
                fontWeight: 700,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
              }}
              onClick={() =>
                landowner.email && window.open(`mailto:${landowner.email}`)
              }
            />
          </Box>

          {/* ── CTA Buttons ── */}
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "#d1d5db",
                fontWeight: 600,
                borderRadius: "10px",
                textTransform: "none",
                px: 2.5,
                py: 0.9,
                fontSize: "0.9rem",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.35)",
                  bgcolor: "rgba(255,255,255,0.06)",
                  color: "#f5f5f5",
                },
              }}
            >
              Close
            </Button>
            <Tooltip title={!onHire ? "Hire feature coming soon" : ""}>
              <span>
                <Button
                  variant="contained"
                  disabled={!onHire}
                  startIcon={<Handshake />}
                  onClick={() => onHire && onHire(ad)}
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#1a1a1a",
                    fontWeight: 700,
                    borderRadius: "10px",
                    textTransform: "none",
                    px: 2.5,
                    py: 0.9,
                    fontSize: "0.9rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    "&:hover": {
                      bgcolor: "#e5e7eb",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.35)",
                    },
                  }}
                >
                  Hire Landowner
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LandAdDetailDialog;
