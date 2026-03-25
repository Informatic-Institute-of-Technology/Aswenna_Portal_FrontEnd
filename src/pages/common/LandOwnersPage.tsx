import { Box, CircularProgress, Typography } from "@mui/material";
import { Landscape } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { SectionHeader } from "../../components/common";
import LandAdCard from "../../components/investor/LandAdCard";
import LandAdDetailDialog from "../../components/investor/LandAdDetailDialog";
import { getLandownerAds, type LandownerAdApiItem } from "../../services/landownerAds.service";
import Notification from "../../shared/components/Notification";

const LandOwnersPage = () => {
  const [landAds, setLandAds] = useState<LandownerAdApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAd, setSelectedAd] = useState<LandownerAdApiItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getLandownerAds();
        if (mounted) {
          const ads = (res.data ?? []).filter((ad) => ad.status === "ACTIVE");
          setLandAds(ads);
        }
      } catch {
        if (mounted) setError("Failed to load land listings. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleViewDetails = (ad: LandownerAdApiItem) => {
    setSelectedAd(ad);
    setDetailOpen(true);
  };

  const handleClose = () => {
    setDetailOpen(false);
    setSelectedAd(null);
  };

  const handleHire = (ad: LandownerAdApiItem) => {
    setDetailOpen(false);
    setSelectedAd(null);
    const ownerName =
      ad.landowner && typeof ad.landowner === "object" && (ad.landowner as any).fullName
        ? (ad.landowner as any).fullName
        : "Landowner";
    setNotification({
      open: true,
      message: `Hire request sent to ${ownerName} for "${ad.title}"`,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Land Search
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse and rent verified agricultural land from landowners across Sri Lanka
        </Typography>
      </Box>

      <SectionHeader
        title={`Available Land Listings${landAds.length > 0 ? ` (${landAds.length})` : ""}`}
        description="Explore active land ads, view soil types, rental prices and availability – then hire directly"
        accentColor="var(--color-brand-accent)"
        showLeftBorder={true}
      />

      {loading ? (
        <Box sx={{ textAlign: "center", py: 12 }}>
          <CircularProgress size={44} sx={{ color: "var(--color-brand-accent)" }} />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Loading land listings…
          </Typography>
        </Box>
      ) : error ? (
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
            Couldn&apos;t load land listings
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Box>
      ) : landAds.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 3,
          }}
        >
          {landAds.map((ad) => (
            <LandAdCard key={ad._id} ad={ad} onViewDetails={handleViewDetails} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            bgcolor: "var(--surface-tint)",
            borderRadius: 3,
            border: "1px dashed rgba(132,204,22,0.2)",
          }}
        >
          <Landscape sx={{ fontSize: 64, color: "rgba(132,204,22,0.3)", mb: 1.5 }} />
          <Typography variant="h6" gutterBottom sx={{ color: "var(--text-primary)" }}>
            No land listings available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for new agricultural land rental opportunities
          </Typography>
        </Box>
      )}

      <LandAdDetailDialog
        open={detailOpen}
        onClose={handleClose}
        ad={selectedAd}
        onHire={handleHire}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity="success"
        duration={5000}
        onClose={() => setNotification((p) => ({ ...p, open: false }))}
      />
    </Box>
  );
};

export default LandOwnersPage;
