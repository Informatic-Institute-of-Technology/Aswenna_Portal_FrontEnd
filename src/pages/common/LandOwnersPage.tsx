// const LandOwnersPage = () => {
//   return (
//     <>
//       <div className="widget-card">
//         <div className="widget-card-header">
//           <h2 className="widget-card-title">Land Owners</h2>
//         </div>
//         <div className="widget-card-content">
//           <p>Search land listings and request access or partnership.</p>
//           <div className="chart-placeholder" style={{ marginTop: "2rem" }}>
//              Browse available land with filters
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LandOwnersPage;


import {
  Box,
  Chip,
  CircularProgress,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import {
  getLandownerAds,
  type LandownerAdApiItem,
} from "../../services/landownerAds.service";
import Notification from "../../shared/components/Notification";
import LandownerAdCard from "../../components/common/LandownerAdCard";

const LandOwnersPage = () => {
  const [landownerAds, setLandownerAds] = useState<LandownerAdApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAd, setSelectedAd] = useState<LandownerAdApiItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

   useEffect(() => {
    const loadLandownerAds = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getLandownerAds();
        setLandownerAds(response.data ?? []);
      } catch {
        setError("Failed to load land ads. Please try again.");
        setLandownerAds([]);
      } finally {
        setLoading(false);
      }
    };

    loadLandownerAds();
  }, []);

  const filteredAds = useMemo(() => {
    if (!searchQuery.trim()) return landownerAds;

    const query = searchQuery.toLowerCase();
    return landownerAds.filter(
      (ad) =>
        ad.title.toLowerCase().includes(query) ||
        (typeof ad.location === "string"
          ? ad.location.toLowerCase().includes(query)
          : `${(ad.location as Record<string, unknown>)?.district || ""} ${(ad.location as Record<string, unknown>)?.province || ""}`
              .toLowerCase()
              .includes(query)) ||
        ad.soilType?.toLowerCase().includes(query) ||
        (typeof ad.landowner === "object"
          ? ad.landowner?.fullName?.toLowerCase().includes(query)
          : false),
    );
  }, [landownerAds, searchQuery]);

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          bgcolor: "var(--surface-base)",
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading available land...
          </Typography>
        </Box>
      </Box>
    );
  }
   return (
    <>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Available Land for Rent
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Search and connect with landowners offering agricultural land rental opportunities
          </Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by location, soil type, landowner name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              bgcolor: "var(--surface-base)",
              "& .MuiOutlinedInput-root": {
                color: "text.primary",
              },
            }}
          />
        </Box>
