import { useState } from "react";
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
  project?: {
    id: number;
    name: string;
    projectId?: string;
    status: string;
    startDate: string;
    endDate?: string;
    progress: number;
    budget: number;
    expectedROI: number;
    investmentType: string;
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

// Sample data - in production this would come from props/API
const sampleMilestones = [
  {
    id: 1,
    title: "Land Preparation & Soil Testing",
    description:
      "Complete land clearing, plowing, and comprehensive soil analysis for optimal rice cultivation",
    status: "COMPLETED",
    startDate: "Nov 15, 2025",
    endDate: "Nov 25, 2025",
    completedDate: "Nov 24, 2025",
    payment: 25000,
    progress: 100,
    tasksCompleted: 8,
    totalTasks: 8,
  },
  {
    id: 2,
    title: "Seed Selection & Purchase",
    description:
      "Procure certified Nadu rice seeds from government agriculture center",
    status: "COMPLETED",
    startDate: "Nov 26, 2025",
    endDate: "Nov 30, 2025",
    completedDate: "Nov 29, 2025",
    payment: 18000,
    progress: 100,
    tasksCompleted: 5,
    totalTasks: 5,
  },
  {
    id: 3,
    title: "Planting & Initial Irrigation",
    description:
      "Sow seeds and establish irrigation system for the first growth phase",
    status: "COMPLETED",
    startDate: "Dec 1, 2025",
    endDate: "Dec 10, 2025",
    completedDate: "Dec 9, 2025",
    payment: 32000,
    progress: 100,
    tasksCompleted: 6,
    totalTasks: 6,
  },
  {
    id: 4,
    title: "Growth Monitoring & Fertilization",
    description:
      "Apply fertilizers and monitor crop growth during vegetative phase",
    status: "IN_PROGRESS",
    startDate: "Dec 11, 2025",
    endDate: "Jan 15, 2026",
    completedDate: null,
    payment: 42500,
    progress: 65,
    tasksCompleted: 4,
    totalTasks: 7,
  },
];

const sampleBudgetCategories = [
  {
    name: "Labor & Workforce",
    amount: 62500,
    percentage: 25,
    color: "#ff6b35",
  },
  {
    name: "Fertilizers & Nutrients",
    amount: 42500,
    percentage: 17,
    color: "#f9a825",
  },
  {
    name: "Irrigation & Water Management",
    amount: 37500,
    percentage: 15,
    color: "#ff9800",
  },
  {
    name: "Seeds & Planting Materials",
    amount: 35000,
    percentage: 14,
    color: "#4CAF50",
  },
];

const samplePayments = [
  {
    id: 1,
    milestone: "Milestone 1: Land Preparation Payment",
    amount: 25000,
    status: "PAID",
    dueDate: "Nov 25, 2025",
    paidDate: "Nov 24, 2025",
  },
  {
    id: 2,
    milestone: "Milestone 2: Seed Purchase Payment",
    amount: 18000,
    status: "PAID",
    dueDate: "Nov 30, 2025",
    paidDate: "Nov 29, 2025",
  },
  {
    id: 3,
    milestone: "Milestone 3: Planting Payment",
    amount: 32000,
    status: "PAID",
    dueDate: "Dec 10, 2025",
    paidDate: "Dec 9, 2025",
  },
];

const sampleTeamMembers = [
  {
    id: "INV-5480A6",
    name: "Danitha Perera",
    role: "INVESTOR",
    isCurrentUser: true,
    email: "investor@gmail.com",
    phone: "+94703113386",
    location: "Hambanthota, Sri Lanka",
    roleDescription: "Primary Investor - Agricultural Investment Portfolio",
    rating: null,
    avatar: "",
  },
  {
    id: "FAR-234",
    name: "Kamal Perera",
    role: "FARMER",
    isCurrentUser: false,
    email: "kamal.perera@agrimail.lk",
    phone: "+94 77 234 5678",
    location: "Anuradhapura, North Central Province",
    specialization: "Rice Cultivation (Nadu & Samba varieties)",
    experience: "15 years in paddy farming, certified organic practitioner",
    rating: 4.8,
    avatar: "",
  },
  {
    id: "LND-019",
    name: "Perera Estates",
    role: "LANDOWNER",
    isCurrentUser: false,
    location: "Anuradhapura, North Central Province",
    rating: 4.7,
    avatar: "",
  },
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

const ProjectDetailsDialog = ({
  open,
  onClose,
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
    name: "Premium Rice Cultivation",
    projectId: "PRJ-156",
    status: "ACTIVE",
    startDate: "Nov 15, 2025",
    endDate: "Apr 30, 2026",
    progress: 74,
    budget: 250500,
    expectedROI: 28,
    investmentType: "Harvest-Based",
  };

  const disbursedAmount = 138000;
  const remainingBalance = projectData.budget - disbursedAmount;
  const totalMilestones = 8;
  const completedMilestones = 5;
  const pendingMilestones = 3;

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
          <Tab label="Milestones & Progress" />
          <Tab label="Payments & Finance" />
          <Tab label="Team Members" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ px: 3 }}>
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
                    value={(disbursedAmount / projectData.budget) * 100}
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
                          sx={{ color: "#4CAF50", textTransform: "uppercase" }}
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
                          sx={{ color: "#c9a227", textTransform: "uppercase" }}
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
                    value={(completedMilestones / totalMilestones) * 100}
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
                    {Math.round((completedMilestones / totalMilestones) * 100)}%
                    Complete
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
          </Box>
        </TabPanel>

        {/* Milestones & Progress Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ px: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: "#fff", fontWeight: 600, mb: 3 }}
            >
              Project Milestones & Progress Tracking
            </Typography>

            {sampleMilestones.map((milestone) => (
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

                <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 2 }}>
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
                    Progress: {milestone.tasksCompleted}/{milestone.totalTasks}{" "}
                    tasks completed
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
            ))}
          </Box>
        </TabPanel>

        {/* Payments & Finance Tab */}
        <TabPanel value={activeTab} index={2}>
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
                    Budget Breakdown by Category
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" sx={{ color: "#808080" }}>
                    Total Budget: {formatCurrency(250000)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4CAF50",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    View All (7) ↓
                  </Typography>
                </Box>
              </Box>

              {sampleBudgetCategories.map((category, index) => (
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
                      <Typography variant="caption" sx={{ color: "#808080" }}>
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
                Showing top 4 categories • 3 more categories available
              </Typography>
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

              {samplePayments.map((payment) => (
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
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
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
                        <Typography variant="caption" sx={{ color: "#4CAF50" }}>
                          • Paid: {payment.paidDate}
                        </Typography>
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
              ))}
            </Box>
          </Box>
        </TabPanel>

        {/* Team Members Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ px: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
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

            {sampleTeamMembers.map((member) => (
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
                          <Typography variant="body2" sx={{ color: "#f9a825" }}>
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
                              <Email sx={{ fontSize: 14, color: "#808080" }} />
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
                            <Typography variant="body2" sx={{ color: "#fff" }}>
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
                              <Phone sx={{ fontSize: 14, color: "#808080" }} />
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
                            <Typography variant="body2" sx={{ color: "#fff" }}>
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
                            <Typography variant="body2" sx={{ color: "#fff" }}>
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
