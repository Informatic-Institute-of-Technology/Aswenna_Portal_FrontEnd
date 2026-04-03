import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import {
  Box,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getLandownerAdById, type LandownerAdApiItem } from "../../services";

interface LandAdDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  adId?: string;
  defaultImage: string;
}

const DEFAULT_LAND_IMAGE =
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80";

const LandAdDetailsDialog = ({
  open,
  onClose,
  adId,
  defaultImage = DEFAULT_LAND_IMAGE,
}: LandAdDetailsDialogProps) => {
  const [dialogImageIndex, setDialogImageIndex] = useState(0);
  const [detailedAd, setDetailedAd] = useState<LandownerAdApiItem | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !adId) return;

    const fetchDetails = async () => {
      setIsLoadingDetails(true);
      setLoadError(null);
      setDialogImageIndex(0);
      try {
        const response = await getLandownerAdById(adId);
        setDetailedAd(response);
      } catch (error) {
        console.error("Error loading ad details:", error);
        setLoadError(
          error instanceof Error ? error.message : "Failed to load ad details",
        );
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [open, adId]);

  useEffect(() => {
    if (!open || !detailedAd?.images || detailedAd.images.length <= 1) return;

    const timer = setInterval(() => {
      setDialogImageIndex((prev) =>
        prev === detailedAd.images!.length - 1 ? 0 : prev + 1,
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [open, detailedAd?.images]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Flexible";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatRentalAmount = (value: string) => {
    if (!value) return "LKR 0";
    if (value.toLowerCase().includes("lkr")) return value;
    const numericValue = Number(value.replace(/,/g, ""));
    if (!Number.isNaN(numericValue)) {
      return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue);
    }
    return `LKR ${value}`;
  };

  const handleClose = () => {
    setDetailedAd(null);
    setDialogImageIndex(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "var(--bg-overlay)",
          backgroundImage:
            "linear-gradient(145deg, var(--bg-subtle) 0%, var(--bg-overlay) 100%)",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: "white",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {detailedAd?.title || "Land Advertisement"}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Detailed Land Advertisement Information
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {detailedAd?.status && (
            <Chip
              label={detailedAd.status}
              color={
                detailedAd.status === "ACTIVE"
                  ? "success"
                  : detailedAd.status === "PENDING"
                    ? "warning"
                    : "default"
              }
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
          <IconButton
            onClick={handleClose}
            sx={{
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            size="small"
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 3,
          color: "text.primary",
          overflow: "auto",
          maxHeight: "calc(90vh - 140px)",
        }}
      >
        {isLoadingDetails ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">
              Loading ad details...
            </Typography>
          </Box>
        ) : loadError ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="error">{loadError}</Typography>
          </Box>
        ) : !detailedAd ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">No data available</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            <Box>
              {detailedAd.images && detailedAd.images.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      position: "relative",
                      height: 300,
                      borderRadius: 2,
                      overflow: "hidden",
                      mb: 2,
                      border: "2px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        height: "100%",
                        transition: "transform 0.5s ease-in-out",
                        transform: `translateX(-${dialogImageIndex * 100}%)`,
                      }}
                    >
                      {detailedAd.images.map((img, idx) => (
                        <CardMedia
                          key={idx}
                          component="img"
                          image={img.url || defaultImage}
                          alt={`${detailedAd.title} - ${idx + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ))}
                    </Box>

                    {detailedAd.images.length > 1 && (
                      <>
                        <IconButton
                          onClick={() => {
                            setDialogImageIndex((prev) =>
                              prev === 0
                                ? detailedAd.images!.length - 1
                                : prev - 1,
                            );
                          }}
                          sx={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 5,
                            color: "white",
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                            },
                          }}
                          size="medium"
                        >
                          <ChevronLeft />
                        </IconButton>

                        <IconButton
                          onClick={() => {
                            setDialogImageIndex((prev) =>
                              prev === detailedAd.images!.length - 1
                                ? 0
                                : prev + 1,
                            );
                          }}
                          sx={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 5,
                            color: "white",
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                            },
                          }}
                          size="medium"
                        >
                          <ChevronRight />
                        </IconButton>

                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 12,
                            right: 12,
                            zIndex: 5,
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            color: "white",
                            px: 2,
                            py: 0.75,
                            borderRadius: "16px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          {dialogImageIndex + 1} / {detailedAd.images.length}
                        </Box>

                        <Stack
                          direction="row"
                          spacing={0.75}
                          sx={{
                            position: "absolute",
                            bottom: 12,
                            left: 12,
                            zIndex: 5,
                          }}
                        >
                          {detailedAd.images.map((_, index) => (
                            <Box
                              key={index}
                              onClick={() => setDialogImageIndex(index)}
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor:
                                  index === dialogImageIndex
                                    ? "white"
                                    : "rgba(255, 255, 255, 0.4)",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "white",
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      </>
                    )}
                  </Box>

                  {detailedAd.images.length > 1 && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ overflowX: "auto", pb: 1 }}
                    >
                      {detailedAd.images.map((image, index) => (
                        <Box
                          key={index}
                          onClick={() => setDialogImageIndex(index)}
                          sx={{
                            minWidth: 70,
                            height: 70,
                            borderRadius: 1,
                            overflow: "hidden",
                            cursor: "pointer",
                            border: "2px solid",
                            borderColor:
                              index === dialogImageIndex
                                ? "var(--color-olive-light)"
                                : "divider",
                            opacity: index === dialogImageIndex ? 1 : 0.6,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              opacity: 0.9,
                              borderColor: "var(--color-olive-light)",
                            },
                          }}
                        >
                          <img
                            src={image.url || defaultImage}
                            alt={`Thumbnail ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}

              <Box
                sx={{
                  p: 2,
                  mt: 3,
                  borderRadius: 2,
                  bgcolor: "rgba(0,0,0,0.2)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 16,
                      height: 2,
                      bgcolor: "var(--color-olive-light)",
                      borderRadius: 1,
                    }}
                  />
                  Record Information
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Created At
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontWeight: 500 }}
                    >
                      {detailedAd.createdAt
                        ? formatDate(detailedAd.createdAt)
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Last Updated
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontWeight: 500 }}
                    >
                      {detailedAd.updatedAt
                        ? formatDate(detailedAd.updatedAt)
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Status
                    </Typography>
                    <Chip
                      label={detailedAd.status || "UNKNOWN"}
                      size="small"
                      color={
                        detailedAd.status === "ACTIVE" ? "success" : "default"
                      }
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Record ID
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "monospace", color: "text.disabled" }}
                    >
                      {detailedAd._id || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, rgba(133, 164, 70, 0.15) 0%, rgba(133, 164, 70, 0.35) 100%)",
                  border: "2px solid var(--color-olive)",
                  boxShadow: "0 8px 32px rgba(133, 164, 70, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: "var(--color-olive-light)",
                  }}
                />
                <Typography
                  variant="overline"
                  sx={{
                    color: "var(--color-olive-light)",
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    mb: 0.5,
                    fontSize: "0.8rem",
                  }}
                >
                  RENTAL AMOUNT PER MONTH
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: "white",
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    letterSpacing: "-1px",
                  }}
                >
                  {formatRentalAmount(String(detailedAd.rentalAmount || "0"))}
                </Typography>
              </Box>
            </Box>

            <Box>
              {detailedAd.landowner &&
                typeof detailedAd.landowner === "object" && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(133, 164, 70, 0.05)",
                      border: "1px solid",
                      borderColor: "var(--color-olive-muted)",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 16,
                          bgcolor: "var(--color-olive-light)",
                          borderRadius: 1,
                        }}
                      />
                      Landowner Information
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {detailedAd.landowner.personalInfo?.profilePicture
                        ?.url ? (
                        <Box
                          component="img"
                          src={
                            detailedAd.landowner.personalInfo.profilePicture.url
                          }
                          alt="Profile"
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid var(--color-olive-light)",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            bgcolor: "rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid var(--border-medium)",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{ color: "text.secondary" }}
                          >
                            {detailedAd.landowner.fullName?.charAt(0) || "U"}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {detailedAd.landowner.fullName || "Unknown Owner"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", mt: 0.5 }}
                        >
                          {detailedAd.landowner.email || "No email provided"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 4,
                      height: 16,
                      bgcolor: "#f59e0b",
                      borderRadius: 1,
                    }}
                  />
                  Land Details
                </Typography>
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Land Area (Acres)
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, mt: 0.3 }}
                    >
                      {detailedAd.landArea || "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Soil Type
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        mt: 0.3,
                        textTransform: "capitalize",
                      }}
                    >
                      {detailedAd.soilType || "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Water Availability
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        mt: 0.3,
                        textTransform: "capitalize",
                      }}
                    >
                      {typeof detailedAd.waterAvailability === "string"
                        ? detailedAd.waterAvailability.replace(/-/g, " ")
                        : "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Land History
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        mt: 0.3,
                        textTransform: "capitalize",
                      }}
                    >
                      {detailedAd.landHistory
                        ? detailedAd.landHistory.replace(/-/g, " ")
                        : "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 4,
                      height: 16,
                      bgcolor: "#4caf50",
                      borderRadius: 1,
                    }}
                  />
                  Availability
                </Typography>
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Available From
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, mt: 0.3 }}
                    >
                      {formatDate(detailedAd.availableFrom || "")}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Available To
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, mt: 0.3 }}
                    >
                      {formatDate(detailedAd.availableTo || "")}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 1.5 }}
                >
                  Location & Details
                </Typography>
                <Stack spacing={1.5}>
                  {detailedAd.location && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: "rgba(255,255,255,0.03)",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Location
                      </Typography>
                      {typeof detailedAd.location === "string" ? (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, mt: 0.3 }}
                        >
                          {detailedAd.location}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, mt: 0.3 }}
                        >
                          Lat: {detailedAd.location.latitude?.toFixed(4)}, Lon:{" "}
                          {detailedAd.location.longitude?.toFixed(4)}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {detailedAd.additionalInfo && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: "rgba(255,255,255,0.03)",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Additional Information
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mt: 0.3 }}
                      >
                        {detailedAd.additionalInfo}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LandAdDetailsDialog;
