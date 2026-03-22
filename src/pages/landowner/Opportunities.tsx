import type { AlertColor } from "@mui/material";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  CircularProgress
} from "@mui/material";
import {
  Agriculture,
  MonetizationOn,
  ScaleOutlined,
  CalendarToday,
  LocationOn,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import Notification from "../../shared/components/Notification";
import coverImagesData from "../../data/json/coverImages.json";
import type { LandownerAdApiItem } from "../../services/landownerAds.service";
import { httpClient } from "../../services/httpClient";
import { useAuth } from "../../Context/useAuth";

const coverImageMap = Object.fromEntries(
  (coverImagesData as { id: string; url: string }[]).map((img) => [
    img.id,
    img.url,
  ]),
);

const resolveBgUrl = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  if (value.startsWith("http") || value.startsWith("data:")) return value;
  return coverImageMap[value];
};

interface HarvestOffer {
  _id: string;
  investor?: {
    _id: string;
    fullName: string;
    email: string;
  };
  description?: string;
  expiredDate?: string;
  cropIcon?: string;
  backgroundImage?: string;
  expectedROI?: number;
  harvestBaseDetails?: {
    projectTitle?: string;
    cropType?: string;
    projectDuration?: number;
    durationUnit?: string;
    totalBudget?: number;
    deliveryLocation?: string;
    companyName?: string;
    requiredQuantity?: number;
    quantityUnit?: string;
    pricePerUnit?: number;
  };
  currency: string;
  status: string;
}

