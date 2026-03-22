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
