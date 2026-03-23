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

     <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(4px)",
          color: "white",
          px: 2,
          py: 0.75,
          borderRadius: 2,
          fontWeight: 700,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      ></Box>

       <Payments sx={{ fontSize: 18, color: "primary.light" }} />
        ₨{(ad.rentalAmount as unknown as number).toLocaleString()}/mo
      </Box>

      {/* Land Image */}
      <Box sx={{ overflow: "hidden", height: 200, position: "relative" }}>
        <CardMedia
          component="img"
          height="100%"
          image={imageUrl}
          alt={ad.title}
          sx={{
            objectFit: "cover",
            transition: "transform 0.5s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
        {/* Subtle gradient overlay at bottom of image for contrast */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
          }}
        />
      </Box>
    
     <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 3 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ad.title}
        </Typography>

        {/* Location */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
          <LocationOn sx={{ fontSize: 20, color: "primary.main", mt: "-2px" }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {location}
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: "var(--border-subtle)" }} />

        {/* Key Details */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                opacity: 0.9,
              }}
            >
              <Terrain sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Land Area
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {ad.landArea} acres
              </Typography>
            </Box>
          </Box>
          
          {/* Optional Soil Type if you want to highlight it */}
          {ad.soilType && (
            <Chip
              label={ad.soilType}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, borderColor: "var(--border-base)" }}
            />
          )}
        </Box>

        {/* Push button to bottom if content varied */}
        <Box sx={{ flexGrow: 1 }} />
      </CardContent>

      {/* View More Button */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onViewMore(ad)}
          sx={{
            fontWeight: 600,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          View Full Details
        </Button>
      </Box>
    </Card>
  );
};

export default LandownerAdCard;



