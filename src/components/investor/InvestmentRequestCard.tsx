import { useEffect, useState } from "react";

import { userService } from "@/services";
import type { InvestmentRequest } from "@/types/farmer.types";
import { CalendarToday, LocationOn, Visibility } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

export interface InvestmentRequestCardProps {
  request: InvestmentRequest;
  onViewDetails?: (request: InvestmentRequest) => void;
}

const InvestmentRequestCard = ({
  request,
  onViewDetails,
}: InvestmentRequestCardProps) => {
  const [farmerProfileImage, setFarmerProfileImage] = useState<string | null>(
    request.farmerImage || null,
  );
  const isCommission = request.offerType === "commission";

  useEffect(() => {
    const fetchFarmerProfile = async () => {
      try {
        if (request.farmerId) {
          const userProfile = await userService.getUserProfile(
            request.farmerId,
          );
          if (
            userProfile.personalInfo?.profilePicture &&
            typeof userProfile.personalInfo.profilePicture === "string"
          ) {
            setFarmerProfileImage(userProfile.personalInfo.profilePicture);
          } else if (
            userProfile.personalInfo?.profilePicture &&
            typeof userProfile.personalInfo.profilePicture === "object" &&
            "url" in userProfile.personalInfo.profilePicture
          ) {
            setFarmerProfileImage(
              userProfile.personalInfo.profilePicture.url || null,
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch farmer profile:", error);
        setFarmerProfileImage(request.farmerImage || null);
      }
    };

    fetchFarmerProfile();
  }, [request.farmerId, request.farmerImage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (): "success" | "warning" | "error" | "default" => {
    switch (request.status?.toLowerCase()) {
      case "open":
        return "success";
      case "draft":
        return "warning";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(request);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(145deg, var(--bg-subtle) 0%, var(--bg-overlay) 100%)",
          border: "1px solid var(--bg-active)",
          borderRadius: 2.5,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow:
              "0 20px 40px var(--overlay-md), 0 0 20px var(--color-olive-muted)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: 160,
            background:
              "linear-gradient(135deg, var(--color-nature-deep) 0%, var(--color-nature-mid) 100%)",
            overflow: "hidden",
          }}
        >
          {request.coverImageUrl && (
            <CardMedia
              component="img"
              image={request.coverImageUrl}
              alt={request.cropType}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.6,
                transition: "all 0.4s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  opacity: 0.75,
                },
              }}
            />
          )}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
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
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={request.status?.toUpperCase() || "UNKNOWN"}
                color={getStatusColor()}
                size="small"
                sx={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  backdropFilter: "blur(10px)",
                  textTransform: "uppercase",
                }}
              />
              <Chip
                label={isCommission ? "COMMISSION" : "HARVEST"}
                size="small"
                sx={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  backdropFilter: "blur(10px)",
                  textTransform: "uppercase",
                  bgcolor: isCommission
                    ? "var(--color-amber-muted)"
                    : "var(--color-success-bg)",
                  color: isCommission
                    ? "var(--color-amber)"
                    : "var(--color-success)",
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
                }}
              >
                {request.cropIcon || "🌱"}
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    textShadow: "0 2px 4px var(--overlay-sm)",
                    fontSize: "1.1rem",
                    lineHeight: 1.3,
                  }}
                >
                  {request.projectTitle}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--text-on-dark)", fontSize: "0.8rem" }}
                >
                  Crop: <strong>{request.cropType}</strong>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          {request.description && (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                About This Project
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-on-dark)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                  mt: 0.5,
                }}
              >
                {request.description}
              </Typography>
            </Box>
          )}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="flex-start" spacing={1}>
              <LocationOn
                sx={{
                  fontSize: 16,
                  color: "var(--text-on-dark)",
                  mt: 0.3,
                  flexShrink: 0,
                }}
              />
              <Stack spacing={0.5} sx={{ flex: 1 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    }}
                  >
                    Primary Location
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "var(--text-primary)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {request.location}
                  </Typography>
                </Box>

                {request.preferredRegions &&
                  request.preferredRegions.length > 0 && (
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "var(--text-tertiary)",
                          textTransform: "uppercase",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                        }}
                      >
                        Preferred Regions
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "var(--text-on-dark)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {request.preferredRegions.join(", ")}
                      </Typography>
                    </Box>
                  )}
              </Stack>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                background: "var(--surface-tint)",
                borderRadius: 1.5,
                p: 1.5,
                border: "1px solid var(--surface-muted)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "var(--neutral-400)",
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                {isCommission ? "Investment Amount" : "Total Investment"}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "var(--color-olive)",
                  fontSize: "1rem",
                  mt: 0.5,
                }}
              >
                {formatCurrency(
                  isCommission
                    ? request.investmentAmount || 0
                    : request.totalInvestmentRequired || 0,
                )}
              </Typography>
            </Box>

            <Box
              sx={{
                background: "var(--surface-tint)",
                borderRadius: 1.5,
                p: 1.5,
                border: "1px solid var(--surface-muted)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Avatar
                  src={farmerProfileImage || undefined}
                  alt={request.farmerName}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "var(--color-olive)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  {request.farmerName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "var(--neutral-400)",
                      textTransform: "uppercase",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                    }}
                  >
                    Farmer
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontSize: "0.875rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {request.farmerName}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--neutral-400)",
                    textTransform: "uppercase",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                  }}
                >
                  Farmer ID
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "var(--color-olive)",
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                  }}
                >
                  {request.farmerId}
                </Typography>
              </Box>
            </Box>
          </Box>

          {isCommission && (
            <Box
              sx={{
                background: "var(--surface-tint)",
                borderRadius: 1.5,
                p: 1.5,
                border: "1px solid var(--surface-muted)",
              }}
            >
              <Stack spacing={1}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "var(--text-tertiary)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Number of Installments
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {request.numberOfInstallments || "N/A"}
                  </Typography>
                </Box>
                {request.expectedLandArea && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--text-tertiary)",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Expected Land Area
                    </Typography>
                    <Typography
                      sx={{
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }}
                    >
                      {request.expectedLandArea} acres
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: "auto",
              pt: 2,
              borderTop: "1px solid var(--surface-muted)",
            }}
          >
            {request.fundingDeadline && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <CalendarToday
                  sx={{ fontSize: 16, color: "var(--text-on-dark)" }}
                />
                <Stack spacing={0}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "var(--text-tertiary)",
                      fontSize: "0.65rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Deadline
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {formatDate(request.fundingDeadline)}
                  </Typography>
                </Stack>
              </Stack>
            )}

            <Box sx={{ ml: "auto" }}>
              <IconButton
                size="small"
                onClick={handleViewDetails}
                title="View Details"
                sx={{
                  color: "var(--color-olive)",
                  "&:hover": { bgcolor: "var(--overlay-sm)" },
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default InvestmentRequestCard;
