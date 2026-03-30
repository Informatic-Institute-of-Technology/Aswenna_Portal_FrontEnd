import { CardHeaderWithIcon } from "@/components";
import coverImages from "@/data/json/coverImages.json";
import { adminService } from "@/services/admin.service";
import { userService } from "@/services/user.service";
import type { UnifiedProject } from "@/types/admin.types";
import {
  AccessTime,
  Assessment,
  CheckCircle,
  Close,
  LocationOn,
  Search,
  TrendingUp,
  Visibility,
  Warning,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Drawer,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusStyling = (
  status: string,
): { bgColor: string; textColor: string; label: string } => {
  switch (status) {
    case "active":
      return {
        bgColor: "rgba(5, 150, 105, 0.15)",
        textColor: "#10B981",
        label: "ACTIVE",
      };
    case "completed":
      return {
        bgColor: "rgba(59, 130, 246, 0.15)",
        textColor: "#60A5FA",
        label: "COMPLETED",
      };
    case "pending":
      return {
        bgColor: "rgba(217, 119, 6, 0.15)",
        textColor: "#FBBF24",
        label: "PENDING",
      };
    case "cancelled":
      return {
        bgColor: "rgba(239, 68, 68, 0.15)",
        textColor: "#F87171",
        label: "CANCELLED",
      };
    default:
      return {
        bgColor: "rgba(107, 114, 128, 0.15)",
        textColor: "#9CA3AF",
        label: status.toUpperCase(),
      };
  }
};

export const AllProjectsDashboard: React.FC = () => {
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [activeProjects, setActiveProjects] = useState<UnifiedProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | null>(
    null,
  );
  const [creatorProfilePicture, setCreatorProfilePicture] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [farmerSubFilter, setFarmerSubFilter] = useState<
    "all" | "harvest" | "commission"
  >("all");
  const [investorSubFilter, setInvestorSubFilter] = useState<
    "all" | "sponsorship" | "direct-harvest"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!selectedProject) {
      setCreatorProfilePicture(null);
      return;
    }

    const loadCreatorProfilePicture = async () => {
      try {
        const userProfile = await userService.getUserProfile(
          selectedProject.creator.id,
        );

        let profilePicUrl: string | null = null;
        if (userProfile.personalInfo?.profilePicture) {
          const pic = userProfile.personalInfo.profilePicture;
          if (typeof pic === "string") {
            profilePicUrl = pic;
          } else if (
            typeof pic === "object" &&
            pic &&
            "url" in pic &&
            pic.url
          ) {
            profilePicUrl = pic.url;
          }
        }

        setCreatorProfilePicture(profilePicUrl);
      } catch (error) {
        console.warn(
          `Failed to load profile picture for creator ${selectedProject.creator.id}:`,
          error,
        );
        setCreatorProfilePicture(null);
      }
    };

    loadCreatorProfilePicture();
  }, [selectedProject]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      console.group("📊 Loading Projects from API");

      const activeData = await adminService.fetchActiveProjects(true);
      setActiveProjects(activeData);

      const allData = await adminService.fetchAllProjects(true);
      setProjects(allData);

      console.log("📈 Project Breakdown by Type:");
      const breakdown = {
        "🌾 Farmer - Harvest": allData.filter(
          (p) => p.category === "farmer-harvest",
        ).length,
        "💰 Farmer - Commission": allData.filter(
          (p) => p.category === "farmer-commission",
        ).length,
        "🌱 Investor - Direct Harvest": allData.filter(
          (p) => p.category === "investor-harvest",
        ).length,
        "👤 Investor - Sponsorship": allData.filter(
          (p) => p.category === "investor-sponsorship",
        ).length,
      };
      console.table(breakdown);

      console.log("💵 Financial Metrics Summary:");
      const investmentData = allData.filter(
        (p) => p.financialMetric?.unit === "LKR",
      );
      const commissionData = allData.filter(
        (p) => p.financialMetric?.unit === "%",
      );
      console.log(
        `  • Investment-based (LKR): ${investmentData.length} projects = ${formatCurrency(investmentData.reduce((sum, p) => sum + (p.financialMetric?.value || 0), 0))}`,
      );
      console.log(
        `  • Commission-based (%): ${commissionData.length} projects, avg rate: ${commissionData.length > 0 ? (commissionData.reduce((sum, p) => sum + (p.financialMetric?.value || 0), 0) / commissionData.length).toFixed(1) : 0}%`,
      );

      // Log status breakdown
      console.log("📌 Status Breakdown:");
      const statusBreakdown = {
        "✓ Active": allData.filter((p) => p.status === "active").length,
        "⏳ Pending": allData.filter((p) => p.status === "pending").length,
        "✔ Completed": allData.filter((p) => p.status === "completed").length,
        "✗ Cancelled": allData.filter((p) => p.status === "cancelled").length,
      };
      console.table(statusBreakdown);

      console.groupEnd();
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectsByStakeholder = (
    stakeholder: "farmer" | "investor" | "landowner",
  ) => {
    let filtered = projects.filter((p) => p.stakeholder === stakeholder);

    if (stakeholder === "farmer" && farmerSubFilter !== "all") {
      filtered = filtered.filter((p) => {
        const category = p.category;
        if (farmerSubFilter === "harvest") {
          return category === "farmer-harvest";
        } else if (farmerSubFilter === "commission") {
          return category === "farmer-commission";
        }
        return true;
      });
    }

    // Apply sub-filter for investor projects
    if (stakeholder === "investor" && investorSubFilter !== "all") {
      filtered = filtered.filter((p) => {
        const category = p.category;
        if (investorSubFilter === "sponsorship") {
          return category === "investor-sponsorship";
        } else if (investorSubFilter === "direct-harvest") {
          return category === "investor-harvest";
        }
        return true;
      });
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const farmerProjects = getProjectsByStakeholder("farmer");
  const investorProjects = getProjectsByStakeholder("investor");
  const landownerProjects = getProjectsByStakeholder("landowner");

  const renderProjectsTable = (projectList: UnifiedProject[]) => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (projectList.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography color="textSecondary">No projects found</Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ backgroundColor: "transparent" }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "rgba(39, 39, 42, 0.6)",
                borderBottom: "1px solid #3F3F46",
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#F3F4F6",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                }}
              >
                Project
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#F3F4F6",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  textAlign: "right",
                }}
              >
                Investment
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#F3F4F6",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                }}
              >
                Location
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#F3F4F6",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  textAlign: "center",
                }}
              >
                Creator
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#F3F4F6",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  textAlign: "center",
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#F3F4F6",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectList.map((project) => {
              const statusStyling = getStatusStyling(project.status);
              return (
                <TableRow
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(39, 39, 42, 0.5)",
                      borderLeft: "3px solid #85a446",
                      paddingLeft: "12px",
                    },
                    "&:not(:last-child)": {
                      borderBottom: "1px solid rgba(63, 63, 70, 0.5)",
                    },
                  }}
                >
                  <TableCell sx={{ py: 1.75, pl: 2 }}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#F3F4F6", mb: 0.4 }}
                      >
                        {project.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#A1A1AA", display: "block" }}
                      >
                        {project.id.substring(0, 8)}...
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#9CA3AF",
                          display: "block",
                          fontSize: "0.7rem",
                          mt: 0.2,
                        }}
                      >
                        {project.category.replace("-", " ").toUpperCase()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "right", py: 1.75, pr: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#85a446" }}
                    >
                      {project.financialMetric?.unit === "%"
                        ? `${project.financialMetric?.value}%`
                        : formatCurrency(project.financialMetric?.value || 0)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#A1A1AA",
                        display: "block",
                        fontSize: "0.7rem",
                      }}
                    >
                      {project.financialMetric?.label}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.75 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 0.75,
                      }}
                    >
                      <LocationOn
                        sx={{
                          fontSize: 16,
                          mt: 0.25,
                          color: "#6B7280",
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            fontWeight: 500,
                            color: "#F3F4F6",
                          }}
                        >
                          {project.location || "N/A"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#A1A1AA",
                            display: "block",
                            fontSize: "0.7rem",
                          }}
                        >
                          {project.preferredRegions?.[0] || "—"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", py: 1.75, px: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <Tooltip title={project.creator.name}>
                        <Avatar
                          src={project.creator.image}
                          sx={{
                            width: 36,
                            height: 36,
                            backgroundColor: "#27272A",
                            border: "1px solid #3F3F46",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {project.creator.name.charAt(0)}
                        </Avatar>
                      </Tooltip>
                      <Box sx={{ textAlign: "left", minWidth: 0 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            fontWeight: 500,
                            color: "#F3F4F6",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {project.creator.name}
                        </Typography>
                        {project.creator.email && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: "#A1A1AA",
                              fontSize: "0.7rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {project.creator.email}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", py: 1.75 }}>
                    <Box
                      sx={{
                        display: "inline-block",
                        backgroundColor: statusStyling.bgColor,
                        color: statusStyling.textColor,
                        px: 2,
                        py: 0.75,
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {statusStyling.label}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", py: 1.75, pr: 2 }}>
                    <Tooltip title="View Full Details">
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        sx={{
                          minWidth: "auto",
                          padding: "8px 12px",
                          color: "#6B7280",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(133, 164, 70, 0.1)",
                            color: "#85a446",
                          },
                        }}
                      >
                        <Visibility sx={{ fontSize: 18 }} />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Assessment color="primary" />
                <Typography variant="body2" color="textSecondary">
                  Total Projects
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {projects.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {farmerProjects.length} farmers • {investorProjects.length}{" "}
                investors
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TrendingUp sx={{ color: "success.main" }} />
                <Typography variant="body2" color="textSecondary">
                  Total Investment
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 0.5, color: "success.main" }}
              >
                {formatCurrency(
                  projects.reduce(
                    (sum, p) => sum + (p.financialMetric?.value || 0),
                    0,
                  ),
                )}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Across all projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CheckCircle sx={{ color: "info.main" }} />
                <Typography variant="body2" color="textSecondary">
                  Active Projects
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 0.5, color: "info.main" }}
              >
                {activeProjects.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Currently ongoing
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Warning sx={{ color: "warning.main" }} />
                <Typography variant="body2" color="textSecondary">
                  Completed
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 0.5, color: "warning.main" }}
              >
                {projects.filter((p) => p.status === "completed").length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Successfully finished
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card>
        <CardHeaderWithIcon
          icon={Assessment}
          title="All Projects - Real-time Monitoring"
        />

        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search by project name or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Tabs
                  value={tabValue}
                  onChange={(_, newValue) => setTabValue(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "primary.main",
                      height: 3,
                    },
                  }}
                >
                  <Tab label={`Farmers (${farmerProjects.length})`} />
                  <Tab label={`Investors (${investorProjects.length})`} />
                  <Tab label={`Landowners (${landownerProjects.length})`} />
                </Tabs>
              </Grid>
            </Grid>
          </Box>
          {tabValue === 0 && (
            <>
              <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  size="small"
                  variant={
                    farmerSubFilter === "harvest" ? "contained" : "outlined"
                  }
                  onClick={() => setFarmerSubFilter("harvest")}
                  sx={{ textTransform: "none" }}
                >
                  Harvest-Based (
                  {
                    farmerProjects.filter(
                      (p) => p.category === "farmer-harvest",
                    ).length
                  }
                  )
                </Button>
                <Button
                  size="small"
                  variant={
                    farmerSubFilter === "commission" ? "contained" : "outlined"
                  }
                  onClick={() => setFarmerSubFilter("commission")}
                  sx={{ textTransform: "none" }}
                >
                  Commission-Based (
                  {
                    farmerProjects.filter(
                      (p) => p.category === "farmer-commission",
                    ).length
                  }
                  )
                </Button>
              </Box>
              {renderProjectsTable(farmerProjects)}
            </>
          )}
          {tabValue === 1 && (
            <>
              <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  size="small"
                  variant={
                    investorSubFilter === "sponsorship"
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => setInvestorSubFilter("sponsorship")}
                  sx={{ textTransform: "none" }}
                >
                  Sponsorship (
                  {
                    investorProjects.filter(
                      (p) => p.category === "investor-sponsorship",
                    ).length
                  }
                  )
                </Button>
                <Button
                  size="small"
                  variant={
                    investorSubFilter === "direct-harvest"
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => setInvestorSubFilter("direct-harvest")}
                  sx={{ textTransform: "none" }}
                >
                  Direct Harvest (
                  {
                    investorProjects.filter(
                      (p) => p.category === "investor-harvest",
                    ).length
                  }
                  )
                </Button>
              </Box>
              {renderProjectsTable(investorProjects)}
            </>
          )}
          {tabValue === 2 && renderProjectsTable(landownerProjects)}
        </CardContent>
      </Card>
      <Drawer
        anchor="right"
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 500 },
            backgroundColor: "#1a1a1a",
            color: "#e5e5e5",
          },
        }}
      >
        {selectedProject && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              position: "relative",
            }}
          >
            <Button
              size="small"
              onClick={() => setSelectedProject(null)}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
                minWidth: "auto",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                backdropFilter: "blur(4px)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
            >
              <Close />
            </Button>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                backgroundImage: `url(${
                  selectedProject.backgroundImage?.startsWith("http")
                    ? selectedProject.backgroundImage
                    : coverImages.find(
                        (img) => img.id === selectedProject.backgroundImage,
                      )?.url ||
                      "https://images.unsplash.com/photo-1586771107445-d3af251c1411"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 50%, rgba(18,18,18,1) 100%)",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  p: 3,
                  width: "100%",
                }}
              >
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  <Chip
                    label={selectedProject.category
                      .replace("-", " ")
                      .toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(33, 150, 243, 0.2)",
                      color: "#60A5FA",
                      borderColor: "rgba(96, 165, 250, 0.3)",
                      border: "1px solid",
                      backdropFilter: "blur(4px)",
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={selectedProject.status.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor:
                        selectedProject.status === "active"
                          ? "rgba(16, 185, 129, 0.2)"
                          : "rgba(156, 163, 175, 0.2)",
                      color:
                        selectedProject.status === "active"
                          ? "#34D399"
                          : "#9CA3AF",
                      border: "1px solid",
                      borderColor:
                        selectedProject.status === "active"
                          ? "rgba(52, 211, 153, 0.3)"
                          : "rgba(156, 163, 175, 0.3)",
                      backdropFilter: "blur(4px)",
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  {selectedProject.cropIcon && (
                    <Box
                      sx={{
                        fontSize: "2rem",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                      }}
                    >
                      {selectedProject.cropIcon}
                    </Box>
                  )}
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: "#fff",
                        textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                        lineHeight: 1.2,
                      }}
                    >
                      {selectedProject.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <LocationOn sx={{ fontSize: 16 }} />{" "}
                      {selectedProject.location}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Avatar
                    src={
                      creatorProfilePicture ||
                      selectedProject.creator.image ||
                      ""
                    }
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#555", // Adding default color for text avatars
                      fontSize: "1.2rem",
                      fontWeight: 600,
                    }}
                  >
                    {!(
                      creatorProfilePicture || selectedProject.creator.image
                    ) && selectedProject.creator.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        fontWeight: 700,
                        mb: 0.2,
                        display: "block",
                      }}
                    >
                      PROJECT OWNER
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 800, color: "#fff", lineHeight: 1.2 }}
                    >
                      {selectedProject.creator.name}
                    </Typography>
                    {selectedProject.creator.email && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          mt: 0.2,
                          display: "block",
                        }}
                      >
                        {selectedProject.creator.email}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
              <Stack spacing={3}>
                {selectedProject.cropType && (
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
                      p: 2,
                      borderRadius: "12px",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#e879f9",
                        display: "block",
                        mb: 0.5,
                        fontWeight: 600,
                      }}
                    >
                      CRITICAL DETAILS
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 700, color: "#f3f4f6" }}
                    >
                      <span style={{ color: "#a78bfa" }}>Crop Type:</span>{" "}
                      {selectedProject.cropType}
                    </Typography>
                  </Box>
                )}
                {selectedProject.description && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#9CA3AF",
                        display: "block",
                        mb: 1,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Description
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#E5E7EB",
                        lineHeight: 1.7,
                        fontSize: "0.95rem",
                      }}
                    >
                      {selectedProject.description}
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)",
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: "#93C5FD",
                      mb: 0.5,
                      letterSpacing: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    {selectedProject.financialMetric?.label}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: "#60A5FA",
                      textShadow: "0 0 20px rgba(96,165,250,0.3)",
                    }}
                  >
                    {selectedProject.financialMetric?.unit === "%"
                      ? `${selectedProject.financialMetric?.value}%`
                      : formatCurrency(
                          selectedProject.financialMetric?.value || 0,
                        )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  {selectedProject.landArea ? (
                    <Box
                      sx={{
                        backgroundColor: "#222",
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid #333",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#9CA3AF", display: "block", mb: 0.5 }}
                      >
                        Land Area
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#F3F4F6" }}
                      >
                        {selectedProject.landArea}{" "}
                        <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>
                          {selectedProject.landAreaUnit || "acres"}
                        </span>
                      </Typography>
                    </Box>
                  ) : null}
                  {selectedProject.expectedYield ? (
                    <Box
                      sx={{
                        backgroundColor: "#222",
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid #333",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#9CA3AF", display: "block", mb: 0.5 }}
                      >
                        Expected Yield
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#F3F4F6" }}
                      >
                        {selectedProject.expectedYield}{" "}
                        <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>
                          kg
                        </span>
                      </Typography>
                    </Box>
                  ) : null}
                  {selectedProject.totalInvestment ? (
                    <Box
                      sx={{
                        backgroundColor: "#222",
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid #333",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#9CA3AF", display: "block", mb: 0.5 }}
                      >
                        Total Budget
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#F3F4F6" }}
                      >
                        {formatCurrency(selectedProject.totalInvestment)}
                      </Typography>
                    </Box>
                  ) : null}
                  {selectedProject.duration ? (
                    <Box
                      sx={{
                        backgroundColor: "#222",
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid #333",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#9CA3AF", display: "block", mb: 0.5 }}
                      >
                        Duration
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#F3F4F6" }}
                      >
                        {selectedProject.duration}{" "}
                        <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>
                          months
                        </span>
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {selectedProject.startDate || selectedProject.endDate ? (
                    <Box
                      sx={{
                        backgroundColor: "#222",
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid #333",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "50%",
                          backgroundColor: "rgba(245, 158, 11, 0.1)",
                          color: "#F59E0B",
                        }}
                      >
                        <AccessTime />
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "#9CA3AF", display: "block", mb: 0.2 }}
                        >
                          Timeline
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#F3F4F6" }}
                        >
                          {selectedProject.startDate &&
                            new Date(
                              selectedProject.startDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          {(selectedProject.endDate ||
                            selectedProject.deadline) &&
                            " - "}
                          {selectedProject.endDate
                            ? new Date(
                                selectedProject.endDate,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : selectedProject.deadline
                              ? new Date(
                                  selectedProject.deadline,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : ""}
                        </Typography>
                      </Box>
                    </Box>
                  ) : null}

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                    }}
                  >
                    {selectedProject.expectedROI ? (
                      <Box
                        sx={{
                          background:
                            "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)",
                          p: 2,
                          borderRadius: "12px",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#34D399",
                            display: "block",
                            mb: 0.5,
                            fontWeight: 600,
                          }}
                        >
                          Expected ROI
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 800, color: "#10B981" }}
                        >
                          {selectedProject.expectedROI}%
                        </Typography>
                      </Box>
                    ) : null}
                    {selectedProject.applicationCount ? (
                      <Box
                        sx={{
                          background:
                            "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.05) 100%)",
                          p: 2,
                          borderRadius: "12px",
                          border: "1px solid rgba(236, 72, 153, 0.3)",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#F472B6",
                            display: "block",
                            mb: 0.5,
                            fontWeight: 600,
                          }}
                        >
                          Applications
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 800, color: "#EC4899" }}
                        >
                          {selectedProject.applicationCount}
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                </Box>
                {selectedProject.preferredRegions &&
                  selectedProject.preferredRegions.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="overline"
                        sx={{
                          color: "#9CA3AF",
                          display: "block",
                          mb: 1,
                          letterSpacing: 1,
                        }}
                      >
                        Preferred Regions
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {selectedProject.preferredRegions.map((region, idx) => (
                          <Chip
                            key={idx}
                            label={region}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(255,255,255,0.05)",
                              color: "#E5E7EB",
                              border: "1px solid rgba(255,255,255,0.1)",
                              "& .MuiChip-icon": { color: "#9CA3AF" },
                            }}
                            icon={<LocationOn sx={{ fontSize: 16 }} />}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                <Box
                  sx={{ pt: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: "#6B7280",
                      display: "block",
                      mb: 1.5,
                      letterSpacing: 1,
                    }}
                  >
                    System Metadata
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1.5,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "#6B7280", display: "block" }}
                      >
                        Source
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#9CA3AF", fontFamily: "monospace" }}
                      >
                        {selectedProject.sourceApi}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "#6B7280", display: "block" }}
                      >
                        Project ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#9CA3AF",
                          fontFamily: "monospace",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={selectedProject.id}
                      >
                        {selectedProject.id}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "#6B7280", display: "block" }}
                      >
                        Created
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                        {new Date(
                          selectedProject.createdAt,
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {selectedProject.updatedAt && (
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "#6B7280", display: "block" }}
                        >
                          Updated
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                          {new Date(
                            selectedProject.updatedAt,
                          ).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        )}
      </Drawer>
    </Container>
  );
};

export default AllProjectsDashboard;
