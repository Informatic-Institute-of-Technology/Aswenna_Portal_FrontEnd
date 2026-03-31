import { LocationOn } from "@mui/icons-material";
import { Box, Skeleton, Typography } from "@mui/material";
import React, { useState } from "react";
import type {
  LandownerAdApiItem,
  LocationData,
} from "../../services/landownerAds.service";

interface LandAdCardProps {
  ad: LandownerAdApiItem;
  onViewDetails: (ad: LandownerAdApiItem) => void;
}

type ImageWithUrl = { url?: string };

const isImageWithUrl = (image: unknown): image is ImageWithUrl =>
  typeof image === "object" && image !== null && "url" in image;

/** Resolve image URL from ad data */
const resolveCoverUrl = (ad: LandownerAdApiItem): string | null => {
  if (ad.images && ad.images.length > 0 && ad.images[0].url)
    return ad.images[0].url;

  if (ad.image) {
    if (typeof ad.image === "string") return ad.image;
    const legacyImage = ad.image as unknown;
    if (isImageWithUrl(legacyImage) && typeof legacyImage.url === "string")
      return legacyImage.url;
  }

  return null;
};

const getLocationString = (location?: string | LocationData): string => {
  if (!location) return "Location not specified";
  if (typeof location === "string") return location;

  const parts = [location.city, location.district, location.province].filter(
    Boolean,
  );

  if (parts.length > 0) return parts.join(", ");

  if (
    typeof location.latitude === "number" &&
    typeof location.longitude === "number"
  )
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;

  return "Location not specified";
};

const getSubtitle = (location?: string | LocationData): string => {
  if (!location) return "";
  if (typeof location === "string") return location;
  const parts = [location.province, location.district].filter(Boolean);
  return parts.join(", ");
};

const formatLeaseRate = (amount?: string | number): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  return `LKR ${num.toLocaleString("en-LK")}`;
};

const waterAvailabilityLabel = (val?: string): string => {
  if (!val) return "—";
  const map: Record<string, string> = {
    "river-source": "River Source",
    "river source": "River Source",
    "bore-well": "Bore Well",
    "bore well": "Bore Well",
    "natural-mist": "Natural Mist",
    "natural mist": "Natural Mist",
    "natural-spring": "Natural Spring",
    "natural spring": "Natural Spring",
    "drip-system": "Drip System",
    "drip system": "Drip System",
    "wewa-network": "Wewa Network",
    "wewa network": "Wewa Network",
    rainwater: "Rainwater",
    well: "Well",
    canal: "Canal",
    none: "None",
  };
  return map[val.toLowerCase()] ?? val;
};

const LandAdCard: React.FC<LandAdCardProps> = ({ ad, onViewDetails }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const coverUrl = !imgError ? resolveCoverUrl(ad) : null;
  const locationStr = getLocationString(ad.location);
  const subtitle = getSubtitle(ad.location);
  const isActive = ad.status === "ACTIVE";
  const isPending = ad.status === "PENDING";

  return (
    <Box
      sx={{
        bgcolor: "#111611",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.25s ease",
        "&:hover": {
          border: "1px solid rgba(133, 164, 70,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* ── Image ── */}
      <Box
        sx={{
          position: "relative",
          height: 130,
          bgcolor: "#1a2a1a",
          overflow: "hidden",
        }}
      >
        {coverUrl ? (
          <>
            {!imgLoaded && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={130}
                sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
              />
            )}
            <Box
              component="img"
              src={coverUrl}
              alt={ad.title}
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setImgError(true);
                setImgLoaded(true);
              }}
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
            }}
          />
        )}

        {/* Status badge */}
        {(isActive || isPending) && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: isActive ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.65)",
              borderRadius: "20px",
              px: 1.2,
              py: 0.35,
              backdropFilter: "blur(8px)",
              border: `1px solid ${isActive ? "rgba(133, 164, 70,0.3)" : "rgba(251,146,60,0.4)"}`,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: isActive ? "#85a446" : "#fb923c",
                boxShadow: isActive ? "0 0 6px #85a446" : "0 0 6px #fb923c",
              }}
            />
            <Typography
              sx={{
                color: "#e5e7eb",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {isActive ? "ACTIVE" : "PENDING"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Body ── */}
      <Box
        sx={{
          p: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
        }}
      >
        {/* Location row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LocationOn sx={{ fontSize: 13, color: "#85a446" }} />
          <Typography
            sx={{ color: "#9ca3af", fontSize: "0.75rem", lineHeight: 1.2 }}
          >
            {locationStr}
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            color: "#f0f4f0",
            fontWeight: 700,
            fontSize: "0.95rem",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ad.title}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography sx={{ color: "#6b7280", fontSize: "0.73rem" }}>
            {subtitle}
          </Typography>
        )}

        {/* Info grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px 12px",
            mt: 0.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              DIMENSIONS
            </Typography>
            <Typography
              sx={{
                color: "#e5e7eb",
                fontSize: "0.82rem",
                fontWeight: 600,
                mt: 0.2,
              }}
            >
              {ad.landArea ? `${ad.landArea} Acres` : "—"}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              LEASE RATE
            </Typography>
            <Typography
              sx={{
                color: "#85a446",
                fontSize: "0.82rem",
                fontWeight: 700,
                mt: 0.2,
              }}
            >
              {formatLeaseRate(ad.rentalAmount)}
              <Typography
                component="span"
                sx={{ color: "#6b7280", fontSize: "0.7rem", fontWeight: 400 }}
              >
                {" "}
                / mo
              </Typography>
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              SOIL COMPOSITION
            </Typography>
            <Typography
              sx={{
                color: "#e5e7eb",
                fontSize: "0.82rem",
                fontWeight: 600,
                mt: 0.2,
              }}
            >
              {ad.soilType
                ? ad.soilType.charAt(0).toUpperCase() + ad.soilType.slice(1)
                : "—"}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              IRRIGATION
            </Typography>
            <Typography
              sx={{
                color: "#e5e7eb",
                fontSize: "0.82rem",
                fontWeight: 600,
                mt: 0.2,
              }}
            >
              {waterAvailabilityLabel(ad.waterAvailability)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── View More Button ── */}
      <Box
        onClick={() => onViewDetails(ad)}
        sx={{
          mx: 2,
          mb: 2,
          py: 1.1,
          background: "linear-gradient(90deg, #85a446 0%, #93b34e 100%)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.8,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            background: "linear-gradient(90deg, #85a446 0%, #85a446 100%)",
            boxShadow: "0 4px 16px rgba(133, 164, 70,0.35)",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        <Typography
          sx={{
            color: "#0a120c",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.02em",
          }}
        >
          View More
        </Typography>
        <Typography
          sx={{
            color: "#0a120c",
            fontWeight: 700,
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          →
        </Typography>
      </Box>
    </Box>
  );
};

export default LandAdCard;
