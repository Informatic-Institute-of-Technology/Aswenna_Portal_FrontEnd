import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  Visibility,
  LocationOn,
  Landscape,
  CalendarToday,
  Grain,
  PaidOutlined,
  Person,
} from "@mui/icons-material";
import type { LandownerAdApiItem, LandownerInfo } from "../../services/landownerAds.service";

interface LandAdCardProps {
  ad: LandownerAdApiItem;
  onViewDetails: (ad: LandownerAdApiItem) => void;
}

const soilColorMap: Record<string, string> = {
  loamy: "#84cc16",
  clay: "#f97316",
  sandy: "#eab308",
  peaty: "#8b5cf6",
  chalky: "#06b6d4",
  silt: "#ec4899",
};

const getSoilColor = (soilType?: string) => {
  if (!soilType) return "#84cc16";
  return soilColorMap[soilType.toLowerCase()] ?? "#84cc16";
};

const formatCurrency = (amount?: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount ?? 0;
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
    month: "short",
    year: "numeric",
  });
};

const getLandownerName = (landowner?: string | LandownerInfo): string => {
  if (!landowner) return "Landowner";
  if (typeof landowner === "string") return "Landowner";
  return landowner.fullName || landowner.email?.split("@")[0] || "Landowner";
};

const getInitial = (name: string) => name.charAt(0).toUpperCase();

/** Resolve image URL from either a string URL, an image object, or images array */
const resolveCoverUrl = (ad: LandownerAdApiItem): string | null => {
  // Prefer images array first
  if (ad.images && ad.images.length > 0 && ad.images[0].url) {
    return ad.images[0].url;
  }
  // Fallback to image field (can be string or LandImage object)
  if (ad.image) {
    if (typeof ad.image === "string") return ad.image;
    if (typeof ad.image === "object" && (ad.image as any).url) return (ad.image as any).url;
  }
  return null;
};

