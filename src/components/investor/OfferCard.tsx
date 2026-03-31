import {
  Agriculture,
  BusinessCenter,
  Landscape,
  LocationOn,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { AppButton } from "../../shared/components";

export interface PaymentInstallment {
  id: string;
  milestoneId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
  description: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: "completed" | "in-progress" | "pending" | "delayed";
  startDate: string;
  endDate: string;
  completedDate?: string;
  payment: number;
  tasks: {
    total: number;
    completed: number;
  };
}

export interface LandRental {
  id: string;
  landArea: string;
  month: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

export interface PartyMember {
  id: string;
  name: string;
  role: "farmer" | "investor" | "landowner";
  email: string;
  phone: string;
  image: string;
  location?: string;
  coordinates?: string;
  specialization?: string;
  experience?: string;
  rating?: number;
}

export interface OfferCardProps {
  id: string;
  projectName: string;
  projectId?: string;
  cropType: string;
  cropIcon: string;
  farmerName: string;
  farmerImage: string;
  farmerId?: string;
  location: string;
  district?: string;
  province?: string;
  coordinates?: string;
  budget?: number;
  disbursed?: number;
  remaining?: number;
  expectedROI: number;
  status: "active" | "completed" | "pending";
  progress?: number;
  startDate: string;
  endDate?: string;
  backgroundImage?: string;
  investorName?: string;
  investorId?: string;
  landownerName?: string;
  landownerId?: string;
  secondaryPartyName?: string;
  secondaryPartyRoleLabel?: string;
  secondaryPartyRoleType?: "farmer" | "investor" | "landowner";
  secondaryPartyLocation?: string;
  totalMilestones?: number;
  completedMilestones?: number;
  pendingMilestones?: number;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  riskStatus?: string;
  investmentType?: "harvest" | "commission";
  commissionRate?: number;
  earnedCommission?: number;
  investorAmount?: number;
  milestones?: Milestone[];
  payments?: PaymentInstallment[];
  landRentals?: LandRental[];
  partyMembers?: PartyMember[];
  financialBreakdown?: {
    category: string;
    amount: number;
    percentage?: number;
    type?: "expense" | "commission";
  }[];
  onViewDetails?: (id: string) => void;
}

const OfferCard = ({
  id,
  projectName,
  cropType,
  cropIcon,
  farmerName,
  farmerImage,
  location,
  budget,
  expectedROI,
  status,
  progress,
  milestones,
  payments,
  financialBreakdown,
  startDate,
  endDate,
  backgroundImage,
  landownerName,
  secondaryPartyName,
  secondaryPartyRoleLabel,
  secondaryPartyRoleType,
  secondaryPartyLocation,
  investmentType,
  earnedCommission,
  investorAmount,
  onViewDetails,
}: OfferCardProps) => {
  const calculatedROI = useMemo(() => {
    if (
      investmentType === "commission" &&
      investorAmount &&
      earnedCommission !== undefined
    ) {
      return Math.round((earnedCommission / investorAmount) * 100);
    }
    return expectedROI;
  }, [investmentType, earnedCommission, investorAmount, expectedROI]);

  const calculatedProgress = useMemo(() => {
    if (progress !== undefined) return progress;
    if (!milestones || milestones.length === 0) return 0;

    const totalProgress = milestones.reduce(
      (sum, milestone) => sum + milestone.progress,
      0,
    );
    return Math.round(totalProgress / milestones.length);
  }, [progress, milestones]);

  const calculatedBudget = useMemo(() => {
    if (budget !== undefined) return budget;
    if (payments && payments.length > 0) {
      return payments.reduce((sum, payment) => sum + payment.amount, 0);
    }
    if (financialBreakdown && financialBreakdown.length > 0) {
      return financialBreakdown.reduce((sum, item) => sum + item.amount, 0);
    }
    return 0;
  }, [budget, payments, financialBreakdown]);

  const notificationStatus = useMemo(() => {
    const today = new Date();
    let hasCritical = false;
    let hasWarning = false;
    let criticalCount = 0;
    let warningCount = 0;

    if (payments) {
      payments.forEach((payment) => {
        const dueDate = new Date(payment.dueDate);
        const daysDiff = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (payment.status === "pending" && daysDiff < 0) {
          hasCritical = true;
          criticalCount++;
        } else if (
          payment.status === "pending" &&
          daysDiff >= 0 &&
          daysDiff <= 7
        ) {
          hasWarning = true;
          warningCount++;
        }
      });
    }

    if (milestones) {
      milestones.forEach((milestone) => {
        const endDate = new Date(milestone.endDate);
        const daysDiff = Math.ceil(
          (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (milestone.status === "delayed") {
          hasCritical = true;
          criticalCount++;
        } else if (
          milestone.status === "in-progress" &&
          daysDiff >= 0 &&
          daysDiff <= 5
        ) {
          hasWarning = true;
          warningCount++;
        }
      });
    }

    return {
      hasCritical,
      hasWarning,
      totalCount: criticalCount + warningCount,
      criticalCount,
      warningCount,
    };
  }, [payments, milestones]);

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

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "primary";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const secondaryName = secondaryPartyName ?? landownerName;
  const secondaryRoleType = secondaryPartyRoleType ?? "landowner";
  const secondaryRoleLabel =
    secondaryPartyRoleLabel ??
    (secondaryRoleType === "investor"
      ? "Investor"
      : secondaryRoleType === "farmer"
        ? "Farmer"
        : "Landowner");
  const secondaryLocation = secondaryPartyLocation ?? location;

  const secondaryRoleConfig =
    secondaryRoleType === "investor"
      ? {
          borderColor: "var(--color-info-blue)",
          backgroundColor: "var(--color-info-blue-muted)",
          textColor: "var(--color-info-blue)",
          icon: <BusinessCenter sx={{ fontSize: 10, color: "white" }} />,
          avatar: (
            <BusinessCenter
              sx={{ fontSize: 20, color: "var(--color-info-blue)" }}
            />
          ),
        }
      : secondaryRoleType === "farmer"
        ? {
            borderColor: "var(--color-lime)",
            backgroundColor: "var(--color-lime-muted)",
            textColor: "var(--color-lime)",
            icon: <Agriculture sx={{ fontSize: 10, color: "white" }} />,
            avatar: (
              <Agriculture sx={{ fontSize: 20, color: "var(--color-lime)" }} />
            ),
          }
        : {
            borderColor: "var(--color-orange)",
            backgroundColor: "var(--color-orange-muted)",
            textColor: "var(--color-orange)",
            icon: <Landscape sx={{ fontSize: 10, color: "white" }} />,
            avatar: (
              <Landscape sx={{ fontSize: 20, color: "var(--color-orange)" }} />
            ),
          };

  return (
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
      <Box
        sx={{
          position: "relative",
          height: 160,
          background:
            "linear-gradient(135deg, var(--color-nature-deep) 0%, var(--color-nature-mid) 100%)",
          overflow: "hidden",
        }}
      >
        {backgroundImage && (
          <CardMedia
            component="img"
            image={backgroundImage}
            alt={cropType}
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
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              label={status.toUpperCase()}
              color={getStatusColor()}
              size="small"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
                backdropFilter: "blur(10px)",
                textTransform: "uppercase",
              }}
            />
            {(notificationStatus.hasCritical ||
              notificationStatus.hasWarning) && (
              <Tooltip
                title={
                  notificationStatus.hasCritical
                    ? `${notificationStatus.criticalCount} Critical Alert${notificationStatus.criticalCount > 1 ? "s" : ""}`
                    : `${notificationStatus.warningCount} Warning${notificationStatus.warningCount > 1 ? "s" : ""}`
                }
                arrow
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: notificationStatus.hasCritical
                      ? "var(--color-error-bg)"
                      : "var(--color-orange-muted)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "50%",
                    border: `2px solid ${notificationStatus.hasCritical ? "var(--color-overdue)" : "var(--color-amber)"}`,
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%, 100%": {
                        boxShadow: `0 0 0 0 ${notificationStatus.hasCritical ? "var(--color-overdue-border)" : "var(--color-amber-muted)"}`,
                      },
                      "50%": {
                        boxShadow: `0 0 0 8px ${notificationStatus.hasCritical ? "transparent" : "rgba(255, 167, 38, 0)"}`,
                      },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      lineHeight: 1,
                    }}
                  >
                    {notificationStatus.hasCritical ? "🚨" : "⚠️"}
                  </Typography>
                  {notificationStatus.totalCount > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        width: 18,
                        height: 18,
                        bgcolor: notificationStatus.hasCritical
                          ? "var(--color-overdue)"
                          : "var(--color-amber)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid var(--bg-overlay)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "white",
                          lineHeight: 1,
                        }}
                      >
                        {notificationStatus.totalCount}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Tooltip>
            )}
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
              {cropIcon}
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  textShadow: "0 2px 4px var(--overlay-sm)",
                  fontSize: "1.1rem",
                }}
              >
                {projectName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "var(--text-on-dark)" }}
              >
                {cropType}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <CardContent
        sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, p: 2 }}
      >
        <div className="row g-2">
          <div className="col-6">
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
                sx={{ color: "var(--neutral-400)", textTransform: "uppercase" }}
              >
                Budget
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "var(--color-olive)",
                  fontSize: "1rem",
                }}
              >
                {formatCurrency(calculatedBudget)}
              </Typography>
            </Box>
          </div>
          <div className="col-6">
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
                sx={{ color: "var(--neutral-400)", textTransform: "uppercase" }}
              >
                {investmentType === "commission"
                  ? "Calculated ROI"
                  : "Expected ROI"}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "var(--color-success)",
                  fontSize: "1rem",
                }}
              >
                {calculatedROI}%
              </Typography>
            </Box>
          </div>
        </div>

        {status === "active" && (
          <Box sx={{ mt: "auto" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="body2" color="text.secondary">
                Project Progress
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                {calculatedProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculatedProgress}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: "var(--surface-light)",
                "& .MuiLinearProgress-bar": {
                  background:
                    "linear-gradient(90deg, var(--color-olive) 0%, var(--color-olive-light) 100%)",
                },
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            pt: 2,
            borderTop: "1px solid var(--surface-muted)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: secondaryName ? 1.5 : 0,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={farmerImage}
                alt={farmerName}
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid",
                  borderColor: "var(--color-lime)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 18,
                  height: 18,
                  bgcolor: "var(--color-lime)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid var(--bg-overlay)",
                }}
              >
                <Agriculture sx={{ fontSize: 12, color: "white" }} />
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: "0.85rem" }}
              >
                {farmerName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--color-lime)", fontSize: "0.7rem" }}
                >
                  Farmer
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--neutral-500)" }}
                >
                  •
                </Typography>
                <LocationOn
                  sx={{ fontSize: 12, color: "var(--neutral-400)" }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.7rem" }}
                >
                  {location}
                </Typography>
              </Box>
            </Box>
            {!secondaryName && (
              <Tooltip title="View Details">
                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails?.(id)}
                  leadingIcon={<Visibility fontSize="small" />}
                  className="!px-2.5 !py-1"
                >
                  View
                </AppButton>
              </Tooltip>
            )}
          </Box>

          {secondaryName && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    border: "2px solid",
                    borderColor: secondaryRoleConfig.borderColor,
                    bgcolor: secondaryRoleConfig.backgroundColor,
                  }}
                >
                  {secondaryRoleConfig.avatar}
                </Avatar>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 18,
                    height: 18,
                    bgcolor: secondaryRoleConfig.borderColor,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid var(--bg-overlay)",
                  }}
                >
                  {secondaryRoleConfig.icon}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                >
                  {secondaryName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: secondaryRoleConfig.textColor,
                      fontSize: "0.7rem",
                    }}
                  >
                    {secondaryRoleLabel}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "var(--neutral-500)" }}
                  >
                    •
                  </Typography>
                  <LocationOn
                    sx={{ fontSize: 12, color: "var(--neutral-400)" }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {secondaryLocation}
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="View Details">
                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails?.(id)}
                  leadingIcon={<Visibility fontSize="small" />}
                  className="!px-2.5 !py-1"
                >
                  View
                </AppButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </CardContent>

      <Box
        className="row g-0"
        sx={{
          p: 1.5,
          background: "var(--overlay-sm)",
          borderTop: "1px solid var(--surface-muted)",
        }}
      >
        <div className="col-6 text-center">
          <Typography
            variant="caption"
            sx={{
              color: "var(--neutral-400)",
              textTransform: "uppercase",
              fontSize: "0.65rem",
            }}
          >
            Started
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}
          >
            {formatDate(startDate)}
          </Typography>
        </div>
        {endDate && (
          <div className="col-6 text-center">
            <Typography
              variant="caption"
              sx={{
                color: "var(--neutral-400)",
                textTransform: "uppercase",
                fontSize: "0.65rem",
              }}
            >
              {status === "completed" ? "Completed" : "Expected End"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}
            >
              {formatDate(endDate)}
            </Typography>
          </div>
        )}
      </Box>
    </Card>
  );
};

export default OfferCard;
