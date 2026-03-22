import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import LandownerAdCard from "../../components/common/LandownerAdCard";
import {
  getLandownerAds,
  type LandownerAdApiItem,
} from "../../services/landownerAds.service";
import Notification from "../../shared/components/Notification";

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

  const handleViewMore = (ad: LandownerAdApiItem) => {
    setSelectedAd(ad);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedAd(null);
  };

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

    {/* Results Count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Found {filteredAds.length} land listing{filteredAds.length !== 1 ? "s" : ""}
        </Typography>

        {/* Land Cards Grid */}
        {filteredAds.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: 3,
            }}
          >
            {filteredAds.map((ad) => (
              <LandownerAdCard key={ad._id} ad={ad} onViewMore={handleViewMore} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "var(--surface-tint)",
              borderRadius: 2,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6" gutterBottom>
              No land available matching your search
            </Typography>
            <Typography variant="body2">
              Try adjusting your search criteria
            </Typography>
          </Box>
        )}
    </Box>

    {/* Land Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          {selectedAd?.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedAd && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Land Image */}
              {selectedAd.images && selectedAd.images.length > 0 && (
                <Box
                  component="img"
                  src={selectedAd.images[0].url}
                  alt={selectedAd.title}
                  sx={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              )}
