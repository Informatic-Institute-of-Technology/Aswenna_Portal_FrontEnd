import {
  ArrowBack,
  CalendarToday,
  Close,
  Download,
  Grain,
  Handshake,
  Landscape,
  LocationOn,
  Mail,
  Message,
  Person,
  Verified,
  WaterDrop,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
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

const formatCurrency = (amount?: string | number): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-CA"); // YYYY-MM-DD
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
  const parts = [loc.city, loc.district, loc.province].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  if (loc.latitude && loc.longitude)
    return `${loc.latitude.toFixed(4)}° N, ${loc.longitude.toFixed(4)}° E`;
  return "Location not specified";
};

const getCoordinates = (location?: string | LocationData): { lat: number; lng: number } | null => {
  if (!location || typeof location === "string") return null;
  const loc = location as LocationData;
  if (loc.latitude && loc.longitude) return { lat: loc.latitude, lng: loc.longitude };
  return null;
};

const soilColorMap: Record<string, string> = {
  loamy: "#84cc16",
  clay: "#f97316",
  sandy: "#eab308",
  peaty: "#8b5cf6",
  chalky: "#06b6d4",
  silt: "#ec4899",
};

const getSoilColor = (soilType?: string) =>
  soilColorMap[(soilType ?? "").toLowerCase()] ?? "#84cc16";

const landHistoryLabels: Record<string, string> = {
  "organic-previous": "organic-previous",
  "chemical-previous": "chemical-previous",
  fallow: "fallow",
  new: "new",
};

