import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Close as CloseIcon,
  CalendarToday,
  AttachMoney,
  Flag,
  Notifications,
  Email,
  Phone,
  LocationOn,
  Star,
  Download,
} from "@mui/icons-material";

interface ProjectDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  hideTeamAndAgreement?: boolean;
  project?: {
    id: number | string;
    name: string;
    projectId?: string;
    status: string;
    startDate: string;
    endDate?: string;
    expiryDate?: string;
    progress: number;
    budget: number;
    expectedROI: number;
    investmentType: string;
    expectedHarvest?: number;
    commissionPercentage?: number;
    description?: string;
    farmingMethods?: string;
    preferredRegions?: string[];
    location?: string;
    farmerName?: string;
    landownerName?: string;
    landAvailability?: "with_land" | "without_land";
    landSize?: number;
    landLocation?: string;
    costBreakdown?: Array<{
      category: string;
      description?: string;
      amount: number;
    }>;
    milestoneBreakdown?: Array<{
      milestone: string;
      description?: string;
      estimatedAmount: number;
    }>;
    teamMembers?: Array<{
      id: string;
      name: string;
      role: "INVESTOR" | "FARMER" | "LANDOWNER";
      email?: string;
      phone?: string;
      location?: string;
      avatar?: string;
      isCurrentUser?: boolean;
      rating?: number | null;
      roleDescription?: string;
      specialization?: string;
      experience?: string;
    }>;
  } | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const breakdownColorPalette = [
  "#ff6b35",
  "#f9a825",
  "#ff9800",
  "#4CAF50",
  "#26a69a",
  "#29b6f6",
  "#ab47bc",
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("LKR", "LKR ");
};