const getLocationString = (location?: string | object): string => {
  if (!location) return "Location not specified";
  if (typeof location === "string") return location;
  const loc = location as any;
  // Prefer descriptive text fields
  const parts = [loc.city, loc.district, loc.province].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  // Fall back to coordinates if nothing else
  if (loc.latitude && loc.longitude) return `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
  return "Location not specified";
};

const landHistoryLabels: Record<string, string> = {
  "organic-previous": "🌿 Previously Organic",
  "chemical-previous": "⚗️ Previously Chemical",
  fallow: "🌾 Fallow",
  new: "✨ New Land",
};

const LandAdCard: React.FC<LandAdCardProps> = ({ ad, onViewDetails }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const coverUrl = !imgError ? resolveCoverUrl(ad) : null;

  const landownerName = getLandownerName(ad.landowner as any);
  const locationStr = getLocationString(ad.location);
  const soilColor = getSoilColor(ad.soilType);
  const historyLabel = landHistoryLabels[ad.landHistory ?? ""] ?? ad.landHistory;

  return (
    <Card
      sx={{
        position: "relative",
        bgcolor: "transparent",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        "&:hover": {
          border: "1px solid rgba(132,204,22,0.35)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(132,204,22,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* ── Image Section ── */}
      <Box sx={{ position: "relative", height: 190, overflow: "hidden" }}>
        {coverUrl ? (
          <>
            {!imgLoaded && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={190}
                sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
              />
            )}
            <Box
              component="img"
              src={coverUrl}
              alt={ad.title}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: imgLoaded ? "block" : "none",
                transition: "transform 0.4s ease",
                "&:hover": { transform: "scale(1.04)" },
              }}
            />
          </>
        ) : (
          <Box
            sx={{
              height: "100%",
              background:
                "linear-gradient(135deg, #1a3320 0%, #2d5a3d 50%, #1e4028 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Landscape sx={{ fontSize: 64, color: "rgba(132,204,22,0.3)" }} />
          </Box>
        )}

        {/* Gradient overlay at bottom */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background:
              "linear-gradient(to top, rgba(10,18,12,0.95) 0%, transparent 100%)",
          }}
        />

        {/* Status chip */}
        {ad.status === "ACTIVE" && (
          <Box sx={{ position: "absolute", top: 12, right: 12 }}>
            <Chip
              label="Active"
              size="small"
              sx={{
                bgcolor: "rgba(132,204,22,0.18)",
                color: "#84cc16",
                border: "1px solid rgba(132,204,22,0.35)",
                fontWeight: 700,
                fontSize: "0.7rem",
                height: 22,
                backdropFilter: "blur(8px)",
              }}
            />
          </Box>
        )}

        {/* Image count badge */}
        {(ad.images?.length ?? 0) > 1 && (
          <Box sx={{ position: "absolute", top: 12, left: 12 }}>
            <Chip
              label={`📷 ${ad.images!.length}`}
              size="small"
              sx={{
                bgcolor: "rgba(0,0,0,0.5)",
                color: "#fff",
                backdropFilter: "blur(8px)",
                fontWeight: 600,
                fontSize: "0.7rem",
                height: 22,
              }}
            />
          </Box>
        )}

        {/* Land area overlay at bottom-left */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 14,
            display: "flex",
            alignItems: "center",
            gap: 0.6,
          }}
        >
          <Landscape sx={{ fontSize: 15, color: "#84cc16" }} />
          <Typography
            sx={{
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 700,
              textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            {ad.landArea} acres
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 2.2, pb: "2.2 !important" }}>
        {/* ── Title & View Button ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1.2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "1rem",
              lineHeight: 1.3,
              flex: 1,
              pr: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {ad.title}
          </Typography>
          <Tooltip title="View Details" placement="left">
            <IconButton
              onClick={() => onViewDetails(ad)}
              size="small"
              sx={{
                bgcolor: "rgba(132,204,22,0.12)",
                border: "1px solid rgba(132,204,22,0.25)",
                color: "#84cc16",
                borderRadius: "10px",
                p: 0.8,
                flexShrink: 0,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#84cc16",
                  color: "#0a120c",
                  boxShadow: "0 0 12px rgba(132,204,22,0.4)",
                },
              }}
            >
              <Visibility sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* ── Location ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
          <LocationOn sx={{ fontSize: 14, color: "#84cc16" }} />
          <Typography
            variant="body2"
            sx={{
              color: "var(--text-secondary)",
              fontSize: "0.78rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {locationStr}
          </Typography>
        </Box>

        {/* ── Chips: Soil & History ── */}
        <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", mb: 1.5 }}>
          {ad.soilType && (
            <Chip
              icon={<Grain sx={{ fontSize: "13px !important", color: `${soilColor} !important` }} />}
              label={ad.soilType}
              size="small"
              sx={{
                bgcolor: `${soilColor}14`,
                border: `1px solid ${soilColor}40`,
                color: soilColor,
                fontSize: "0.7rem",
                fontWeight: 600,
                height: 22,
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
                fontSize: "0.7rem",
                fontWeight: 600,
                height: 22,
              }}
            />
          )}
        </Box>

        {/* ── Rental Amount ── */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, rgba(132,204,22,0.08) 0%, rgba(132,204,22,0.03) 100%)",
            border: "1px solid rgba(132,204,22,0.2)",
            borderRadius: "10px",
            px: 1.8,
            py: 1,
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 0.8,
          }}
        >
          <PaidOutlined sx={{ fontSize: 18, color: "#84cc16" }} />
          <Box>
            <Typography
              sx={{ color: "var(--text-secondary)", fontSize: "0.65rem", fontWeight: 500 }}
            >
              Rental Amount / Season
            </Typography>
            <Typography sx={{ color: "#84cc16", fontSize: "1.05rem", fontWeight: 800 }}>
              {formatCurrency(ad.rentalAmount)}
            </Typography>
          </Box>
        </Box>

        {/* ── Availability Dates ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 1.8,
          }}
        >
          <CalendarToday sx={{ fontSize: 13, color: "var(--text-secondary)" }} />
          <Typography
            variant="body2"
            sx={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}
          >
            {formatDate(ad.availableFrom)} — {formatDate(ad.availableTo)}
          </Typography>
        </Box>

        {/* ── Landowner Footer ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pt: 1.5,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Avatar
            src={(ad.landowner as LandownerInfo)?.personalInfo?.profilePicture?.url}
            sx={{
              width: 26,
              height: 26,
              fontSize: "0.75rem",
              fontWeight: 700,
              bgcolor: "rgba(132,204,22,0.2)",
              color: "#84cc16",
              border: "1px solid rgba(132,204,22,0.3)",
            }}
          >
            {getInitial(landownerName)}
          </Avatar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Person sx={{ fontSize: 12, color: "var(--text-secondary)" }} />
            <Typography
              variant="body2"
              sx={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 500 }}
            >
              {landownerName}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LandAdCard;
