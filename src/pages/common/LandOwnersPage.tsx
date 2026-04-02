import {
  Bookmark,
  Clear,
  ExpandMore,
  Landscape,
  Map as MapIcon,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SriLankaMap from "../../components/SriLankaMap";
import LandAdCard from "../../components/investor/LandAdCard";
import LandAdDetailDialog from "../../components/investor/LandAdDetailDialog";
import {
  getLandownerAds,
  type LandownerAdApiItem,
  type LandownerInfo,
  type LocationData,
} from "../../services/landownerAds.service";
import Notification from "../../shared/components/Notification";

const getProvinceFromAd = (ad: LandownerAdApiItem): string => {
  if (!ad.location) return "All Regions";
  if (typeof ad.location === "string") return ad.location;
  const loc = ad.location as LocationData;
  return loc.province || loc.district || "All Regions";
};

const getRentalNumber = (amount?: string | number): number =>
  typeof amount === "string" ? parseFloat(amount) || 0 : (amount ?? 0);

const ITEMS_PER_PAGE = 6;

const AREA_OPTIONS = [
  { label: "Any Size", min: 0, max: Infinity },
  { label: "0 – 5 Acres", min: 0, max: 5 },
  { label: "5 – 15 Acres", min: 5, max: 15 },
  { label: "15 – 30 Acres", min: 15, max: 30 },
  { label: "30+ Acres", min: 30, max: Infinity },
];

const PRICE_OPTIONS = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Up to 50,000", min: 0, max: 50000 },
  { label: "50,000 – 100,000", min: 50000, max: 100000 },
  { label: "100,000 – 200,000", min: 100000, max: 200000 },
  { label: "200,000+", min: 200000, max: Infinity },
];