const formatCurrency = (amount: number, currency: string = "LKR") =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ReceivedRequestsPage = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<HarvestOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedOfferForMatch, setSelectedOfferForMatch] = useState<HarvestOffer | null>(null);
  const [landownerOffers, setLandownerOffers] = useState<LandownerAdApiItem[]>([]);
  const [selectedLandOffer, setSelectedLandOffer] = useState<string | null>(null);
  const [loadingOffers, setLoadingOffers] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        // Fetch with type=direct-harvest to get harvest opportunities using httpClient with auth headers
        const result = await httpClient.get<{
          success?: boolean;
          data?: HarvestOffer[];
          message?: string;
        }>("/v1/investor-offer?type=direct-harvest&page=1&limit=10");
        
        if (result && result.data && Array.isArray(result.data)) {
          const activeOffers = (result.data as HarvestOffer[]).filter(
            (o: any) => o.harvestBaseDetails
          );
          setOffers(activeOffers);
        } else {
          console.warn("Unexpected API response structure", result);
        }
      } catch (err) {
        console.error('Failed to fetch investor harvest offers', err);
        setNotification({
          open: true,
          message: 'Failed to load investment opportunities. Please check your connection and try again.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchOffers();
  }, []);

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleInterestedClick = async (offer: HarvestOffer) => {
    setSelectedOfferForMatch(offer);
    setSelectedLandOffer(null);
    setLoadingOffers(true);
    try {
      if (!user?._id) {
        throw new Error('User ID not available');
      }
      // Fetch only the current landowner's ads using their ID
      const response = await httpClient.get<{
        success?: boolean;
        data?: LandownerAdApiItem[];
        message?: string;
      }>(`/v1/land-owner/ads/${user._id}`);
      
      const adsData = response.data || [];
      setLandownerOffers(Array.isArray(adsData) ? adsData : [adsData]);
    } catch (err) {
      console.error('Failed to fetch landowner ads', err);
      setNotification({
        open: true,
        message: 'Failed to load your land offers',
        severity: 'error',
      });
      setLoadingOffers(false);
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleConfirmMatch = async () => {
    if (!selectedOfferForMatch || !selectedLandOffer) {
      setNotification({
        open: true,
        message: 'Please select a land offer',
        severity: 'warning',
      });
      return;
    }

    const matchedLandOffer = landownerOffers.find(ad => ad._id === selectedLandOffer);
    const harvestTitle = selectedOfferForMatch.harvestBaseDetails?.projectTitle || "Harvest Offer";
    const landTitle = matchedLandOffer?.title || "Land Offer";

    setNotification({
      open: true,
      message: `Successfully matched "${harvestTitle}" with "${landTitle}"!`,
      severity: 'success',
    });

    setSelectedOfferForMatch(null);
    setSelectedLandOffer(null);
  };

  const handleCloseDialog = () => {
    setSelectedOfferForMatch(null);
    setSelectedLandOffer(null);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Opportunities
          </Typography>
        </Box>

        {/* Active Investment Opportunities */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Investment Opportunities ({offers.length})
          </Typography>

          {loading ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
              Loading opportunities...
            </Typography>
          ) : offers.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: 3,
              }}
            >
              {offers.map((offer) => {
                const hd = offer.harvestBaseDetails;
                const title = hd?.projectTitle || "Harvest Opportunity";
                const bgUrl = resolveBgUrl(offer.backgroundImage);
                const deadline = offer.expiredDate;
                const regions = hd?.deliveryLocation ? [hd.deliveryLocation] : [];

                return (
                  <Card
                    key={offer._id}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: 160,
                        background: bgUrl
                          ? `url(${bgUrl}) center/cover`
                          : "linear-gradient(135deg, var(--color-olive) 0%, var(--color-olive-light) 100%)",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
                        }}
                      />

                      <Box
                        sx={{
                          position: "relative",
                          zIndex: 2,
                          p: 2,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                          <Chip
                            label="Harvest Offer"
                            size="small"
                            sx={{
                              background: "rgba(76,175,80,0.85)",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "0.68rem",
                              letterSpacing: 0.3,
                              backdropFilter: "blur(10px)",
                            }}
                          />
                          <Chip
                            label={offer.status === "pending" ? "Open" : "Active"}
                            size="small"
                            sx={{
                              background: offer.status === "pending" ? "rgba(255,152,0,0.85)" : "rgba(33,150,243,0.85)",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "0.68rem",
                              backdropFilter: "blur(10px)",
                            }}
                          />
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              background: "var(--surface-light)",
                              backdropFilter: "blur(10px)",
                              borderRadius: 1.5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.5rem",
                              flexShrink: 0,
                            }}
                          >
                            {offer.cropIcon || "🌾"}
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: "#fff",
                                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                                fontSize: "1.05rem",
                                lineHeight: 1.2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.75rem" }}
                            >
                              {hd?.cropType || "Agriculture"} • By {offer.investor?.fullName || hd?.companyName || "Investor"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 1.5,
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                          <MonetizationOn sx={{ fontSize: 16, color: "success.main", mt: 0.2 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Total Budget
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
                              {formatCurrency(hd?.totalBudget ?? 0, offer.currency)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                          <ScaleOutlined sx={{ fontSize: 16, color: "primary.main", mt: 0.2 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Quantity Needed
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
                              {hd?.requiredQuantity} {hd?.quantityUnit}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                          <MonetizationOn sx={{ fontSize: 16, color: "warning.main", mt: 0.2 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Price / Unit
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
                              {formatCurrency(hd?.pricePerUnit ?? 0, offer.currency)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                          <Agriculture sx={{ fontSize: 16, color: "info.main", mt: 0.2 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Scale
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "capitalize", color: "text.primary" }}>
                              {hd?.durationUnit ? `${hd.projectDuration} ${hd.durationUnit}` : "Standard"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 1.5 }} />

                      <Box sx={{ flexGrow: 1 }} />
                      
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        {regions.length > 0 && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <LocationOn sx={{ fontSize: 14, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                              {regions[0]}
                            </Typography>
                          </Box>
                        )}
                        {deadline && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 13, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                              Due {formatDate(deadline)}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          onClick={() => {
                            setNotification({
                              open: true,
                              message: `Viewing details for ${title}`,
                              severity: "info",
                            });
                          }}
                          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                        >
                          Details
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          onClick={() => handleInterestedClick(offer)}
                          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                        >
                          Interested
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
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
                No active opportunities at the moment
              </Typography>
              <Typography variant="body2">
                Check back soon for new investor opportunities or publish your land ad to attract investors.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        duration={4000}
        onClose={handleCloseNotification}
      />

      <Dialog 
        open={!!selectedOfferForMatch} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
          Match with Your Land
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedOfferForMatch && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Selected Investor Offer:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "primary.main" }}>
                {selectedOfferForMatch.harvestBaseDetails?.projectTitle} 
                ({selectedOfferForMatch.harvestBaseDetails?.cropType})
              </Typography>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select one of your land offers to match:
          </Typography>

          {loadingOffers ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={32} />
            </Box>
          ) : landownerOffers.length > 0 ? (
            <List sx={{ maxHeight: 300, overflow: "auto", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              {landownerOffers.map((landOffer) => (
                <ListItemButton
                  key={landOffer._id}
                  selected={selectedLandOffer === landOffer._id}
                  onClick={() => setSelectedLandOffer(landOffer._id)}
                  sx={{
                    py: 1.5,
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
                    },
                  }}
                >
                  <Radio
                    edge="start"
                    checked={selectedLandOffer === landOffer._id}
                    tabIndex={-1}
                    disableRipple
                    sx={{ mr: 1 }}
                  />
                  <ListItemText
                    primary={landOffer.title}
                    secondary={`${landOffer.landArea} ${typeof landOffer.landArea === "number" ? "acres" : ""} • ${
                      typeof landOffer.location === "string" 
                        ? landOffer.location 
                        : (landOffer.location as any)?.district || "Location"
                    }`}
                  />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: "center", bgcolor: "var(--surface-tint)", borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No land offers available. Please create a land ad first.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmMatch}
            variant="contained"
            disabled={!selectedLandOffer || loadingOffers}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Confirm Match
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceivedRequestsPage;