const formatDisplayDate = (value?: string | null) => {
  if (!value) {
    return "—";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ProjectDetailsDialog = ({
  open,
  onClose,
  hideTeamAndAgreement = false,
  project,
}: ProjectDetailsDialogProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "IN_PROGRESS":
        return "success";
      case "IN REVIEW":
      case "IN_REVIEW":
        return "warning";
      case "COMPLETED":
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "INVESTOR":
        return "#2196F3";
      case "FARMER":
        return "#4CAF50";
      case "LANDOWNER":
        return "#ff9800";
      default:
        return "#757575";
    }
  };

  // Use project data or defaults
  const projectData = project || {
    id: "PRJ-156",
    name: "Premium Rice Cultivation",
    projectId: "PRJ-156",
    status: "ACTIVE",
    startDate: "Nov 15, 2025",
    endDate: "Apr 30, 2026",
    expiryDate: "Apr 30, 2026",
    progress: 74,
    budget: 250500,
    expectedROI: 28,
    investmentType: "Harvest-Based",
    expectedHarvest: undefined,
    commissionPercentage: undefined,
    description: "",
    farmingMethods: "",
    preferredRegions: undefined,
    location: "Not specified",
    farmerName: "Current Farmer",
    landownerName: undefined,
    landAvailability: "without_land" as const,
    landSize: undefined,
    landLocation: undefined,
    costBreakdown: undefined,
    milestoneBreakdown: undefined,
    teamMembers: undefined,
  };

  const isCommissionBased = projectData.investmentType
    .toLowerCase()
    .includes("commission");
  const showHarvestOnlySections = !isCommissionBased;
  const showTeamAndAgreement = !hideTeamAndAgreement;

  const totalTabs =
    1 + (showHarvestOnlySections ? 2 : 0) + (showTeamAndAgreement ? 2 : 0);

  const milestonesTabIndex = 1;
  const paymentsTabIndex = 2;
  const teamMembersTabIndex = showHarvestOnlySections ? 3 : 1;
  const agreementTabIndex = showHarvestOnlySections ? 4 : 2;

  useEffect(() => {
    if (activeTab >= totalTabs) {
      setActiveTab(0);
    }
  }, [activeTab, totalTabs]);

  useEffect(() => {
    if (open) {
      setActiveTab(0);
    }
  }, [open, project?.id, showHarvestOnlySections, showTeamAndAgreement]);

  const budgetBreakdown = projectData.costBreakdown?.length
    ? projectData.costBreakdown
        .filter((category) => category.amount > 0)
        .map((category, index) => ({
          name: category.category,
          description: category.description,
          amount: category.amount,
          color: breakdownColorPalette[index % breakdownColorPalette.length],
        }))
    : [];

  const totalBudget = budgetBreakdown.reduce(
    (total, category) => total + category.amount,
    0,
  );

  const effectiveBudget = totalBudget > 0 ? totalBudget : projectData.budget;

  const budgetBreakdownWithPercentages = budgetBreakdown.map((category) => ({
    ...category,
    percentage:
      effectiveBudget > 0
        ? Math.round((category.amount / effectiveBudget) * 100)
        : 0,
  }));

  const projectMilestones = projectData.milestoneBreakdown?.length
    ? projectData.milestoneBreakdown
        .filter((milestone) => milestone.estimatedAmount > 0)
        .map((milestone, index) => {
          const isCompleted = projectData.status === "COMPLETED";
          const endDate = projectData.endDate || projectData.expiryDate;

          return {
            id: index + 1,
            title: milestone.milestone,
            description:
              milestone.description ||
              "Milestone details provided by the farmer.",
            status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
            startDate: formatDisplayDate(projectData.startDate),
            endDate: formatDisplayDate(endDate),
            completedDate: isCompleted ? formatDisplayDate(endDate) : null,
            payment: milestone.estimatedAmount,
            progress: isCompleted ? 100 : Math.min(projectData.progress, 95),
            tasksCompleted: isCompleted ? 1 : 0,
            totalTasks: 1,
          };
        })
    : [];

  const paymentSchedule = projectMilestones.map((milestone) => ({
    id: milestone.id,
    milestone: `Milestone ${milestone.id}: ${milestone.title}`,
    amount: milestone.payment,
    status: milestone.status === "COMPLETED" ? "PAID" : "PENDING",
    dueDate: milestone.endDate,
    paidDate: milestone.completedDate,
  }));

  const teamMembers = projectData.teamMembers?.length
    ? projectData.teamMembers
    : [
        {
          id: `FAR-${projectData.id}`,
          name: projectData.farmerName || "Current Farmer",
          role: "FARMER" as const,
          isCurrentUser: true,
          location: projectData.landLocation || projectData.location,
          avatar: "",
        },
        ...(projectData.landownerName
          ? [
              {
                id: `LND-${projectData.id}`,
                name: projectData.landownerName,
                role: "LANDOWNER" as const,
                location: projectData.landLocation || projectData.location,
                avatar: "",
              },
            ]
          : []),
      ];

  const investorMember = teamMembers.find(
    (member) => member.role === "INVESTOR",
  );
  const farmerMember = teamMembers.find((member) => member.role === "FARMER");
  const disbursedAmount = Math.min(
    Math.round(projectData.budget * 0.55),
    projectData.budget,
  );
  const remainingBalance = projectData.budget - disbursedAmount;
  const totalMilestones = projectMilestones.length;
  const completedMilestones = projectMilestones.filter(
    (milestone) => milestone.status === "COMPLETED",
  ).length;
  const pendingMilestones = Math.max(totalMilestones - completedMilestones, 0);
  const completionRate =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;
  const disbursedPercentage =
    projectData.budget > 0 ? (disbursedAmount / projectData.budget) * 100 : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#0a0f0a",
          backgroundImage: "none",
          border: "1px solid rgba(76, 175, 80, 0.2)",
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ color: "#fff", fontWeight: 600, mb: 0.5 }}
            >
              {projectData.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: "#808080" }}>
                {projectData.projectId}
              </Typography>
              <Chip
                label={projectData.status}
                size="small"
                color={getStatusColor(projectData.status)}
                sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarToday sx={{ fontSize: 14, color: "#808080" }} />
                <Typography variant="body2" sx={{ color: "#808080" }}>
                  Started {projectData.startDate}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#808080" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mt: 2,
            "& .MuiTabs-indicator": {
              backgroundColor: "#6B8E23",
            },
            "& .MuiTab-root": {
              color: "#808080",
              textTransform: "none",
              fontWeight: 500,
              "&.Mui-selected": {
                color: "#fff",
              },
            },
          }}
        >
          <Tab label="Overview" />
          {showHarvestOnlySections && <Tab label="Milestones & Progress" />}
          {showHarvestOnlySections && <Tab label="Payments & Finance" />}
          {showTeamAndAgreement && <Tab label="Team Members" />}
          {showTeamAndAgreement && <Tab label="Agreement" />}
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ px: 3 }}>
            {showHarvestOnlySections ? (
              <>
                {/* Overall Progress */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: "1px solid rgba(107, 142, 35, 0.3)",
                    backgroundColor: "rgba(107, 142, 35, 0.05)",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1.5,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#808080",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Overall Project Progress
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ color: "#fff", fontWeight: 600 }}
                      >
                        {projectData.progress}% Complete
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="caption" sx={{ color: "#808080" }}>
                        Expected Completion
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#fff", fontWeight: 500 }}
                      >
                        {projectData.endDate}
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={projectData.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#6B8E23",
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {/* Financial Summary & Milestone Status */}
                <div className="row g-3">
                  {/* Financial Summary */}
                  <div className="col-12 col-md-6">
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        backgroundColor: "#111a11",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <AttachMoney sx={{ color: "#fff", fontSize: 20 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#fff", fontWeight: 600 }}
                        >
                          Financial Summary
                        </Typography>
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Total Investment
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "#fff", fontWeight: 600, mb: 2 }}
                      >
                        {formatCurrency(projectData.budget)}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Disbursed Amount
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#4CAF50", fontWeight: 600, mb: 0.5 }}
                      >
                        {formatCurrency(disbursedAmount)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={disbursedPercentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          mb: 2,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#4CAF50",
                            borderRadius: 3,
                          },
                        }}
                      />

                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Remaining Balance
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#ff9800", fontWeight: 600, mb: 2 }}
                      >
                        {formatCurrency(remainingBalance)}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Expected ROI
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "#4CAF50", fontWeight: 600, mb: 2 }}
                      >
                        {projectData.expectedROI}%
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Investment Details
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          icon={<AttachMoney sx={{ fontSize: 14 }} />}
                          label={projectData.investmentType}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255, 152, 0, 0.15)",
                            color: "#ff9800",
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    </Box>
                  </div>

                  {/* Milestone Status */}
                  <div className="col-12 col-md-6">
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        backgroundColor: "#111a11",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Flag sx={{ color: "#ff6b35", fontSize: 20 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#fff", fontWeight: 600 }}
                        >
                          Milestone Status
                        </Typography>
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Total Milestones
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ color: "#fff", fontWeight: 600, mb: 2 }}
                      >
                        {totalMilestones}
                      </Typography>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 1,
                              backgroundColor: "rgba(76, 175, 80, 0.15)",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#4CAF50",
                                textTransform: "uppercase",
                              }}
                            >
                              Completed
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{ color: "#4CAF50", fontWeight: 600 }}
                            >
                              {completedMilestones}
                            </Typography>
                          </Box>
                        </div>
                        <div className="col-6">
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 1,
                              backgroundColor: "rgba(139, 119, 42, 0.25)",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#c9a227",
                                textTransform: "uppercase",
                              }}
                            >
                              Pending
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{ color: "#c9a227", fontWeight: 600 }}
                            >
                              {pendingMilestones}
                            </Typography>
                          </Box>
                        </div>
                      </div>

                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Completion Rate
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={completionRate}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          mt: 1,
                          mb: 0.5,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#6B8E23",
                            borderRadius: 4,
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#808080" }}>
                        {completionRate}% Complete
                      </Typography>
                    </Box>
                  </div>
                </div>

                {/* Latest Notifications */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: "#111a11",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Notifications sx={{ color: "#ff9800", fontSize: 20 }} />
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#fff", fontWeight: 600 }}
                    >
                      Latest Notifications
                    </Typography>
                    <Chip
                      label="3"
                      size="small"
                      sx={{
                        backgroundColor: "#ff6b35",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: 20,
                        minWidth: 20,
                      }}
                    />
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid rgba(33, 150, 243, 0.3)",
                  backgroundColor: "rgba(33, 150, 243, 0.06)",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#fff", fontWeight: 600, mb: 1.5 }}
                >
                  Commission Offer Overview
                </Typography>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{ color: "#808080", textTransform: "uppercase" }}
                    >
                      Commission Rate
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#29b6f6", fontWeight: 600 }}
                    >
                      {projectData.commissionPercentage ??
                        projectData.expectedROI}
                      %
                    </Typography>
                  </div>
                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{ color: "#808080", textTransform: "uppercase" }}
                    >
                      Expected ROI
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#4CAF50", fontWeight: 600 }}
                    >
                      {projectData.expectedROI}%
                    </Typography>
                  </div>
                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{ color: "#808080", textTransform: "uppercase" }}
                    >
                      Land Availability
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#fff", fontWeight: 500 }}
                    >
                      {projectData.landAvailability === "with_land"
                        ? "With Land"
                        : "Without Land"}
                    </Typography>
                  </div>
                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{ color: "#808080", textTransform: "uppercase" }}
                    >
                      Preferred Regions
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#fff", fontWeight: 500 }}
                    >
                      {projectData.preferredRegions?.length
                        ? projectData.preferredRegions.join(", ")
                        : projectData.location || "Not specified"}
                    </Typography>
                  </div>
                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{ color: "#808080", textTransform: "uppercase" }}
                    >
                      Farming Method
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#fff",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {projectData.farmingMethods || "Not specified"}
                    </Typography>
                  </div>
                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{ color: "#808080", textTransform: "uppercase" }}
                    >
                      Budget
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#fff", fontWeight: 500 }}
                    >
                      {formatCurrency(projectData.budget)}
                    </Typography>
                  </div>
                  <div className="col-12">
                    <Typography
                      variant="caption"
                      sx={{ color: "#808080", textTransform: "uppercase" }}
                    >
                      Description
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#b0b0b0", mt: 0.4 }}
                    >
                      {projectData.description ||
                        "No description available for this project."}
                    </Typography>
                  </div>
                </div>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Milestones & Progress Tab */}
        {showHarvestOnlySections && (
          <TabPanel value={activeTab} index={milestonesTabIndex}>
            <Box sx={{ px: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#fff", fontWeight: 600, mb: 3 }}
              >
                Project Milestones & Progress Tracking
              </Typography>

              {projectMilestones.length === 0 ? (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: "#111a11",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    No milestone data available for this project.
                  </Typography>
                </Box>
              ) : (
                projectMilestones.map((milestone) => (
                  <Box
                    key={milestone.id}
                    sx={{
                      p: 2.5,
                      mb: 2,
                      borderRadius: 2,
                      border: "1px solid rgba(107, 142, 35, 0.3)",
                      borderLeft: "4px solid #6B8E23",
                      backgroundColor: "#111a11",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "#fff", fontWeight: 600 }}
                      >
                        {milestone.id}. {milestone.title}
                      </Typography>
                      <Chip
                        label={milestone.status.replace("_", " ")}
                        size="small"
                        color={getStatusColor(milestone.status)}
                        sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22 }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ color: "#b0b0b0", mb: 2 }}
                    >
                      {milestone.description}
                    </Typography>

                    <div className="row g-3 mb-2">
                      <div className="col-auto">
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#808080",
                            textTransform: "uppercase",
                            display: "block",
                          }}
                        >
                          Start Date
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff" }}>
                          {milestone.startDate}
                        </Typography>
                      </div>
                      <div className="col-auto">
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#808080",
                            textTransform: "uppercase",
                            display: "block",
                          }}
                        >
                          End Date
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff" }}>
                          {milestone.endDate}
                        </Typography>
                      </div>
                      {milestone.completedDate && (
                        <div className="col-auto">
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#808080",
                              textTransform: "uppercase",
                              display: "block",
                            }}
                          >
                            Completed
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#4CAF50" }}>
                            {milestone.completedDate}
                          </Typography>
                        </div>
                      )}
                      <div className="col-auto">
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#808080",
                            textTransform: "uppercase",
                            display: "block",
                          }}
                        >
                          Payment
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#4CAF50" }}>
                          {formatCurrency(milestone.payment)}
                        </Typography>
                      </div>
                    </div>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#808080" }}>
                        Progress: {milestone.tasksCompleted}/
                        {milestone.totalTasks} tasks completed
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#fff", fontWeight: 500 }}
                      >
                        {milestone.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={milestone.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        mt: 1,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#6B8E23",
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                ))
              )}
            </Box>
          </TabPanel>
        )}

        {/* Payments & Finance Tab */}
        {showHarvestOnlySections && (
          <TabPanel value={activeTab} index={paymentsTabIndex}>
            <Box sx={{ px: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#fff", fontWeight: 600, mb: 3 }}
              >
                Payment Schedule & Financial Breakdown
              </Typography>

              {/* Budget Breakdown */}
              <Box
                sx={{
                  p: 2.5,
                  mb: 3,
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backgroundColor: "#111a11",
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        background: "linear-gradient(135deg, #ff6b35, #4CAF50)",
                        borderRadius: 0.5,
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#fff", fontWeight: 600 }}
                    >
                      Cost Breakdown by Category
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#808080" }}>
                    Total Budget: {formatCurrency(effectiveBudget)}
                  </Typography>
                </Box>

                {budgetBreakdownWithPercentages.length === 0 ? (
                  <Typography variant="body2" sx={{ color: "#808080", mt: 1 }}>
                    No cost breakdown data available for this project.
                  </Typography>
                ) : (
                  <>
                    {budgetBreakdownWithPercentages.map((category, index) => (
                      <Box key={index} sx={{ mb: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#fff" }}>
                            {category.name}
                          </Typography>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="body2"
                              sx={{ color: "#fff", fontWeight: 600 }}
                            >
                              {formatCurrency(category.amount)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#808080" }}
                            >
                              {category.percentage}% of total
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ position: "relative" }}>
                          <LinearProgress
                            variant="determinate"
                            value={category.percentage}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: category.color,
                                borderRadius: 4,
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              position: "absolute",
                              right: 0,
                              top: 12,
                              color: "#808080",
                              fontSize: "0.65rem",
                            }}
                          >
                            {category.percentage}%
                          </Typography>
                        </Box>
                      </Box>
                    ))}

                    <Typography
                      variant="body2"
                      sx={{ color: "#808080", textAlign: "center", mt: 2 }}
                    >
                      Showing {budgetBreakdownWithPercentages.length} cost item
                      {budgetBreakdownWithPercentages.length === 1
                        ? ""
                        : "s"}{" "}
                      in this project
                    </Typography>
                  </>
                )}
              </Box>

              {/* Payment Installments */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backgroundColor: "#111a11",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 14,
                        height: 10,
                        border: "2px solid #fff",
                        borderRadius: 0.5,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    Payment Installments
                  </Typography>
                </Box>

                {paymentSchedule.length === 0 ? (
                  <Typography variant="body2" sx={{ color: "#808080", mt: 1 }}>
                    No payment schedule data available for this project.
                  </Typography>
                ) : (
                  paymentSchedule.map((payment) => (
                    <Box
                      key={payment.id}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 1,
                        borderLeft: "3px solid #ff9800",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ color: "#fff", fontWeight: 500 }}
                            >
                              {payment.milestone}
                            </Typography>
                            <Chip
                              label={payment.status}
                              size="small"
                              color={getStatusColor(payment.status)}
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.65rem",
                                height: 20,
                              }}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <CalendarToday
                                sx={{ fontSize: 12, color: "#808080" }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: "#808080" }}
                              >
                                Due: {payment.dueDate}
                              </Typography>
                            </Box>
                            {payment.paidDate && (
                              <Typography
                                variant="caption"
                                sx={{ color: "#4CAF50" }}
                              >
                                • Paid: {payment.paidDate}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ color: "#fff", fontWeight: 600 }}
                        >
                          {formatCurrency(payment.amount)}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </TabPanel>
        )}

        {/* Team Members Tab */}
        {showTeamAndAgreement && (
          <TabPanel value={activeTab} index={teamMembersTabIndex}>
            <Box sx={{ px: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#fff", fontWeight: 600 }}
                >
                  Project Team Members
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<LocationOn />}
                  sx={{
                    backgroundColor: "#6B8E23",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#5a7a1e",
                    },
                  }}
                >
                  View Location Map
                </Button>
              </Box>

              {teamMembers.map((member) => (
                <Box
                  key={member.id}
                  sx={{
                    p: 2.5,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(107, 142, 35, 0.2)",
                    backgroundColor: "#111a11",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Avatar
                      src={member.avatar}
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: getRoleColor(member.role),
                      }}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#fff", fontWeight: 600 }}
                        >
                          {member.name}
                        </Typography>
                        <Chip
                          label={
                            member.isCurrentUser
                              ? `${member.role} (YOU)`
                              : member.role
                          }
                          size="small"
                          sx={{
                            backgroundColor: getRoleColor(member.role),
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 22,
                          }}
                        />
                        {member.rating && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.3,
                            }}
                          >
                            <Star sx={{ fontSize: 16, color: "#f9a825" }} />
                            <Typography
                              variant="body2"
                              sx={{ color: "#f9a825" }}
                            >
                              {member.rating}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#808080", mb: 1.5 }}
                      >
                        ID: {member.id}
                      </Typography>

                      {(member.email || member.phone || member.location) && (
                        <div className="row g-3 mb-2">
                          {member.email && (
                            <div className="col-auto">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Email
                                  sx={{ fontSize: 14, color: "#808080" }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#808080",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Email
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ color: "#fff" }}
                              >
                                {member.email}
                              </Typography>
                            </div>
                          )}
                          {member.phone && (
                            <div className="col-auto">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Phone
                                  sx={{ fontSize: 14, color: "#808080" }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#808080",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Phone
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ color: "#fff" }}
                              >
                                {member.phone}
                              </Typography>
                            </div>
                          )}
                          {member.location && (
                            <div className="col-auto">
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#808080",
                                  textTransform: "uppercase",
                                  display: "block",
                                }}
                              >
                                Location
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#fff" }}
                              >
                                {member.location}
                              </Typography>
                            </div>
                          )}
                        </div>
                      )}

                      {member.roleDescription && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#808080",
                              textTransform: "uppercase",
                              display: "block",
                            }}
                          >
                            Role
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#fff" }}>
                            {member.roleDescription}
                          </Typography>
                        </Box>
                      )}

                      {member.specialization && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#808080",
                              textTransform: "uppercase",
                              display: "block",
                            }}
                          >
                            Specialization
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#fff" }}>
                            {member.specialization}
                          </Typography>
                        </Box>
                      )}

                      {member.experience && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#808080",
                              textTransform: "uppercase",
                              display: "block",
                            }}
                          >
                            Experience
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#fff" }}>
                            {member.experience}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </TabPanel>
        )}

        {showTeamAndAgreement && (
          <TabPanel value={activeTab} index={agreementTabIndex}>
            <Box sx={{ px: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#fff", fontWeight: 600, mb: 2 }}
              >
                Project Agreement
              </Typography>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backgroundColor: "#111a11",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    Active Farmer Agreement
                  </Typography>
                  <Chip
                    label={
                      projectData.status === "ACTIVE" ? "Active" : "Pending"
                    }
                    color={
                      projectData.status === "ACTIVE" ? "success" : "warning"
                    }
                    size="small"
                    sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22 }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 2 }}>
                  This project contains the agreement between the farmer,
                  investor, and associated parties. Agreement visibility is
                  limited to the farmer&apos;s currently active project.
                </Typography>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#808080",
                        textTransform: "uppercase",
                        display: "block",
                      }}
                    >
                      Project ID
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fff" }}>
                      {projectData.projectId}
                    </Typography>
                  </div>
                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#808080",
                        textTransform: "uppercase",
                        display: "block",
                      }}
                    >
                      Investment Type
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fff" }}>
                      {projectData.investmentType}
                    </Typography>
                  </div>
                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#808080",
                        textTransform: "uppercase",
                        display: "block",
                      }}
                    >
                      Investor
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fff" }}>
                      {investorMember?.name || "Not assigned"}
                    </Typography>
                  </div>
                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#808080",
                        textTransform: "uppercase",
                        display: "block",
                      }}
                    >
                      Farmer
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fff" }}>
                      {farmerMember?.name ||
                        projectData.farmerName ||
                        "Current Farmer"}
                    </Typography>
                  </div>

                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#808080",
                        textTransform: "uppercase",
                        display: "block",
                      }}
                    >
                      Land Availability
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fff" }}>
                      {projectData.landAvailability === "with_land"
                        ? "With Land"
                        : "Without Land"}
                    </Typography>
                  </div>

                  {projectData.landAvailability === "with_land" && (
                    <>
                      <div className="col-12 col-md-6">
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#808080",
                            textTransform: "uppercase",
                            display: "block",
                          }}
                        >
                          Land Size
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff" }}>
                          {projectData.landSize
                            ? `${projectData.landSize} Acres`
                            : "—"}
                        </Typography>
                      </div>
                      <div className="col-12 col-md-6">
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#808080",
                            textTransform: "uppercase",
                            display: "block",
                          }}
                        >
                          Land Location
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff" }}>
                          {projectData.landLocation || projectData.location}
                        </Typography>
                      </div>
                    </>
                  )}

                  <div className="col-12 col-md-6">
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#808080",
                        textTransform: "uppercase",
                        display: "block",
                      }}
                    >
                      Expiry Date
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fff" }}>
                      {projectData.expiryDate || projectData.endDate || "—"}
                    </Typography>
                  </div>
                </div>

                <Box
                  sx={{ display: "flex", gap: 1.2, mt: 2.5, flexWrap: "wrap" }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    sx={{
                      backgroundColor: "#6B8E23",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#5a7a1e",
                      },
                    }}
                  >
                    Download Agreement
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      color: "#fff",
                      borderColor: "rgba(255,255,255,0.25)",
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.45)",
                      },
                    }}
                  >
                    View Terms
                  </Button>
                </Box>
              </Box>
            </Box>
          </TabPanel>
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            textTransform: "none",
            px: 3,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          sx={{
            backgroundColor: "#6B8E23",
            textTransform: "none",
            px: 3,
            "&:hover": {
              backgroundColor: "#5a7a1e",
            },
          }}
        >
          Download Full Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
