import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import CreateOfferDialog from "@/pages/farmer/JobCreation";
import ProjectDetailsDialog from "../../components/farmer/ProjectDetailsDialog";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Add as AddIcon,
  Agriculture,
  Landscape,
  LocationOn,
  Visibility,
} from "@mui/icons-material";

interface Project {
  id: number;
  name: string;
  cropType: string;
  cropIcon: string;
  status: "ACTIVE" | "IN REVIEW" | "COMPLETED";
  investmentStatus: string;
  fundingPercentage?: number;
  progress: number;
  landArea: number;
  budget: number;
  expectedROI: number;
  startDate: string;
  endDate?: string;
  harvestDate?: string;
  region?: string;
  location: string;
  profitYield?: string;
  completedDate?: string;
  backgroundImage?: string;
  investmentType: "harvest" | "commission";
  // Team members
  farmerName: string;
  farmerImage: string;
  landownerName?: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "Premium Rice Cultivation",
    cropType: "Rice (Nadu)",
    cropIcon: "🌾",
    status: "ACTIVE",
    investmentStatus: "75% Funded",
    fundingPercentage: 75,
    progress: 74,
    landArea: 5.5,
    budget: 250500,
    expectedROI: 28,
    startDate: "2025-11-15",
    endDate: "2026-04-30",
    harvestDate: "Apr 30, 2026",
    location: "Anuradhapura",
    backgroundImage:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600",
    investmentType: "harvest",
    farmerName: "Kamal Perera",
    farmerImage: "https://randomuser.me/api/portraits/men/32.jpg",
    landownerName: "Perera Estates",
  },
  {
    id: 2,
    name: "Emerald Tea Plantation",
    cropType: "Ceylon Black Tea",
    cropIcon: "🍵",
    status: "IN REVIEW",
    investmentStatus: "Pending Approval",
    fundingPercentage: 10,
    progress: 10,
    landArea: 12.0,
    budget: 450000,
    expectedROI: 22,
    startDate: "2025-12-01",
    endDate: "2026-08-30",
    region: "Nuwara Eliya",
    location: "Nuwara Eliya",
    backgroundImage:
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600",
    investmentType: "commission",
    farmerName: "Sunil Fernando",
    farmerImage: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 3,
    name: "Organic Pepper Vines",
    cropType: "Black Pepper",
    cropIcon: "🌿",
    status: "COMPLETED",
    investmentStatus: "Fully Payout",
    fundingPercentage: 100,
    progress: 100,
    landArea: 8.0,
    budget: 320000,
    expectedROI: 18,
    startDate: "2024-06-01",
    endDate: "2024-01-12",
    profitYield: "+18.4%",
    completedDate: "Jan 12, 2024",
    location: "Matale",
    backgroundImage:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600",
    investmentType: "harvest",
    farmerName: "Nimal Silva",
    farmerImage: "https://randomuser.me/api/portraits/men/67.jpg",
    landownerName: "Silva Spice Gardens",
  },
];

// TODO: Fetch stats dynamically from API
// API endpoint: GET /api/farmer/project-stats
const stats = [
  { label: "TOTAL ACTIVE PROJECTS", value: "12" },
  { label: "TOTAL LAND UNDER MANAGEMENT", value: "42.5", unit: "Acres" },
  { label: "PENDING INVESTORS", value: "08" },
  { label: "UPCOMING HARVESTS", value: "03" },
];

// TODO: Fetch projects dynamically from API
// API endpoint: GET /api/farmer/projects

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "IN REVIEW":
      return "warning";
    case "COMPLETED":
      return "primary";
    default:
      return "default";
  }
};

const MyProjectsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenDetails = (project: Project) => {
    setSelectedProject(project);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedProject(null);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3, minHeight: "100vh", backgroundColor: "#0a0f0a" }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ color: "#fff", fontWeight: 600, mb: 0.5 }}
            >
              My Projects
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
              Create Farming Opportunity and view the status of your current
              farming plans.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              borderColor: "rgba(255,255,255,0.3)",
              color: "#fff",
              textTransform: "none",
              px: 2.5,
              py: 1,
              fontSize: "0.875rem",
              "&:hover": {
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.1)",
              },
            }}
          >
            Create New Project
          </Button>
        </Box>

        {/* Active Projects Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&::before": {
                content: '""',
                width: 4,
                height: 24,
                background: "linear-gradient(180deg, #6B8E23 0%, #8FA887 100%)",
                borderRadius: 1,
              },
            }}
          >
            Active Projects
          </Typography>

          <div className="row g-4">
            {projects.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background:
                      "linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow:
                        "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(107, 142, 35, 0.1)",
                    },
                  }}
                >
                  {/* Header with Background Image */}
                  <Box
                    sx={{
                      position: "relative",
                      height: 160,
                      background:
                        "linear-gradient(135deg, #1a2e1a 0%, #2a3a2a 100%)",
                      overflow: "hidden",
                    }}
                  >
                    {project.backgroundImage && (
                      <CardMedia
                        component="img"
                        image={project.backgroundImage}
                        alt={project.cropType}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.6,
                          transition: "all 0.4s ease",
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
                          "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
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
                      {/* Status Badge */}
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Chip
                          label={project.status}
                          color={getStatusColor(project.status) as any}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            letterSpacing: 0.5,
                            backdropFilter: "blur(10px)",
                            textTransform: "uppercase",
                          }}
                        />
                      </Box>

                      {/* Crop Info */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)",
                            borderRadius: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                          }}
                        >
                          {project.cropIcon}
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#ffffff",
                              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                              fontSize: "1.1rem",
                            }}
                          >
                            {project.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            {project.cropType}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Card Body */}
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      p: 2,
                    }}
                  >
                    {/* Stats Row */}
                    <div className="row g-2">
                      <div className="col-6">
                        <Box
                          sx={{
                            background: "rgba(255, 255, 255, 0.02)",
                            borderRadius: 1.5,
                            p: 1.5,
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#808080",
                              textTransform: "uppercase",
                            }}
                          >
                            Budget
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#6B8E23",
                              fontSize: "1rem",
                            }}
                          >
                            {formatCurrency(project.budget)}
                          </Typography>
                        </Box>
                      </div>
                      <div className="col-6">
                        <Box
                          sx={{
                            background: "rgba(255, 255, 255, 0.02)",
                            borderRadius: 1.5,
                            p: 1.5,
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#808080",
                              textTransform: "uppercase",
                            }}
                          >
                            Expected ROI
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#4caf50",
                              fontSize: "1rem",
                            }}
                          >
                            {project.expectedROI}%
                          </Typography>
                        </Box>
                      </div>
                    </div>

                    {/* Progress (only for active projects) */}
                    {project.status === "ACTIVE" && (
                      <Box sx={{ mt: "auto" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Project Progress
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "primary.main" }}
                          >
                            {project.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          sx={{
                            height: 8,
                            borderRadius: 1,
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            "& .MuiLinearProgress-bar": {
                              background:
                                "linear-gradient(90deg, #6B8E23 0%, #8FA887 100%)",
                            },
                          }}
                        />
                      </Box>
                    )}

                    {/* Team Members */}
                    <Box
                      sx={{
                        pt: 2,
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {/* Farmer Info */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: project.landownerName ? 1.5 : 0,
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <Avatar
                            src={project.farmerImage}
                            alt={project.farmerName}
                            sx={{
                              width: 40,
                              height: 40,
                              border: "2px solid",
                              borderColor: "#76c043",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: -2,
                              right: -2,
                              width: 18,
                              height: 18,
                              bgcolor: "#76c043",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "2px solid #1f1f1f",
                            }}
                          >
                            <Agriculture
                              sx={{ fontSize: 12, color: "white" }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            {project.farmerName}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#76c043", fontSize: "0.7rem" }}
                            >
                              Farmer
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#666" }}
                            >
                              •
                            </Typography>
                            <LocationOn
                              sx={{ fontSize: 12, color: "#808080" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: "0.7rem" }}
                            >
                              {project.location}
                            </Typography>
                          </Box>
                        </Box>
                        {!project.landownerName && (
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetails(project)}
                              sx={{
                                color: "primary.main",
                                "&:hover": {
                                  backgroundColor: "rgba(107, 142, 35, 0.1)",
                                },
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>

                      {/* Landowner Info */}
                      {project.landownerName && (
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
                                borderColor: "#ff9800",
                                bgcolor: "rgba(255, 152, 0, 0.2)",
                              }}
                            >
                              <Landscape
                                sx={{ fontSize: 20, color: "#ff9800" }}
                              />
                            </Avatar>
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: -2,
                                right: -2,
                                width: 18,
                                height: 18,
                                bgcolor: "#ff9800",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "2px solid #1f1f1f",
                              }}
                            >
                              <Landscape
                                sx={{ fontSize: 10, color: "white" }}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                            >
                              {project.landownerName}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: "#ff9800", fontSize: "0.7rem" }}
                              >
                                Landowner
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#666" }}
                              >
                                •
                              </Typography>
                              <LocationOn
                                sx={{ fontSize: 12, color: "#808080" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                {project.location}
                              </Typography>
                            </Box>
                          </Box>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetails(project)}
                              sx={{
                                color: "primary.main",
                                "&:hover": {
                                  backgroundColor: "rgba(107, 142, 35, 0.1)",
                                },
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  </CardContent>

                  {/* Footer with Dates */}
                  <Box
                    className="row g-0"
                    sx={{
                      p: 1.5,
                      background: "rgba(0, 0, 0, 0.2)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div className="col-6 text-center">
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#808080",
                          textTransform: "uppercase",
                          fontSize: "0.65rem",
                        }}
                      >
                        Started
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#b0b0b0", fontSize: "0.75rem" }}
                      >
                        {formatDate(project.startDate)}
                      </Typography>
                    </div>
                    {project.endDate && (
                      <div className="col-6 text-center">
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#808080",
                            textTransform: "uppercase",
                            fontSize: "0.65rem",
                          }}
                        >
                          {project.status === "COMPLETED"
                            ? "Completed"
                            : "Expected End"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#b0b0b0", fontSize: "0.75rem" }}
                        >
                          {formatDate(project.endDate)}
                        </Typography>
                      </div>
                    )}
                  </Box>
                </Card>
              </div>
            ))}

            {/* Add New Project Card */}
            <div className="col-12 col-md-6 col-lg-4">
              <Card
                onClick={handleOpenDialog}
                sx={{
                  height: "100%",
                  minHeight: 450,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "2px dashed rgba(255,255,255,0.15)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#6B8E23",
                    backgroundColor: "rgba(107, 142, 35, 0.05)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      border: "2px dashed rgba(255,255,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <AddIcon
                      sx={{ color: "rgba(255,255,255,0.4)", fontSize: 32 }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    Add New Project
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Create a new farming opportunity
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </Box>

        {/* Stats Section */}
        <Card
          sx={{
            backgroundColor: "#111a11",
            border: "1px solid rgba(76, 175, 80, 0.15)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ py: 3, px: 4 }}>
            <Grid container spacing={2}>
              {stats.map((stat, index) => (
                <Grid
                  size={{ xs: 6, md: 3 }}
                  key={index}
                  sx={{
                    borderRight:
                      index < stats.length - 1
                        ? { md: "1px solid rgba(255,255,255,0.08)" }
                        : "none",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.5px",
                      display: "block",
                      mb: 1,
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#fff", fontWeight: 600, fontSize: "2rem" }}
                  >
                    {stat.value}
                    {stat.unit && (
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.875rem",
                          color: "rgba(255,255,255,0.5)",
                          ml: 0.5,
                          fontWeight: 400,
                        }}
                      >
                        {stat.unit}
                      </Typography>
                    )}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Create Offer Dialog */}
      <CreateOfferDialog open={dialogOpen} onClose={handleCloseDialog} />

      {/* Project Details Dialog */}
      <ProjectDetailsDialog
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
        project={
          selectedProject
            ? {
                id: selectedProject.id,
                name: selectedProject.name,
                projectId: `PRJ-${selectedProject.id.toString().padStart(3, "0")}`,
                status:
                  selectedProject.status === "IN REVIEW"
                    ? "ACTIVE"
                    : selectedProject.status,
                startDate: formatDate(selectedProject.startDate),
                endDate: selectedProject.endDate
                  ? formatDate(selectedProject.endDate)
                  : undefined,
                progress: selectedProject.progress,
                budget: selectedProject.budget,
                expectedROI: selectedProject.expectedROI,
                investmentType:
                  selectedProject.investmentType === "harvest"
                    ? "Harvest-Based"
                    : "Commission-Based",
              }
            : null
        }
      />
    </DashboardLayout>
  );
};

export default MyProjectsPage;
