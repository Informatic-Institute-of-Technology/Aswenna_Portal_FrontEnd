import {
  ChevronLeft,
  ChevronRight,
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getLandownerAdById, type LandownerAdApiItem } from "../../services";

interface LandAdPriorityCardProps {
  ad: {
    id: string;
    title: string;
    landArea: string;
    location: string;
    soilType: string;
    rentalAmount: string;
    waterAvailability?: string;
    landHistory?: string;
    additionalInfo?: string;
    availableFrom: string;
    availableTo: string;
    image?: string;
    landownerName?: string;
    status: string;
    investorRequests: number;
    [key: string]: unknown;
  };
  defaultImage: string;
  onEdit?: (adId: string) => void;
  onDelete?: (adId: string) => void;
  statusConfig: Record<
    string,
    { label: string; color: "success" | "warning" | "default" }
  >;
  isOpen: boolean;
  isExpired: boolean;
}

const LandAdPriorityCard = ({
  ad,
  defaultImage,
  onEdit,
  onDelete,
  statusConfig,
  isOpen,
  isExpired,
}: LandAdPriorityCardProps) => {
  const [payloadDialogOpen, setPayloadDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dialogImageIndex, setDialogImageIndex] = useState(0);
  const [detailedAd, setDetailedAd] = useState<LandownerAdApiItem | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const images = (ad.images as Array<{ url?: string }> | undefined) || [];
  const imagesToDisplay =
    images.length > 0 ? images : [{ url: ad.image || defaultImage }];

  useEffect(() => {
    if (imagesToDisplay.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === imagesToDisplay.length - 1 ? 0 : prev + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [imagesToDisplay.length]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagesToDisplay.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === imagesToDisplay.length - 1 ? 0 : prev + 1,
    );
  };

  const currentImage = imagesToDisplay[currentImageIndex];

  const handleViewPayload = async () => {
    setIsLoadingDetails(true);
    setLoadError(null);
    try {
      const response = await getLandownerAdById(ad.id);
      setDetailedAd(response);
      setPayloadDialogOpen(true);
    } catch (error) {
      console.error("Error loading ad details:", error);
      setLoadError(
        error instanceof Error ? error.message : "Failed to load ad details",
      );
      setPayloadDialogOpen(true);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Flexible";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

  const config = statusConfig[ad.status];
  const statusLabel = config?.label || "Unknown";
  const statusColor = config?.color || "default";

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(145deg, var(--bg-subtle) 0%, var(--bg-overlay) 100%)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow:
              "0 20px 40px var(--overlay-md), 0 0 20px var(--color-olive-muted)",
          },
        }}
      >
        <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={currentImage.url || defaultImage}
            alt={ad.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.7,
              transition: "opacity 0.3s ease, transform 0.3s ease",
              "&:hover": { opacity: 0.85, transform: "scale(1.05)" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          {imagesToDisplay.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 5,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                  },
                }}
                size="small"
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 5,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                  },
                }}
                size="small"
              >
                <ChevronRight />
              </IconButton>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  zIndex: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {currentImageIndex + 1} / {imagesToDisplay.length}
              </Box>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  zIndex: 5,
                }}
              >
                {imagesToDisplay.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor:
                        index === currentImageIndex
                          ? "white"
                          : "rgba(255, 255, 255, 0.5)",
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

          <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
            <Chip
              label={statusLabel}
              color={statusColor}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 12,
              zIndex: 10,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
                mb: 0.5,
                textShadow: "0 1px 4px rgba(0,0,0,0.7)",
              }}
            >
              {ad.title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip
                label={ad.landArea}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                }}
              />
              {ad.landownerName && (
                <Chip
                  label={ad.landownerName}
                  size="small"
                  sx={{
                    bgcolor: "rgba(133, 164, 70, 0.3)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Stack>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: 0 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "var(--surface-tint)",
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Rental / Season
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "var(--color-olive-light)" }}
              >
                {formatRentalAmount(ad.rentalAmount)}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "var(--surface-tint)",
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Soil Type
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, textTransform: "capitalize" }}
              >
                {ad.soilType}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 1.5, opacity: 0.4 }} />

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Location
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {ad.location}
            </Typography>
          </Box>

          {ad.waterAvailability && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Water Availability
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, textTransform: "capitalize" }}
              >
                {typeof ad.waterAvailability === "string"
                  ? ad.waterAvailability.replace(/-/g, " ")
                  : "Available"}
              </Typography>
            </Box>
          )}

          {isOpen && (
            <Typography variant="caption" color="text.secondary">
              {ad.investorRequests} investor request
              {ad.investorRequests === 1 ? "" : "s"} received.
            </Typography>
          )}
        </CardContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
            mt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            background: "var(--surface-tint)",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              From
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {formatDate(ad.availableFrom)}
            </Typography>
          </Box>

          {isExpired && (
            <Button
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.7rem", textTransform: "none", px: 1.5 }}
            >
              New Season
            </Button>
          )}

          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              To
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {formatDate(ad.availableTo)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 0.5,
            px: 1,
            py: 1,
            background: "var(--surface-tint)",
          }}
        >
          {isOpen && onEdit && (
            <Tooltip title="Edit Ad">
              <IconButton
                size="small"
                onClick={() => onEdit(ad.id)}
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "var(--color-olive-muted)",
                  },
                }}
              >
                <Edit sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="View Full Details">
            <IconButton
              size="small"
              onClick={handleViewPayload}
              sx={{
                color: "primary.main",
                "&:hover": { backgroundColor: "var(--color-olive-muted)" },
              }}
            >
              <Visibility sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Tooltip>

          {isOpen && onDelete && (
            <Tooltip title="Delete Ad">
              <IconButton
                size="small"
                onClick={() => onDelete(ad.id)}
                sx={{
                  color: "error.main",
                  "&:hover": { backgroundColor: "rgba(211,47,47,0.1)" },
                }}
              >
                <Delete sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Card>

      <Dialog
        open={payloadDialogOpen}
        onClose={() => {
          setPayloadDialogOpen(false);
          setDialogImageIndex(0);
        }}
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
              {detailedAd?.title || ad.title}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Detailed Land Advertisement Information
            </Typography>
          </Box>
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
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
            >
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
                      <CardMedia
                        component="img"
                        image={
                          detailedAd.images[dialogImageIndex]?.url ||
                          defaultImage
                        }
                        alt={`${detailedAd.title} - ${dialogImageIndex + 1}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />

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
                {detailedAd.images && detailedAd.images[dialogImageIndex] && (
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "rgba(133, 164, 70, 0.08)",
                      border: "1px solid",
                      borderColor: "divider",
                      mb: 2,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Image Details
                    </Typography>
                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        File: {detailedAd.images[dialogImageIndex].filename}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Size:{" "}
                        {(
                          Number(
                            detailedAd.images[dialogImageIndex].fileSize || 0,
                          ) / 1024
                        ).toFixed(2)}{" "}
                        KB
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Type: {detailedAd.images[dialogImageIndex].mimeType}
                      </Typography>
                    </Stack>
                  </Box>
                )}

                {detailedAd.landowner &&
                  typeof detailedAd.landowner === "object" && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(133, 164, 70, 0.1)",
                        border: "1px solid",
                        borderColor: "var(--color-olive-muted)",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 1.5 }}
                      >
                        Landowner Information
                      </Typography>
                      {detailedAd.landowner.personalInfo?.profilePicture
                        ?.url && (
                        <Box
                          component="img"
                          src={
                            detailedAd.landowner.personalInfo.profilePicture.url
                          }
                          alt="Profile"
                          sx={{
                            width: "100%",
                            height: 150,
                            borderRadius: 1,
                            objectFit: "cover",
                            mb: 1.5,
                          }}
                        />
                      )}
                      <Stack spacing={1}>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, mt: 0.3 }}
                          >
                            {detailedAd.landowner.fullName || "N/A"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, mt: 0.3 }}
                          >
                            {detailedAd.landowner.email || "N/A"}
                          </Typography>
                        </Box>
                        {detailedAd.landowner._id && (
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 600,
                                color: "text.secondary",
                              }}
                            >
                              Landowner ID
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: "monospace",
                                color: "text.secondary",
                                mt: 0.3,
                                display: "block",
                                wordBreak: "break-all",
                              }}
                            >
                              {detailedAd.landowner._id}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  )}
              </Box>

              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1.5 }}
                  >
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
                    sx={{ fontWeight: 700, mb: 1.5 }}
                  >
                    Rental & Availability
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: "rgba(133, 164, 70, 0.1)",
                        border: "1px solid",
                        borderColor: "var(--color-olive-muted)",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Rental Amount / Season
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          mt: 0.3,
                          color: "var(--color-olive-light)",
                          fontSize: "1.1rem",
                        }}
                      >
                        {formatRentalAmount(
                          String(detailedAd.rentalAmount || "0"),
                        )}
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
                            Lat: {detailedAd.location.latitude?.toFixed(4)},
                            Lon: {detailedAd.location.longitude?.toFixed(4)}
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

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "rgba(0,0,0,0.2)",
                    border: "1px solid",
                    borderColor: "divider",
                    fontSize: "0.85rem",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "text.secondary" }}
                  >
                    Record Information
                  </Typography>
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Created:</strong>{" "}
                      {formatDate(detailedAd.createdAt || "")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Updated:</strong>{" "}
                      {formatDate(detailedAd.updatedAt || "")}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              onClick={() => {
                setPayloadDialogOpen(false);
                setDialogImageIndex(0);
              }}
              variant="contained"
              sx={{
                background: "var(--color-olive-light)",
                color: "white",
                "&:hover": {
                  background: "var(--color-olive-dark)",
                },
              }}
            >
              Close
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LandAdPriorityCard;
