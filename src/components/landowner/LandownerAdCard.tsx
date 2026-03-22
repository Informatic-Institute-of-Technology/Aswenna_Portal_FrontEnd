import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { LocationOn, Terrain, Payments } from "@mui/icons-material";
import type { LandownerAdApiItem } from "../../services/landownerAds.service";

interface LandownerAdCardProps {
  ad: LandownerAdApiItem;
  onViewMore: (ad: LandownerAdApiItem) => void;
}

const LandownerAdCard = ({ ad, onViewMore }: LandownerAdCardProps) => {
  const imageUrl =
    ad.images && ad.images.length > 0
      ? ad.images[0].url
      : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500";

  const location =
    typeof ad.location === "object"
      ? (ad.location?.district && ad.location?.province)
        ? `${ad.location.district}, ${ad.location.province}`
        : ad.location?.latitude && ad.location?.longitude
        ? `Lat: ${ad.location.latitude.toFixed(4)}, Lng: ${ad.location.longitude.toFixed(4)}`
        : "Location not specified"
      : ad.location || "Location not specified";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "var(--surface-base)",
        border: "1px solid var(--border-base)",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 28px rgba(0, 0, 0, 0.15)",
          borderColor: "primary.main",
        },
      }}
    >  </Card>