const LandOwnersPage = () => {
  const [allAds, setAllAds] = useState<LandownerAdApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<LandownerAdApiItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const [locationFilter, setLocationFilter] = useState("All Regions");
  const [areaFilter, setAreaFilter] = useState("Any Size");
  const [priceFilter, setPriceFilter] = useState("All Prices");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getLandownerAds();
        if (mounted) {
          setAllAds(res.data ?? []);
        }
      } catch {
        if (mounted)
          setError("Failed to load land listings. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const regionOptions = useMemo(() => {
    const regions = new Set<string>();
    allAds.forEach((ad) => {
      const r = getProvinceFromAd(ad);
      if (r && r !== "All Regions") regions.add(r);
    });
    return ["All Regions", ...Array.from(regions).sort()];
  }, [allAds]);

  const filteredAds = useMemo(() => {
    const areaOpt =
      AREA_OPTIONS.find((o) => o.label === areaFilter) ?? AREA_OPTIONS[0];
    const priceOpt =
      PRICE_OPTIONS.find((o) => o.label === priceFilter) ?? PRICE_OPTIONS[0];

    return allAds.filter((ad) => {
      if (
        locationFilter !== "All Regions" &&
        getProvinceFromAd(ad) !== locationFilter
      )
        return false;
      const area =
        typeof ad.landArea === "string"
          ? parseFloat(ad.landArea)
          : (ad.landArea ?? 0);
      if (area < areaOpt.min || area > areaOpt.max) return false;
      const rental = getRentalNumber(ad.rentalAmount);
      if (rental < priceOpt.min || rental > priceOpt.max) return false;
      return true;
    });
  }, [allAds, locationFilter, areaFilter, priceFilter]);

  useEffect(() => setPage(1), [locationFilter, areaFilter, priceFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAds.length / ITEMS_PER_PAGE),
  );
  const pageAds = filteredAds.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleClear = () => {
    setLocationFilter("All Regions");
    setAreaFilter("Any Size");
    setPriceFilter("All Prices");
    setPage(1);
  };

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
      ad.landowner &&
      typeof ad.landowner === "object" &&
      "fullName" in ad.landowner
        ? (ad.landowner as LandownerInfo).fullName || "Landowner"
        : "Landowner";
    setNotification({
      open: true,
      message: `Connection request sent to ${ownerName} for "${ad.title}"`,
    });
  };

  const pageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const selectSx = {
    bgcolor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    color: "#d1d5db",
    fontSize: "0.82rem",
    height: 38,
    minWidth: 160,
    ".MuiOutlinedInput-notchedOutline": { border: "none" },
    ".MuiSelect-icon": { color: "#9ca3af" },
    "&:hover": { bgcolor: "rgba(255,255,255,0.07)" },
  };

  return (
    <Box sx={{ p: 3, bgcolor: "transparent", minHeight: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            color: "#85a446",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            mb: 0.5,
          }}
        >
          MARKETPLACE HUB
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: { md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 1.5,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "#f0f4f0",
                fontWeight: 800,
                fontSize: { xs: "1.6rem", md: "2rem" },
              }}
            >
              Available Land Opportunities
            </Typography>
            <Typography
              sx={{ color: "#6b7280", fontSize: "0.875rem", mt: 0.5 }}
            >
              Browse and secure verified agricultural land plots with real-time
              soil analysis and historical yield data.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}>
            <Button
              variant="outlined"
              startIcon={<Bookmark sx={{ fontSize: 16 }} />}
              sx={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "#d1d5db",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.8rem",
                px: 2,
                py: 0.8,
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.35)",
                  bgcolor: "rgba(255,255,255,0.04)",
                },
              }}
            >
              Saved Searches
            </Button>
            <Button
              variant="contained"
              startIcon={<MapIcon sx={{ fontSize: 16 }} />}
              onClick={() => setMapOpen(true)}
              sx={{
                bgcolor: "#3b82f6",
                color: "#fff",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.8rem",
                px: 2,
                py: 0.8,
                "&:hover": {
                  bgcolor: "#2563eb",
                  boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
                },
              }}
            >
              View Map
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            bgcolor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "10px",
            p: 1.5,
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
                mb: 0.5,
              }}
            >
              LOCATION
            </Typography>
            <FormControl size="small">
              <Select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                sx={selectSx}
                IconComponent={ExpandMore}
              >
                {regionOptions.map((r) => (
                  <MenuItem key={r} value={r} sx={{ fontSize: "0.82rem" }}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              AREA RANGE (ACRES)
            </Typography>
            <FormControl size="small">
              <Select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                sx={selectSx}
                IconComponent={ExpandMore}
              >
                {AREA_OPTIONS.map((o) => (
                  <MenuItem
                    key={o.label}
                    value={o.label}
                    sx={{ fontSize: "0.82rem" }}
                  >
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              PRICE RANGE (MONTHLY)
            </Typography>
            <FormControl size="small">
              <Select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                sx={selectSx}
                IconComponent={ExpandMore}
              >
                {PRICE_OPTIONS.map((o) => (
                  <MenuItem
                    key={o.label}
                    value={o.label}
                    sx={{ fontSize: "0.82rem" }}
                  >
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: { xs: 0, sm: 2.5 } }}>
            <Button
              onClick={handleClear}
              startIcon={<Clear sx={{ fontSize: 15 }} />}
              sx={{
                color: "#9ca3af",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.8rem",
                borderRadius: "8px",
                px: 1.5,
                py: 0.8,
                "&:hover": {
                  color: "#e5e7eb",
                  bgcolor: "rgba(255,255,255,0.04)",
                },
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 12 }}>
          <CircularProgress size={44} sx={{ color: "#85a446" }} />
          <Typography variant="body2" sx={{ mt: 2, color: "#6b7280" }}>
            Loading land listings…
          </Typography>
        </Box>
      ) : error ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "rgba(255,255,255,0.02)",
            borderRadius: 2,
            color: "#6b7280",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: "#e5e7eb" }}>
            Couldn&apos;t load land listings
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Box>
      ) : pageAds.length > 0 ? (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 2.5,
              mb: 4,
            }}
          >
            {pageAds.map((ad) => (
              <LandAdCard
                key={ad._id}
                ad={ad}
                onViewDetails={handleViewDetails}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              pt: 2,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Typography sx={{ color: "#6b7280", fontSize: "0.8rem" }}>
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(page * ITEMS_PER_PAGE, filteredAds.length)} of{" "}
              {filteredAds.length} available properties
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <Box
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                sx={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: page === 1 ? "#374151" : "#9ca3af",
                  cursor: page === 1 ? "default" : "pointer",
                  fontSize: "0.85rem",
                  "&:hover":
                    page > 1
                      ? { bgcolor: "rgba(255,255,255,0.06)", color: "#e5e7eb" }
                      : {},
                }}
              >
                ‹
              </Box>

              {pageNumbers().map((n, i) =>
                n === "..." ? (
                  <Typography
                    key={`ellipsis-${i}`}
                    sx={{ color: "#6b7280", px: 0.5, fontSize: "0.82rem" }}
                  >
                    ...
                  </Typography>
                ) : (
                  <Box
                    key={n}
                    onClick={() => setPage(n as number)}
                    sx={{
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      border:
                        page === n
                          ? "1px solid #85a446"
                          : "1px solid rgba(255,255,255,0.1)",
                      bgcolor: page === n ? "#85a446" : "transparent",
                      color: page === n ? "#0a120c" : "#9ca3af",
                      cursor: "pointer",
                      fontWeight: page === n ? 700 : 400,
                      fontSize: "0.82rem",
                      transition: "all 0.15s ease",
                      "&:hover":
                        page !== n
                          ? {
                              bgcolor: "rgba(255,255,255,0.06)",
                              color: "#e5e7eb",
                            }
                          : {},
                    }}
                  >
                    {n}
                  </Box>
                ),
              )}

              <Box
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                sx={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: page === totalPages ? "#374151" : "#9ca3af",
                  cursor: page === totalPages ? "default" : "pointer",
                  fontSize: "0.85rem",
                  "&:hover":
                    page < totalPages
                      ? { bgcolor: "rgba(255,255,255,0.06)", color: "#e5e7eb" }
                      : {},
                }}
              >
                ›
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            bgcolor: "rgba(255,255,255,0.02)",
            borderRadius: 3,
            border: "1px dashed rgba(133, 164, 70,0.15)",
          }}
        >
          <Landscape
            sx={{ fontSize: 64, color: "rgba(133, 164, 70,0.2)", mb: 1.5 }}
          />
          <Typography variant="h6" gutterBottom sx={{ color: "#e5e7eb" }}>
            No land listings match your filters
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
            Try adjusting your location, area, or price filters
          </Typography>
          <Button
            onClick={handleClear}
            sx={{
              color: "#85a446",
              border: "1px solid rgba(133, 164, 70,0.3)",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 0.9,
              "&:hover": { bgcolor: "rgba(133, 164, 70,0.08)" },
            }}
          >
            Clear Filters
          </Button>
        </Box>
      )}

      <Dialog
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            bgcolor: "#0b120d",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            py: 1.5,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
              All Land Ads - Sri Lanka Map
            </Typography>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.8rem", mt: 0.3 }}>
              Google map view for all land ads with Land Ad IDs on each marker
            </Typography>
          </Box>
          <IconButton
            onClick={() => setMapOpen(false)}
            sx={{ color: "#9ca3af" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          {allAds.length > 0 ? (
            <SriLankaMap landAds={allAds} />
          ) : (
            <Box
              sx={{
                minHeight: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#9ca3af",
              }}
            >
              <Typography variant="body2">
                No land ads available to display on map.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

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