const LandAdDetailDialog: React.FC<LandAdDetailDialogProps> = ({
  open,
  onClose,
  ad,
  onHire,
}) => {
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  if (!ad) return null;

  const images = (ad.images ?? []).filter((i) => i.url);
  const mainImg = !imgError && images.length > 0 ? images[mainImgIdx]?.url : null;
  const landowner = getLandownerInfo(ad.landowner);
  const locationStr = getLocationString(ad.location);
  const coords = getCoordinates(ad.location);
  const soilColor = getSoilColor(ad.soilType);
  const historyLabel = landHistoryLabels[ad.landHistory ?? ""] ?? ad.landHistory ?? "";

  const extraPhotos = Math.max(0, images.length - 3);
  const thumbImages = images.slice(0, 3);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0d1610",
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          overflow: "hidden",
          maxHeight: "92vh",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: "auto" }}>
        <Box sx={{ bgcolor: "#0d1610", minHeight: "100%" }}>
          {/* ── Top Bar (breadcrumb + close) ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 1.8,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={onClose} size="small" sx={{ color: "#9ca3af", p: 0.5 }}>
                <ArrowBack sx={{ fontSize: 18 }} />
              </IconButton>
              <Typography sx={{ color: "#6b7280", fontSize: "0.8rem" }}>
                Marketplace
              </Typography>
              <Typography sx={{ color: "#6b7280", fontSize: "0.8rem" }}>/</Typography>
              <Typography sx={{ color: "#e5e7eb", fontSize: "0.8rem", fontWeight: 600 }}>
                Land Detail
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ color: "#9ca3af", "&:hover": { color: "#e5e7eb" } }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* ── Title Row ── */}
          <Box
            sx={{
              px: 3,
              pt: 2.5,
              pb: 1.5,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#f0f4f0",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 1,
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                {ad.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16, color: "#84cc16" }} />
                  <Typography sx={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                    {locationStr}
                  </Typography>
                </Box>
                {ad.status === "ACTIVE" && (
                  <Chip
                    icon={<Verified sx={{ fontSize: "14px !important", color: "#84cc16 !important" }} />}
                    label="VERIFIED LAND"
                    size="small"
                    sx={{
                      bgcolor: "rgba(132,204,22,0.1)",
                      border: "1px solid rgba(132,204,22,0.35)",
                      color: "#84cc16",
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      letterSpacing: "0.06em",
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}>
              <Button
                variant="outlined"
                startIcon={<Download sx={{ fontSize: 16 }} />}
                sx={{
                  borderColor: "rgba(255,255,255,0.25)",
                  color: "#d1d5db",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  px: 2,
                  py: 0.8,
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.45)",
                    bgcolor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                Download Documentation
              </Button>
              <Button
                variant="contained"
                startIcon={<Handshake sx={{ fontSize: 16 }} />}
                onClick={() => onHire && onHire(ad)}
                sx={{
                  bgcolor: "#84cc16",
                  color: "#0a120c",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  px: 2.2,
                  py: 0.8,
                  "&:hover": {
                    bgcolor: "#a3e635",
                    boxShadow: "0 4px 16px rgba(132,204,22,0.4)",
                  },
                }}
              >
                Request Connection
              </Button>
            </Box>
          </Box>

          {/* ── Main Content: Image Left + Panel Right ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
              gap: 0,
              px: 3,
              pb: 3,
            }}
          >
            {/* LEFT: Image + Gallery + Narrative */}
            <Box sx={{ pr: { md: 3 } }}>
              {/* Main Image */}
              <Box
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  height: 310,
                  bgcolor: "#1a2a1a",
                  mb: 1.5,
                }}
              >
                {mainImg ? (
                  <Box
                    component="img"
                    src={mainImg}
                    alt={ad.title}
                    onError={() => setImgError(true)}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      background: "linear-gradient(135deg, #1a3320 0%, #2d5a3d 50%, #1e4028 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Landscape sx={{ fontSize: 80, color: "rgba(132,204,22,0.2)" }} />
                  </Box>
                )}
              </Box>

              {/* Thumbnail strip */}
              {images.length > 0 && (
                <Box sx={{ display: "flex", gap: 1, mb: 3, overflowX: "auto" }}>
                  {thumbImages.map((img, i) => (
                    <Box
                      key={i}
                      onClick={() => setMainImgIdx(i)}
                      sx={{
                        width: 80,
                        height: 60,
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
                        cursor: "pointer",
                        border: mainImgIdx === i
                          ? "2px solid #84cc16"
                          : "2px solid rgba(255,255,255,0.08)",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <Box
                        component="img"
                        src={img.url}
                        alt={`Photo ${i + 1}`}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                  ))}
                  {extraPhotos > 0 && (
                    <Box
                      sx={{
                        width: 80,
                        height: 60,
                        borderRadius: "8px",
                        flexShrink: 0,
                        bgcolor: "rgba(255,255,255,0.05)",
                        border: "2px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Typography sx={{ color: "#9ca3af", fontSize: "0.72rem", fontWeight: 700 }}>
                        +{extraPhotos} Photos
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Land Narrative */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#f0f4f0",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mb: 1.5,
                  }}
                >
                  LAND NARRATIVE
                </Typography>

                {/* Description text */}
                <Typography
                  sx={{ color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.7, mb: 2 }}
                >
                  {ad.additionalInfo ||
                    `This land parcel in ${locationStr} offers excellent agricultural potential. ${
                      ad.soilType ? `The soil is of ${ad.soilType} type, ideal for farming.` : ""
                    } ${
                      ad.waterAvailability
                        ? `Water availability includes ${ad.waterAvailability}.`
                        : ""
                    }`}
                </Typography>

                {/* Land History + Additional Info tags */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                  {ad.landHistory && (
                    <Box
                      sx={{
                        bgcolor: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        p: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#6b7280",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          mb: 0.5,
                        }}
                      >
                        LAND HISTORY
                      </Typography>
                      <Typography sx={{ color: "#84cc16", fontSize: "0.82rem", fontWeight: 600 }}>
                        {historyLabel || ad.landHistory}
                      </Typography>
                    </Box>
                  )}
                  {ad.additionalInfo && (
                    <Box
                      sx={{
                        bgcolor: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        p: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#6b7280",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          mb: 0.5,
                        }}
                      >
                        ADDITIONAL INFO
                      </Typography>
                      <Typography sx={{ color: "#e5e7eb", fontSize: "0.82rem", fontWeight: 600 }}>
                        {ad.additionalInfo}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* RIGHT: Investment Panel + Landowner + Map */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Monthly Investment Panel */}
              <Box
                sx={{
                  bgcolor: "#141e14",
                  border: "1px solid rgba(132,204,22,0.15)",
                  borderRadius: "12px",
                  p: 2.5,
                }}
              >
                <Typography sx={{ color: "#6b7280", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", mb: 0.8 }}>
                  MONTHLY INVESTMENT
                </Typography>
                <Typography sx={{ color: "#f0f4f0", fontSize: "1.8rem", fontWeight: 800, lineHeight: 1, mb: 0.4 }}>
                  {formatCurrency(ad.rentalAmount)}
                  <Typography component="span" sx={{ color: "#6b7280", fontSize: "0.9rem", fontWeight: 400 }}>
                    {" "}/ month
                  </Typography>
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                  {/* Land Area */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <Landscape sx={{ fontSize: 18, color: "#9ca3af" }} />
                    <Typography sx={{ color: "#9ca3af", fontSize: "0.82rem", flex: 1 }}>Land Area</Typography>
                    <Typography sx={{ color: "#f0f4f0", fontSize: "0.85rem", fontWeight: 700 }}>
                      {ad.landArea ? `${ad.landArea} Acres` : "—"}
                    </Typography>
                  </Box>

                  {/* Soil Type */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <Grain sx={{ fontSize: 18, color: "#9ca3af" }} />
                    <Typography sx={{ color: "#9ca3af", fontSize: "0.82rem", flex: 1 }}>Soil Type</Typography>
                    <Typography sx={{ color: soilColor, fontSize: "0.85rem", fontWeight: 700 }}>
                      {ad.soilType ? ad.soilType.charAt(0).toUpperCase() + ad.soilType.slice(1) : "—"}
                    </Typography>
                  </Box>

                  {/* Available From */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <CalendarToday sx={{ fontSize: 18, color: "#9ca3af" }} />
                    <Typography sx={{ color: "#9ca3af", fontSize: "0.82rem", flex: 1 }}>Available From</Typography>
                    <Typography sx={{ color: "#f0f4f0", fontSize: "0.85rem", fontWeight: 700 }}>
                      {formatDate(ad.availableFrom)}
                    </Typography>
                  </Box>

                  {/* Term End */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 0.8 }}>
                    <CalendarToday sx={{ fontSize: 18, color: "#9ca3af" }} />
                    <Typography sx={{ color: "#9ca3af", fontSize: "0.82rem", flex: 1 }}>Term End</Typography>
                    <Typography sx={{ color: "#f0f4f0", fontSize: "0.85rem", fontWeight: 700 }}>
                      {formatDate(ad.availableTo)}
                    </Typography>
                  </Box>

                  {/* Water/Irrigation */}
                  {ad.waterAvailability && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 0.8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <WaterDrop sx={{ fontSize: 18, color: "#06b6d4" }} />
                      <Typography sx={{ color: "#9ca3af", fontSize: "0.82rem", flex: 1 }}>Irrigation</Typography>
                      <Typography sx={{ color: "#f0f4f0", fontSize: "0.85rem", fontWeight: 700 }}>
                        {ad.waterAvailability}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* INITIATE AGREEMENT */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onHire && onHire(ad)}
                  sx={{
                    mt: 2.5,
                    bgcolor: "#3b82f6",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    letterSpacing: "0.1em",
                    borderRadius: "8px",
                    py: 1.2,
                    textTransform: "uppercase",
                    "&:hover": {
                      bgcolor: "#2563eb",
                      boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
                    },
                  }}
                >
                  INITIATE AGREEMENT
                </Button>
                <Typography sx={{ color: "#4b5563", fontSize: "0.62rem", textAlign: "center", mt: 0.8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  SUBJECT TO SOVEREIGN LEDGER VERIFICATION
                </Typography>
              </Box>

              {/* Landowner Profile */}
              <Box
                sx={{
                  bgcolor: "#141e14",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  p: 2,
                }}
              >
                <Typography sx={{ color: "#6b7280", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", mb: 1.5 }}>
                  LANDOWNER PROFILE
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Avatar
                    src={landowner.avatar ?? undefined}
                    sx={{
                      width: 44,
                      height: 44,
                      fontWeight: 800,
                      fontSize: "1rem",
                      bgcolor: "rgba(132,204,22,0.15)",
                      color: "#84cc16",
                      border: "2px solid rgba(132,204,22,0.3)",
                    }}
                  >
                    {landowner.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: "#f0f4f0", fontWeight: 700, fontSize: "0.9rem" }}>
                      {landowner.name}
                    </Typography>
                    {landowner.email && (
                      <Typography sx={{ color: "#6b7280", fontSize: "0.75rem" }}>
                        {landowner.email}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Message sx={{ fontSize: 14 }} />}
                    size="small"
                    sx={{
                      flex: 1,
                      borderColor: "rgba(255,255,255,0.2)",
                      color: "#d1d5db",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      borderRadius: "8px",
                      "&:hover": { borderColor: "rgba(255,255,255,0.4)", bgcolor: "rgba(255,255,255,0.04)" },
                    }}
                    onClick={() => landowner.email && window.open(`mailto:${landowner.email}`)}
                  >
                    Message
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Person sx={{ fontSize: 14 }} />}
                    size="small"
                    sx={{
                      flex: 1,
                      borderColor: "rgba(255,255,255,0.2)",
                      color: "#d1d5db",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      borderRadius: "8px",
                      "&:hover": { borderColor: "rgba(255,255,255,0.4)", bgcolor: "rgba(255,255,255,0.04)" },
                    }}
                  >
                    Profile
                  </Button>
                </Box>
              </Box>

              {/* Regional Location / Map */}
              {coords && (
                <Box
                  sx={{
                    bgcolor: "#141e14",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ px: 2, pt: 1.5, pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ color: "#6b7280", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      REGIONAL LOCATION
                    </Typography>
                    <Typography sx={{ color: "#4b5563", fontSize: "0.65rem" }}>
                      {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
                    </Typography>
                  </Box>
                  <Box
                    component="iframe"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.05},${coords.lat - 0.05},${coords.lng + 0.05},${coords.lat + 0.05}&layer=mapnik&marker=${coords.lat},${coords.lng}`}
                    sx={{
                      width: "100%",
                      height: 200,
                      border: "none",
                      display: "block",
                      filter: "invert(0.85) hue-rotate(180deg) brightness(0.85) contrast(0.9)",
                    }}
                    title="Land Location Map"
                    loading="lazy"
                  />
                </Box>
              )}

              {!coords && (
                <Box
                  sx={{
                    bgcolor: "#141e14",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    p: 2,
                  }}
                >
                  <Typography sx={{ color: "#6b7280", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", mb: 1 }}>
                    REGIONAL LOCATION
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 14, color: "#84cc16" }} />
                    <Typography sx={{ color: "#9ca3af", fontSize: "0.82rem" }}>
                      {locationStr}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <Mail sx={{ fontSize: 14, color: "#6b7280" }} />
                    <Typography sx={{ color: "#4b5563", fontSize: "0.72rem" }}>
                      Coordinates unavailable
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LandAdDetailDialog;
