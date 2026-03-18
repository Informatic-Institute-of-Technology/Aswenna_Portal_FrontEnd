import { useAuth } from "@/Context/useAuth";
import {
  AccessTime,
  AttachMoney,
  BusinessCenter,
  CalendarToday,
  CheckCircle,
  Close,
  Email,
  ExpandLess,
  ExpandMore,
  Landscape,
  LocationOn,
  Payment,
  Person,
  Phone,
  Star,
  WarningAmber,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import LocationMapDialog from "./LocationMapDialog";
import type { OfferCardProps } from "./OfferCard";

interface ProjectDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  project: OfferCardProps | null;
  viewMode?: "default" | "landowner";
}

const ProjectDetailsDialog = ({
  open,
  onClose,
  project,
  viewMode = "default",
}: ProjectDetailsDialogProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const { user } = useAuth();

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    id: "google-map-script",
  });
  const [budgetExpanded, setBudgetExpanded] = useState(false);
  const isLandownerView = viewMode === "landowner";

  const calculatedBudgetBreakdown = useMemo(() => {
    if (
      !project ||
      !project.financialBreakdown ||
      project.financialBreakdown.length === 0
    )
      return [];

    const filteredBreakdown = project.financialBreakdown.filter((item) => {
      if (item.type) {
        return item.type === "expense";
      }
      return !item.category.toLowerCase().includes("commission");
    });

    const totalBudget = filteredBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    return filteredBreakdown
      .map((item) => ({
        ...item,
        percentage: Math.round((item.amount / totalBudget) * 100 * 100) / 100,
        calculatedTotal: totalBudget,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [project]);

  const calculatedFinancials = useMemo(() => {
    if (!project || !project.payments || project.payments.length === 0) {
      const filteredBreakdown = project?.financialBreakdown?.filter((item) => {
        if (item.type) {
          return item.type === "expense";
        }
        return !item.category.toLowerCase().includes("commission");
      });
      const budget =
        filteredBreakdown?.reduce((sum, item) => sum + item.amount, 0) || 0;
      return { budget, disbursed: 0, remaining: budget };
    }

    const budget = project.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );
    const disbursed = project.payments
      .filter((p) => p.status === "paid")
      .reduce((sum, payment) => sum + payment.amount, 0);
    const remaining = budget - disbursed;

    return { budget, disbursed, remaining };
  }, [project]);

  const calculatedMilestones = useMemo(() => {
    if (!project || !project.milestones || project.milestones.length === 0) {
      return { total: 0, completed: 0, pending: 0, inProgress: 0 };
    }

    const total = project.milestones.length;
    const completed = project.milestones.filter(
      (m) => m.status === "completed",
    ).length;
    const inProgress = project.milestones.filter(
      (m) => m.status === "in-progress",
    ).length;
    const pending = project.milestones.filter(
      (m) => m.status === "pending",
    ).length;

    return { total, completed, pending, inProgress };
  }, [project]);

  const calculatedProgress = useMemo(() => {
    if (!project || !project.milestones || project.milestones.length === 0)
      return 0;

    const totalProgress = project.milestones.reduce(
      (sum, milestone) => sum + milestone.progress,
      0,
    );
    return Math.round(totalProgress / project.milestones.length);
  }, [project]);

  const notifications = useMemo(() => {
    if (!project) return [];

    const today = new Date();
    const notifs: Array<{
      id: string;
      type: "critical" | "warning" | "success" | "info";
      title: string;
      message: string;
      icon: string;
      timestamp: string;
    }> = [];

    const formatCurrencyForNotif = (amount: number) => {
      return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const formatDateForNotif = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    if (project.payments) {
      project.payments.forEach((payment) => {
        const dueDate = new Date(payment.dueDate);
        const daysDiff = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (payment.status === "pending" && daysDiff < 0) {
          notifs.push({
            id: `overdue-${payment.id}`,
            type: "critical",
            title: "⚠️ OVERDUE PAYMENT",
            message: `Payment of ${formatCurrencyForNotif(payment.amount)} is ${Math.abs(daysDiff)} days overdue. Due date was ${formatDateForNotif(payment.dueDate)}.`,
            icon: "🚨",
            timestamp: payment.dueDate,
          });
        } else if (
          payment.status === "pending" &&
          daysDiff >= 0 &&
          daysDiff <= 7
        ) {
          notifs.push({
            id: `due-soon-${payment.id}`,
            type: "warning",
            title: "⏰ PAYMENT DUE SOON",
            message: `Payment of ${formatCurrencyForNotif(payment.amount)} is due in ${daysDiff} day${daysDiff !== 1 ? "s" : ""}. Due date: ${formatDateForNotif(payment.dueDate)}.`,
            icon: "⚠️",
            timestamp: payment.dueDate,
          });
        } else if (payment.status === "paid" && payment.paidDate) {
          const paidDate = new Date(payment.paidDate);
          const daysSincePaid = Math.ceil(
            (today.getTime() - paidDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (daysSincePaid <= 7) {
            notifs.push({
              id: `paid-${payment.id}`,
              type: "success",
              title: "✅ PAYMENT COMPLETED",
              message: `Payment of ${formatCurrencyForNotif(payment.amount)} was successfully processed on ${formatDateForNotif(payment.paidDate)}.`,
              icon: "✅",
              timestamp: payment.paidDate,
            });
          }
        }
      });
    }

    if (project.milestones) {
      project.milestones.forEach((milestone) => {
        const endDate = new Date(milestone.endDate);
        const daysDiff = Math.ceil(
          (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (milestone.status === "delayed") {
          notifs.push({
            id: `delayed-${milestone.id}`,
            type: "critical",
            title: "🚨 MILESTONE DELAYED",
            message: `"${milestone.title}" is behind schedule. Expected completion was ${formatDateForNotif(milestone.endDate)}.`,
            icon: "🚨",
            timestamp: milestone.endDate,
          });
        }
        // Warning: In-progress milestone nearing deadline
        else if (
          milestone.status === "in-progress" &&
          daysDiff >= 0 &&
          daysDiff <= 5
        ) {
          notifs.push({
            id: `deadline-${milestone.id}`,
            type: "warning",
            title: "⏳ MILESTONE DEADLINE APPROACHING",
            message: `"${milestone.title}" is ${milestone.progress}% complete with ${daysDiff} day${daysDiff !== 1 ? "s" : ""} remaining.`,
            icon: "⏳",
            timestamp: milestone.endDate,
          });
        } else if (
          milestone.status === "completed" &&
          milestone.completedDate
        ) {
          const completedDate = new Date(milestone.completedDate);
          const daysSinceCompleted = Math.ceil(
            (today.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (daysSinceCompleted <= 7) {
            notifs.push({
              id: `completed-${milestone.id}`,
              type: "success",
              title: "🎉 MILESTONE ACHIEVED",
              message: `"${milestone.title}" was successfully completed on ${formatDateForNotif(milestone.completedDate)}.`,
              icon: "🎉",
              timestamp: milestone.completedDate,
            });
          }
        }
      });
    }

    const priorityOrder = { critical: 0, warning: 1, success: 2, info: 3 };
    return notifs.sort((a, b) => {
      if (priorityOrder[a.type] !== priorityOrder[b.type]) {
        return priorityOrder[a.type] - priorityOrder[b.type];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [project]);

  const getCategoryColor = (index: number, percentage: number) => {
    if (percentage >= 20) return "var(--color-overdue)";
    if (percentage >= 15) return "var(--color-amber)";
    if (percentage >= 10) return "var(--color-success)";
    return `hsl(${120 + index * 25}, 60%, 55%)`;
  };

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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "critical":
        return {
          bg: "var(--color-overdue-muted)",
          border: "var(--color-overdue)",
          text: "var(--color-overdue)",
        };
      case "warning":
        return {
          bg: "var(--color-orange-muted)",
          border: "var(--color-amber)",
          text: "var(--color-amber)",
        };
      case "success":
        return {
          bg: "var(--color-lime-muted)",
          border: "var(--color-lime)",
          text: "var(--color-lime)",
        };
      case "info":
        return {
          bg: "var(--color-info-blue-muted)",
          border: "var(--color-info-blue)",
          text: "var(--color-info-blue)",
        };
      default:
        return {
          bg: "var(--surface-muted)",
          border: "var(--neutral-500)",
          text: "var(--neutral-500)",
        };
    }
  };

  if (!project) return null;

  const getRiskColor = () => {
    switch (project.riskLevel) {
      case "LOW":
        return "var(--color-lime)";
      case "MEDIUM":
        return "var(--color-amber)";
      case "HIGH":
        return "var(--color-overdue)";
      default:
        return "var(--color-lime)";
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "var(--color-lime)";
      case "in-progress":
        return "var(--color-info-blue)";
      case "delayed":
        return "var(--color-overdue)";
      default:
        return "var(--neutral-500)";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "var(--color-lime)";
      case "pending":
        return "var(--color-amber)";
      case "overdue":
        return "var(--color-overdue)";
      default:
        return "var(--neutral-500)";
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  const teamMembersForView = project.partyMembers || [];

  const landownerFinancials = (() => {
    const rentals = project.landRentals || [];
    const total = rentals.reduce((sum, rental) => sum + rental.amount, 0);
    const received = rentals
      .filter((rental) => rental.status === "paid")
      .reduce((sum, rental) => sum + rental.amount, 0);
    const overdue = rentals
      .filter((rental) => rental.status === "overdue")
      .reduce((sum, rental) => sum + rental.amount, 0);

    return { total, received, overdue };
  })();

  const landownerPayableTotal = landownerFinancials.total;
  const landownerReceivedPercentage =
    landownerPayableTotal > 0
      ? Math.min(
          (landownerFinancials.received / landownerPayableTotal) * 100,
          100,
        )
      : 0;
  const landownerOverduePercentage =
    landownerPayableTotal > 0
      ? Math.min(
          (landownerFinancials.overdue / landownerPayableTotal) * 100,
          100,
        )
      : 0;
  const landownerPendingAmount = Math.max(
    landownerPayableTotal -
      landownerFinancials.received -
      landownerFinancials.overdue,
    0,
  );
  const landownerPendingPercentage = Math.max(
    100 - landownerReceivedPercentage - landownerOverduePercentage,
    0,
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "var(--bg-overlay)",
            maxHeight: "95vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            pb: 1,
            pt: 3,
            px: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              color="white"
              gutterBottom
            >
              {project.projectName}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="body2" color="var(--text-on-dark)">
                {project.projectId || `PRJ-${project.id}`}
              </Typography>
              <Chip
                label={project.status.toUpperCase()}
                size="small"
                sx={{
                  bgcolor:
                    project.status === "active"
                      ? "var(--color-lime)"
                      : project.status === "completed"
                        ? "var(--color-info-blue)"
                        : "var(--color-amber)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Typography variant="body2" color="var(--text-on-dark)">
                <CalendarToday
                  sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
                />
                Started {formatDate(project.startDate)}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor: "var(--surface-light)" }} />

        {/* Tabs */}
        <Box
          sx={{ borderBottom: 1, borderColor: "var(--surface-light)", px: 3 }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            textColor="inherit"
            TabIndicatorProps={{ sx: { bgcolor: "var(--color-lime)" } }}
          >
            <Tab
              label="Overview"
              sx={{
                color: "var(--text-on-dark)",
                "&.Mui-selected": { color: "white" },
              }}
            />
            <Tab
              label="Milestones & Progress"
              sx={{
                color: "var(--text-on-dark)",
                "&.Mui-selected": { color: "white" },
              }}
            />
            <Tab
              label="Payments & Finance"
              sx={{
                color: "var(--text-on-dark)",
                "&.Mui-selected": { color: "white" },
              }}
            />
            <Tab
              label="Team Members"
              sx={{
                color: "var(--text-on-dark)",
                "&.Mui-selected": { color: "white" },
              }}
            />
          </Tabs>
        </Box>

        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          {activeTab === 0 && (
            <Box>
              {calculatedProgress !== undefined &&
                project.status === "active" && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 3,
                      bgcolor: "var(--color-lime-muted)",
                      borderRadius: 2,
                      border: "1px solid var(--color-lime-muted-strong)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="var(--text-on-dark)"
                          gutterBottom
                        >
                          OVERALL PROJECT PROGRESS
                        </Typography>
                        <Typography variant="h4" color="white" fontWeight={700}>
                          {calculatedProgress}% Complete
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          color="var(--text-on-dark)"
                        >
                          Expected Completion
                        </Typography>
                        <Typography
                          variant="body1"
                          color="white"
                          fontWeight={600}
                        >
                          {project.endDate
                            ? formatDate(project.endDate)
                            : "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={calculatedProgress}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "var(--surface-light)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                          backgroundColor: "var(--color-lime)",
                        },
                      }}
                    />
                  </Box>
                )}

              <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
                {!isLandownerView ? (
                  <Box
                    sx={{
                      flex: 1,
                      p: 3,
                      bgcolor: "var(--surface-tint)",
                      borderRadius: 2,
                      border: "1px solid var(--surface-light)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="white"
                      gutterBottom
                      fontWeight={600}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <AttachMoney /> Financial Summary
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="var(--text-on-dark)"
                        >
                          TOTAL INVESTMENT
                        </Typography>
                        <Typography variant="h5" color="white" fontWeight={700}>
                          {formatCurrency(calculatedFinancials.budget)}
                        </Typography>
                      </Box>
                      {calculatedFinancials.disbursed > 0 && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="var(--text-on-dark)"
                          >
                            DISBURSED AMOUNT
                          </Typography>
                          <Typography
                            variant="h6"
                            color="var(--color-lime)"
                            fontWeight={600}
                          >
                            {formatCurrency(calculatedFinancials.disbursed)}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={
                              (calculatedFinancials.disbursed /
                                calculatedFinancials.budget) *
                              100
                            }
                            sx={{
                              mt: 1,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: "var(--surface-light)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 3,
                                backgroundColor: "var(--color-lime)",
                              },
                            }}
                          />
                        </Box>
                      )}
                      {calculatedFinancials.remaining > 0 && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="var(--text-on-dark)"
                          >
                            REMAINING BALANCE
                          </Typography>
                          <Typography
                            variant="h6"
                            color="var(--color-amber)"
                            fontWeight={600}
                          >
                            {formatCurrency(calculatedFinancials.remaining)}
                          </Typography>
                        </Box>
                      )}
                      <Divider
                        sx={{ borderColor: "var(--surface-light)", my: 1 }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color="var(--text-on-dark)"
                        >
                          EXPECTED ROI
                        </Typography>
                        <Typography
                          variant="h5"
                          color="var(--color-lime)"
                          fontWeight={700}
                        >
                          {project.expectedROI}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      p: 3,
                      bgcolor: "var(--surface-tint)",
                      borderRadius: 2,
                      border: "1px solid var(--surface-light)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="white"
                      gutterBottom
                      fontWeight={600}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Payment sx={{ color: "var(--color-orange)" }} />
                      Payment Progress
                    </Typography>

                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: 170,
                          height: 170,
                          borderRadius: "50%",
                          background: `conic-gradient(var(--color-lime) 0% ${landownerReceivedPercentage}%, var(--color-overdue) ${landownerReceivedPercentage}% ${landownerReceivedPercentage + landownerOverduePercentage}%, var(--color-amber) ${landownerReceivedPercentage + landownerOverduePercentage}% ${landownerReceivedPercentage + landownerOverduePercentage + landownerPendingPercentage}%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 118,
                            height: 118,
                            borderRadius: "50%",
                            bgcolor: "var(--bg-overlay)",
                            border: "1px solid var(--surface-light)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            px: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="var(--text-on-dark)"
                            sx={{ letterSpacing: 0.4 }}
                          >
                            TOTAL PAYABLE
                          </Typography>
                          <Typography
                            variant="body1"
                            color="white"
                            fontWeight={700}
                          >
                            {formatCurrency(landownerPayableTotal)}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider
                        sx={{
                          borderColor: "var(--surface-light)",
                          my: 1,
                          width: "100%",
                        }}
                      />

                      <Box
                        sx={{
                          width: "100%",
                          display: "grid",
                          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: "var(--surface-muted)",
                            border: "1px solid var(--surface-light)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="var(--text-on-dark)"
                          >
                            RECEIVED
                          </Typography>
                          <Typography
                            variant="body1"
                            color="var(--color-lime)"
                            fontWeight={700}
                          >
                            {formatCurrency(landownerFinancials.received)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="var(--text-on-dark)"
                          >
                            {Math.round(landownerReceivedPercentage)}%
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: "var(--surface-muted)",
                            border: "1px solid var(--surface-light)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="var(--text-on-dark)"
                          >
                            OVERDUE
                          </Typography>
                          <Typography
                            variant="body1"
                            color="var(--color-overdue)"
                            fontWeight={700}
                          >
                            {formatCurrency(landownerFinancials.overdue)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="var(--text-on-dark)"
                          >
                            {Math.round(landownerOverduePercentage)}%
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: "var(--surface-muted)",
                            border: "1px solid var(--surface-light)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="var(--text-on-dark)"
                          >
                            PENDING
                          </Typography>
                          <Typography
                            variant="body1"
                            color="var(--color-amber)"
                            fontWeight={700}
                          >
                            {formatCurrency(landownerPendingAmount)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="var(--text-on-dark)"
                          >
                            {Math.round(landownerPendingPercentage)}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}

                {calculatedMilestones.total > 0 && (
                  <Box
                    sx={{
                      flex: 1,
                      p: 3,
                      bgcolor: "var(--surface-tint)",
                      borderRadius: 2,
                      border: "1px solid var(--surface-light)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="white"
                      gutterBottom
                      fontWeight={600}
                    >
                      🎯 Milestone Status
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="var(--text-on-dark)"
                        >
                          TOTAL MILESTONES
                        </Typography>
                        <Typography variant="h5" color="white" fontWeight={700}>
                          {calculatedMilestones.total}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            p: 2,
                            bgcolor: "var(--color-lime-muted)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="var(--color-lime)"
                          >
                            COMPLETED
                          </Typography>
                          <Typography
                            variant="h4"
                            color="var(--color-lime)"
                            fontWeight={700}
                          >
                            {calculatedMilestones.completed}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            p: 2,
                            bgcolor: "rgba(255, 167, 38, 0.1)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="var(--color-amber)"
                          >
                            PENDING
                          </Typography>
                          <Typography
                            variant="h4"
                            color="var(--color-amber)"
                            fontWeight={700}
                          >
                            {calculatedMilestones.pending +
                              calculatedMilestones.inProgress}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="var(--text-on-dark)"
                        >
                          COMPLETION RATE
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={
                            (calculatedMilestones.completed /
                              calculatedMilestones.total) *
                            100
                          }
                          sx={{
                            mt: 1,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "var(--surface-light)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 4,
                              backgroundColor: "var(--color-lime)",
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="white"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {Math.round(
                            (calculatedMilestones.completed /
                              calculatedMilestones.total) *
                              100,
                          )}
                          % Complete
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>

              {notifications.length > 0 && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2.5,
                    bgcolor: "var(--surface-tint)",
                    borderRadius: 2,
                    border: "1px solid var(--surface-light)",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="white"
                    gutterBottom
                    fontWeight={600}
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    🔔 Latest Notifications
                    <Chip
                      label={notifications.length}
                      size="small"
                      sx={{
                        bgcolor: notifications.some(
                          (n) => n.type === "critical",
                        )
                          ? "var(--color-overdue)"
                          : "var(--color-lime)",
                        color: "white",
                        fontWeight: 700,
                        height: 20,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: 250,
                      overflowY: "auto",
                      pr: 1,
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "var(--surface-muted)",
                        borderRadius: "3px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "var(--surface-light)",
                        borderRadius: "3px",
                        "&:hover": {
                          background: "var(--surface-light)",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {notifications.map((notif) => {
                        const colors = getNotificationColor(notif.type);
                        const notifDate = new Date(notif.timestamp);
                        const today = new Date();
                        const daysDiff = Math.ceil(
                          (today.getTime() - notifDate.getTime()) /
                            (1000 * 60 * 60 * 24),
                        );
                        const timeAgo =
                          daysDiff === 0
                            ? "Today"
                            : daysDiff === 1
                              ? "Yesterday"
                              : `${daysDiff} days ago`;

                        return (
                          <Box
                            key={notif.id}
                            sx={{
                              p: 1.5,
                              bgcolor: colors.bg,
                              borderRadius: 1.5,
                              borderLeft: `4px solid ${colors.border}`,
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "translateX(2px)",
                                bgcolor: `${colors.bg}dd`,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                fontSize: "20px",
                                lineHeight: 1,
                                flexShrink: 0,
                              }}
                            >
                              {notif.icon}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  gap: 1,
                                  mb: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: colors.text,
                                    fontWeight: 700,
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.3px",
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {notif.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "var(--text-on-dark)",
                                    fontSize: "0.7rem",
                                    flexShrink: 0,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {timeAgo}
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgba(255,255,255,0.85)",
                                  fontSize: "0.8rem",
                                  lineHeight: 1.4,
                                }}
                              >
                                {notif.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "var(--text-on-dark)",
                                  fontSize: "0.7rem",
                                  mt: 0.5,
                                  display: "block",
                                }}
                              >
                                {formatDate(notif.timestamp)}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  mb: 3,
                  p: 3,
                  bgcolor: "var(--surface-tint)",
                  borderRadius: 2,
                  border: "1px solid var(--surface-light)",
                }}
              >
                <Typography
                  variant="h6"
                  color="white"
                  gutterBottom
                  fontWeight={600}
                >
                  Tri-Party Agreement Members
                </Typography>
                <Box sx={{ display: "flex", gap: 3, mt: 3 }}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      bgcolor: "var(--color-lime-muted)",
                      borderRadius: 2,
                      border: "1px solid var(--color-lime-border)",
                    }}
                  >
                    <Chip
                      label="Farmer"
                      size="small"
                      sx={{
                        bgcolor: "var(--color-lime)",
                        color: "white",
                        fontWeight: 700,
                        mb: 2,
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src={project.farmerImage}
                        sx={{
                          width: 56,
                          height: 56,
                          border: "2px solid var(--color-lime)",
                        }}
                      />
                      <Box>
                        <Typography variant="h6" color="white" fontWeight={600}>
                          {project.farmerName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="var(--text-on-dark)"
                        >
                          ID: {project.farmerId || "FAR-234"}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="var(--text-on-dark)"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <LocationOn sx={{ fontSize: 16 }} /> {project.location}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      bgcolor: "var(--color-info-blue-muted)",
                      borderRadius: 2,
                      border: "1px solid var(--color-info-blue-border)",
                    }}
                  >
                    <Chip
                      label="Investor"
                      size="small"
                      sx={{
                        bgcolor: "var(--color-info-blue)",
                        color: "white",
                        fontWeight: 700,
                        mb: 2,
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src="https://media.licdn.com/dms/image/v2/D5603AQF7Qr6f1Gapug/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1704052697627?e=2147483647&v=beta&t=5lFwZUSaC8-lmnuNau2_IiprSNOENhJuVwTbRH6Q5mU"
                        sx={{
                          width: 56,
                          height: 56,
                          border: "2px solid var(--color-info-blue)",
                        }}
                      />
                      <Box>
                        <Typography variant="h6" color="white" fontWeight={600}>
                          {user?.fullName || user?.firstName || "You"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="var(--text-on-dark)"
                        >
                          ID:{" "}
                          {user?._id
                            ? `INV-${user._id.slice(-6).toUpperCase()}`
                            : "INV-USER"}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="var(--text-on-dark)"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <BusinessCenter sx={{ fontSize: 16 }} /> Primary Investor
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      bgcolor: "var(--color-orange-muted)",
                      borderRadius: 2,
                      border: "1px solid var(--color-orange-border)",
                    }}
                  >
                    <Chip
                      label="Landowner"
                      size="small"
                      sx={{
                        bgcolor: "var(--color-orange)",
                        color: "white",
                        fontWeight: 700,
                        mb: 2,
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: "var(--color-orange)",
                          border: "2px solid var(--color-orange)",
                        }}
                      >
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" color="white" fontWeight={600}>
                          {project.landownerName || "N/A"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="var(--text-on-dark)"
                        >
                          ID: {project.landownerId || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="var(--text-on-dark)">
                      🏞️ Land Provider
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3 }}>
                <Box
                  sx={{
                    flex: 1,
                    p: 3,
                    bgcolor: "var(--surface-tint)",
                    borderRadius: 2,
                    border: "1px solid var(--surface-light)",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="white"
                    gutterBottom
                    fontWeight={600}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LocationOn /> Location Details
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", gap: 3 }}>
                    {/* Left side - Location text details */}
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="var(--text-on-dark)"
                        >
                          DISTRICT
                        </Typography>
                        <Typography
                          variant="body1"
                          color="white"
                          fontWeight={600}
                        >
                          {project.district || project.location}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="var(--text-on-dark)"
                        >
                          PROVINCE
                        </Typography>
                        <Typography
                          variant="body1"
                          color="white"
                          fontWeight={600}
                        >
                          {project.province || "Central"}
                        </Typography>
                      </Box>
                      {project.coordinates && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="var(--text-on-dark)"
                          >
                            GPS COORDINATES
                          </Typography>
                          <Typography
                            variant="body2"
                            color="var(--text-on-dark)"
                            fontFamily="monospace"
                          >
                            {project.coordinates}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Right side - Embedded Map */}
                    {project.coordinates && isLoaded && (
                      <Box
                        sx={{
                          flex: 1,
                          height: 220,
                          borderRadius: 2,
                          overflow: "hidden",
                          border: "2px solid var(--color-lime-border)",
                        }}
                      >
                        <GoogleMap
                          mapContainerStyle={{ width: "100%", height: "100%" }}
                          center={{
                            lat: parseFloat(project.coordinates.split(",")[0]),
                            lng: parseFloat(project.coordinates.split(",")[1]),
                          }}
                          zoom={13}
                          options={{
                            styles: [
                              {
                                elementType: "geometry",
                                stylers: [{ color: "#242f3e" }],
                              },
                              {
                                elementType: "labels.text.stroke",
                                stylers: [{ color: "#242f3e" }],
                              },
                              {
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#746855" }],
                              },
                              {
                                featureType: "administrative.locality",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#d59563" }],
                              },
                              {
                                featureType: "poi",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#d59563" }],
                              },
                              {
                                featureType: "poi.park",
                                elementType: "geometry",
                                stylers: [{ color: "#263c3f" }],
                              },
                              {
                                featureType: "poi.park",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#6b9a76" }],
                              },
                              {
                                featureType: "road",
                                elementType: "geometry",
                                stylers: [{ color: "#38414e" }],
                              },
                              {
                                featureType: "road",
                                elementType: "geometry.stroke",
                                stylers: [{ color: "#212a37" }],
                              },
                              {
                                featureType: "road",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#9ca5b3" }],
                              },
                              {
                                featureType: "road.highway",
                                elementType: "geometry",
                                stylers: [{ color: "#746855" }],
                              },
                              {
                                featureType: "road.highway",
                                elementType: "geometry.stroke",
                                stylers: [{ color: "#1f2835" }],
                              },
                              {
                                featureType: "road.highway",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#f3d19c" }],
                              },
                              {
                                featureType: "transit",
                                elementType: "geometry",
                                stylers: [{ color: "#2f3948" }],
                              },
                              {
                                featureType: "transit.station",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#d59563" }],
                              },
                              {
                                featureType: "water",
                                elementType: "geometry",
                                stylers: [{ color: "#17263c" }],
                              },
                              {
                                featureType: "water",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#515c6d" }],
                              },
                              {
                                featureType: "water",
                                elementType: "labels.text.stroke",
                                stylers: [{ color: "#17263c" }],
                              },
                            ],
                            disableDefaultUI: false,
                            zoomControl: true,
                            mapTypeControl: false,
                            streetViewControl: false,
                            fullscreenControl: true,
                          }}
                        >
                          <Marker
                            position={{
                              lat: parseFloat(
                                project.coordinates.split(",")[0],
                              ),
                              lng: parseFloat(
                                project.coordinates.split(",")[1],
                              ),
                            }}
                            icon={{
                              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                              fillColor: "#76c043",
                              fillOpacity: 1,
                              strokeWeight: 2,
                              strokeColor: "#ffffff",
                              scale: 2,
                            }}
                          />
                        </GoogleMap>
                      </Box>
                    )}
                  </Box>

                  {/* Button below both sections */}
                  {project.coordinates && (
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<LocationOn />}
                      onClick={() => setMapDialogOpen(true)}
                      sx={{
                        mt: 2,
                        borderColor: "var(--color-lime)",
                        color: "var(--color-lime)",
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1.5,
                        "&:hover": {
                          borderColor: "var(--color-lime-hover)",
                          bgcolor: "var(--color-lime-muted)",
                        },
                      }}
                    >
                      View All Party Locations
                    </Button>
                  )}
                </Box>

                {/* Risk Assessment */}
                <Box
                  sx={{
                    flex: 1,
                    p: 3,
                    bgcolor: "var(--surface-tint)",
                    borderRadius: 2,
                    border: "1px solid var(--surface-light)",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="white"
                    gutterBottom
                    fontWeight={600}
                  >
                    ⚠️ Risk Assessment
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={`Risk Level: ${project.riskLevel || "LOW"}`}
                      sx={{
                        bgcolor: getRiskColor(),
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        px: 2,
                        py: 2.5,
                      }}
                    />
                    <Box sx={{ mt: 2 }}>
                      {(project.riskStatus || "No Issues") === "No Issues" ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CheckCircle
                            sx={{ color: "var(--color-lime)", fontSize: 24 }}
                          />
                          <Typography
                            variant="body1"
                            color="var(--color-lime)"
                            fontWeight={600}
                          >
                            No Issues Detected
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <WarningAmber
                            sx={{ color: "var(--color-amber)", fontSize: 24 }}
                          />
                          <Typography
                            variant="body1"
                            color="var(--color-amber)"
                            fontWeight={600}
                          >
                            {project.riskStatus}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Milestones Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography
                variant="h5"
                color="white"
                gutterBottom
                fontWeight={600}
                sx={{ mb: 3 }}
              >
                Project Milestones & Progress Tracking
              </Typography>
              {project.milestones && project.milestones.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {project.milestones.map((milestone, index) => (
                    <Box
                      key={milestone.id}
                      sx={{
                        p: 3,
                        bgcolor: "var(--surface-tint)",
                        borderRadius: 2,
                        border: "1px solid var(--surface-light)",
                        borderLeft: `4px solid ${getMilestoneStatusColor(milestone.status)}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="white"
                              fontWeight={600}
                            >
                              {index + 1}. {milestone.title}
                            </Typography>
                            <Chip
                              label={milestone.status
                                .replace("-", " ")
                                .toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: getMilestoneStatusColor(
                                  milestone.status,
                                ),
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            color="var(--text-on-dark)"
                            sx={{ mb: 2 }}
                          >
                            {milestone.description}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                            <Box>
                              <Typography
                                variant="caption"
                                color="var(--text-on-dark)"
                              >
                                START DATE
                              </Typography>
                              <Typography variant="body2" color="white">
                                {formatDate(milestone.startDate)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="caption"
                                color="var(--text-on-dark)"
                              >
                                END DATE
                              </Typography>
                              <Typography variant="body2" color="white">
                                {formatDate(milestone.endDate)}
                              </Typography>
                            </Box>
                            {milestone.completedDate && (
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="var(--text-on-dark)"
                                >
                                  COMPLETED
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="var(--color-lime)"
                                  fontWeight={600}
                                >
                                  {formatDate(milestone.completedDate)}
                                </Typography>
                              </Box>
                            )}
                            <Box>
                              <Typography
                                variant="caption"
                                color="var(--text-on-dark)"
                              >
                                PAYMENT
                              </Typography>
                              <Typography
                                variant="body2"
                                color="var(--color-lime)"
                                fontWeight={600}
                              >
                                {formatCurrency(milestone.payment)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="var(--text-on-dark)"
                          >
                            Progress: {milestone.tasks.completed}/
                            {milestone.tasks.total} tasks completed
                          </Typography>
                          <Typography
                            variant="body2"
                            color="white"
                            fontWeight={600}
                          >
                            {milestone.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={milestone.progress}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "var(--surface-light)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 5,
                              backgroundColor: getMilestoneStatusColor(
                                milestone.status,
                              ),
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="var(--text-on-dark)">
                  No milestone data available
                </Typography>
              )}
            </Box>
          )}

          {/* Payments Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography
                variant="h5"
                color="white"
                gutterBottom
                fontWeight={600}
                sx={{ mb: 3 }}
              >
                Payment Schedule & Financial Breakdown
              </Typography>

              {/* Financial Breakdown - Auto-Calculated */}
              {calculatedBudgetBreakdown.length > 0 && (
                <Box
                  sx={{
                    mb: 4,
                    p: 3,
                    bgcolor: "var(--surface-tint)",
                    borderRadius: 2,
                    border: "1px solid var(--surface-light)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" color="white" fontWeight={600}>
                      💵 Budget Breakdown by Category
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="caption" color="var(--text-on-dark)">
                        Total Budget:{" "}
                        {formatCurrency(
                          calculatedBudgetBreakdown[0]?.calculatedTotal || 0,
                        )}
                      </Typography>
                      {calculatedBudgetBreakdown.length > 4 && (
                        <Button
                          size="small"
                          endIcon={
                            budgetExpanded ? <ExpandLess /> : <ExpandMore />
                          }
                          onClick={() => setBudgetExpanded(!budgetExpanded)}
                          sx={{
                            color: "var(--color-lime)",
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          {budgetExpanded
                            ? "View Less"
                            : `View All (${calculatedBudgetBreakdown.length})`}
                        </Button>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                    }}
                  >
                    {(budgetExpanded
                      ? calculatedBudgetBreakdown
                      : calculatedBudgetBreakdown.slice(0, 4)
                    ).map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="white"
                            fontWeight={500}
                          >
                            {item.category}
                          </Typography>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="body1"
                              color="white"
                              fontWeight={700}
                            >
                              {formatCurrency(item.amount)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="var(--text-on-dark)"
                            >
                              {item.percentage}% of total
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ position: "relative" }}>
                          <LinearProgress
                            variant="determinate"
                            value={item.percentage}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: "var(--surface-light)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 5,
                                backgroundColor: getCategoryColor(
                                  index,
                                  item.percentage,
                                ),
                                transition:
                                  "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                              },
                            }}
                          />
                          {item.percentage >= 15 && (
                            <Typography
                              variant="caption"
                              sx={{
                                position: "absolute",
                                right: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "white",
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                textShadow: "0 1px 2px var(--overlay-lg)",
                              }}
                            >
                              {item.percentage}%
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  {!budgetExpanded && calculatedBudgetBreakdown.length > 4 && (
                    <Box
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid var(--surface-light)",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="caption" color="var(--text-on-dark)">
                        Showing top 4 categories •{" "}
                        {calculatedBudgetBreakdown.length - 4} more categories
                        available
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Payment Schedule (Investor view only) */}
              {!isLandownerView &&
                (project.payments && project.payments.length > 0 ? (
                  <Box>
                    <Typography
                      variant="h6"
                      color="white"
                      gutterBottom
                      fontWeight={600}
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Payment /> Payment Installments
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {project.payments.map((payment) => {
                        const daysRemaining = getDaysRemaining(payment.dueDate);
                        // Determine actual display status: if pending and overdue, show as overdue
                        const displayStatus =
                          payment.status === "pending" && daysRemaining < 0
                            ? "overdue"
                            : payment.status;

                        return (
                          <Box
                            key={payment.id}
                            sx={{
                              p: 2.5,
                              bgcolor: "var(--bg-elevated)",
                              borderRadius: 2,
                              border: "1px solid var(--border-subtle)",
                              borderLeft: `4px solid ${getPaymentStatusColor(displayStatus)}`,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    color="white"
                                    fontWeight={600}
                                  >
                                    {payment.description}
                                  </Typography>
                                  <Chip
                                    label={displayStatus.toUpperCase()}
                                    size="small"
                                    sx={{
                                      bgcolor:
                                        getPaymentStatusColor(displayStatus),
                                      color: "white",
                                      fontWeight: 600,
                                      fontSize: "0.75rem",
                                    }}
                                  />
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 4,
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="var(--text-on-dark)"
                                  >
                                    <CalendarToday
                                      sx={{
                                        fontSize: 14,
                                        mr: 0.5,
                                        verticalAlign: "middle",
                                      }}
                                    />
                                    Due: {formatDate(payment.dueDate)}
                                  </Typography>
                                  {payment.paidDate && (
                                    <Typography
                                      variant="body2"
                                      color="var(--color-lime)"
                                    >
                                      <CheckCircle
                                        sx={{
                                          fontSize: 14,
                                          mr: 0.5,
                                          verticalAlign: "middle",
                                        }}
                                      />
                                      Paid: {formatDate(payment.paidDate)}
                                    </Typography>
                                  )}
                                  {payment.status === "pending" &&
                                    daysRemaining >= 0 && (
                                      <Typography
                                        variant="body2"
                                        color="var(--color-amber)"
                                      >
                                        <AccessTime
                                          sx={{
                                            fontSize: 14,
                                            mr: 0.5,
                                            verticalAlign: "middle",
                                          }}
                                        />
                                        {daysRemaining} days remaining
                                      </Typography>
                                    )}
                                  {displayStatus === "overdue" && (
                                    <Typography
                                      variant="body2"
                                      color="var(--color-overdue)"
                                    >
                                      <WarningAmber
                                        sx={{
                                          fontSize: 14,
                                          mr: 0.5,
                                          verticalAlign: "middle",
                                        }}
                                      />
                                      {Math.abs(daysRemaining)} days overdue
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                              <Typography
                                variant="h6"
                                color="white"
                                fontWeight={700}
                              >
                                {formatCurrency(payment.amount)}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Commission Earnings Summary for Commission-Based Projects */}
                    {project.investmentType === "commission" &&
                      project.earnedCommission !== undefined &&
                      project.earnedCommission > 0 && (
                        <Box
                          sx={{
                            p: 2.5,
                            bgcolor: "var(--surface-tint)",
                            borderRadius: 2,
                            border: "1px solid var(--surface-light)",
                            borderLeft: `4px solid var(--color-lime)`,
                            mt: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="white"
                                  fontWeight={600}
                                >
                                  Commission Earned
                                </Typography>
                                <Chip
                                  label={`${project.commissionRate}% RATE`}
                                  size="small"
                                  sx={{
                                    bgcolor: "var(--color-lime)",
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                  }}
                                />
                                <Chip
                                  label="INVESTOR INCOME"
                                  size="small"
                                  sx={{
                                    bgcolor: "var(--color-lime)",
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                color="var(--text-on-dark)"
                              >
                                Based on {project.commissionRate}% of harvest
                                revenue •{" "}
                                {project.status === "completed"
                                  ? "Final amount"
                                  : "Projected earnings"}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h6"
                              color="var(--color-lime)"
                              fontWeight={700}
                            >
                              {formatCurrency(project.earnedCommission)}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                  </Box>
                ) : (
                  <Typography variant="body1" color="var(--text-on-dark)">
                    No payment data available
                  </Typography>
                ))}

              {/* Land Rental Section */}
              {project.landRentals && project.landRentals.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    color="white"
                    gutterBottom
                    fontWeight={600}
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Landscape sx={{ color: "var(--color-orange)" }} />{" "}
                    {isLandownerView
                      ? "Landowner Rental Receivables"
                      : "Landowner Rental Payments"}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {project.landRentals.map((rental) => {
                      const daysRemaining = getDaysRemaining(rental.dueDate);
                      const displayStatus =
                        rental.status === "pending" && daysRemaining < 0
                          ? "overdue"
                          : rental.status;

                      return (
                        <Box
                          key={rental.id}
                          sx={{
                            p: 2.5,
                            bgcolor: "var(--bg-elevated)",
                            borderRadius: 2,
                            border: "1px solid var(--color-orange-border)",
                            borderLeft: `4px solid ${getPaymentStatusColor(displayStatus)}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="white"
                                  fontWeight={600}
                                >
                                  {rental.month} — Land Rent
                                </Typography>
                                <Chip
                                  label={
                                    isLandownerView && displayStatus === "paid"
                                      ? "RECEIVED"
                                      : displayStatus.toUpperCase()
                                  }
                                  size="small"
                                  sx={{
                                    bgcolor:
                                      getPaymentStatusColor(displayStatus),
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 4,
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="var(--text-on-dark)"
                                >
                                  <Landscape
                                    sx={{
                                      fontSize: 13,
                                      mr: 0.5,
                                      verticalAlign: "middle",
                                      color: "var(--color-orange)",
                                    }}
                                  />
                                  {rental.landArea}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="var(--text-on-dark)"
                                >
                                  <CalendarToday
                                    sx={{
                                      fontSize: 14,
                                      mr: 0.5,
                                      verticalAlign: "middle",
                                    }}
                                  />
                                  Due: {formatDate(rental.dueDate)}
                                </Typography>
                                {rental.paidDate && (
                                  <Typography
                                    variant="body2"
                                    color="var(--color-lime)"
                                  >
                                    <CheckCircle
                                      sx={{
                                        fontSize: 14,
                                        mr: 0.5,
                                        verticalAlign: "middle",
                                      }}
                                    />
                                    Received: {formatDate(rental.paidDate)}
                                  </Typography>
                                )}
                                {displayStatus === "overdue" && (
                                  <Typography
                                    variant="body2"
                                    color="var(--color-overdue)"
                                  >
                                    <WarningAmber
                                      sx={{
                                        fontSize: 14,
                                        mr: 0.5,
                                        verticalAlign: "middle",
                                      }}
                                    />
                                    {Math.abs(getDaysRemaining(rental.dueDate))}{" "}
                                    days overdue
                                  </Typography>
                                )}
                                {displayStatus === "pending" &&
                                  daysRemaining >= 0 && (
                                    <Typography
                                      variant="body2"
                                      color="var(--color-amber)"
                                    >
                                      <AccessTime
                                        sx={{
                                          fontSize: 14,
                                          mr: 0.5,
                                          verticalAlign: "middle",
                                        }}
                                      />
                                      {daysRemaining} days until due
                                    </Typography>
                                  )}
                              </Box>
                            </Box>
                            <Typography
                              variant="h6"
                              color="white"
                              fontWeight={700}
                            >
                              LKR {rental.amount.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h5"
                  color="white"
                  gutterBottom
                  fontWeight={600}
                >
                  Project Team Members
                </Typography>
                {project.coordinates && (
                  <Button
                    variant="contained"
                    startIcon={<LocationOn />}
                    onClick={() => setMapDialogOpen(true)}
                    sx={{
                      bgcolor: "var(--color-lime)",
                      color: "white",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "var(--color-lime-hover)",
                      },
                    }}
                  >
                    View Location Map
                  </Button>
                )}
              </Box>
              {teamMembersForView.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {
                    <Box
                      sx={{
                        p: 3,
                        bgcolor: "var(--color-info-blue-muted)",
                        borderRadius: 2,
                        border: "2px solid var(--color-info-blue-border)",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 3 }}>
                        <Avatar
                          src="https://media.licdn.com/dms/image/v2/D5603AQF7Qr6f1Gapug/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1704052697627?e=2147483647&v=beta&t=5lFwZUSaC8-lmnuNau2_IiprSNOENhJuVwTbRH6Q5mU"
                          sx={{
                            width: 80,
                            height: 80,
                            border: "3px solid var(--color-info-blue)",
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="white"
                              fontWeight={600}
                            >
                              {user?.fullName || user?.firstName || "You"}
                            </Typography>
                            <Chip
                              label="INVESTOR (YOU)"
                              size="small"
                              sx={{
                                bgcolor: "var(--color-info-blue)",
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            color="var(--text-on-dark)"
                            sx={{ mb: 2 }}
                          >
                            ID:{" "}
                            {user?._id
                              ? `INV-${user._id.slice(-6).toUpperCase()}`
                              : "INV-USER"}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                            {user?.email && (
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="var(--text-on-dark)"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Email sx={{ fontSize: 14 }} /> EMAIL
                                </Typography>
                                <Typography variant="body2" color="white">
                                  {user.email}
                                </Typography>
                              </Box>
                            )}
                            {user?.phoneNumber && (
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="var(--text-on-dark)"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Phone sx={{ fontSize: 14 }} /> PHONE
                                </Typography>
                                <Typography variant="body2" color="white">
                                  {user.phoneNumber}
                                </Typography>
                              </Box>
                            )}
                            {user?.address && (
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="var(--text-on-dark)"
                                >
                                  LOCATION
                                </Typography>
                                <Typography variant="body2" color="white">
                                  {user.address}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="var(--text-on-dark)"
                            >
                              ROLE
                            </Typography>
                            <Typography variant="body2" color="white">
                              Primary Investor - Agricultural Investment
                              Portfolio
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  }

                  {/* Other Team Members */}
                  {teamMembersForView.map((member) => (
                    <Box
                      key={member.id}
                      sx={{
                        p: 3,
                        bgcolor: "var(--surface-tint)",
                        borderRadius: 2,
                        border: "1px solid var(--surface-light)",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 3 }}>
                        <Avatar
                          src={member.image}
                          sx={{
                            width: 80,
                            height: 80,
                            border: "3px solid var(--color-lime-border)",
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="white"
                              fontWeight={600}
                            >
                              {member.name}
                            </Typography>
                            <Chip
                              label={member.role.toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor:
                                  member.role === "farmer"
                                    ? "var(--color-lime)"
                                    : member.role === "investor"
                                      ? "var(--color-info-blue)"
                                      : "var(--color-orange)",
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                            {member.rating && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Star
                                  sx={{
                                    fontSize: 16,
                                    color: "var(--color-amber)",
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="var(--color-amber)"
                                >
                                  {member.rating.toFixed(1)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <Typography
                            variant="body2"
                            color="var(--text-on-dark)"
                            sx={{ mb: 2 }}
                          >
                            ID: {member.id}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                            <Box>
                              <Typography
                                variant="caption"
                                color="var(--text-on-dark)"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Email sx={{ fontSize: 14 }} /> EMAIL
                              </Typography>
                              <Typography variant="body2" color="white">
                                {member.email}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="caption"
                                color="var(--text-on-dark)"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Phone sx={{ fontSize: 14 }} /> PHONE
                              </Typography>
                              <Typography variant="body2" color="white">
                                {member.phone}
                              </Typography>
                            </Box>
                            {member.location && (
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="var(--text-on-dark)"
                                >
                                  LOCATION
                                </Typography>
                                <Typography variant="body2" color="white">
                                  {member.location}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          {member.specialization && (
                            <Box>
                              <Typography
                                variant="caption"
                                color="var(--text-on-dark)"
                              >
                                SPECIALIZATION
                              </Typography>
                              <Typography variant="body2" color="white">
                                {member.specialization}
                              </Typography>
                            </Box>
                          )}
                          {member.experience && (
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="caption"
                                color="var(--text-on-dark)"
                              >
                                EXPERIENCE
                              </Typography>
                              <Typography variant="body2" color="white">
                                {member.experience}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="var(--text-on-dark)">
                  No team member data available
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <Divider sx={{ borderColor: "var(--surface-light)" }} />

        <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "var(--surface-light)",
              textTransform: "none",
              px: 3,
              "&:hover": {
                borderColor: "var(--surface-light)",
                bgcolor: "var(--surface-muted)",
              },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "var(--color-lime)",
              color: "white",
              textTransform: "none",
              px: 4,
              fontWeight: 600,
              "&:hover": {
                bgcolor: "var(--color-lime-hover)",
              },
            }}
          >
            Download Full Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Location Map Dialog - Separate from main dialog */}
      {project.partyMembers && project.coordinates && (
        <LocationMapDialog
          open={mapDialogOpen}
          onClose={() => setMapDialogOpen(false)}
          partyMembers={project.partyMembers}
          projectLocation={project.location}
          coordinates={project.coordinates}
          district={project.district || ""}
          province={project.province || ""}
        />
      )}
    </>
  );
};

export default ProjectDetailsDialog;
