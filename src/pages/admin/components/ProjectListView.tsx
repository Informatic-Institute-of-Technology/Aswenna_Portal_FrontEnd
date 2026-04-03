import { userService } from "@/services/user.service";
import type { UnifiedProject } from "@/types/admin.types";
import { Info, Visibility } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface ProjectListViewProps {
  projects: UnifiedProject[];
  onViewMore: (project: UnifiedProject) => void;
  isLoading?: boolean;
}

function getCategoryLabel(category: string): string {
  const labels: { [key: string]: string } = {
    "farmer-harvest": "Farmer-Harvest",
    "farmer-commission": "Farmer-Commission",
    "investor-harvest": "Investor-Harvest",
    "investor-sponsorship": "Investor-Sponsorship",
    "landowner-rental": "Landowner-Rental",
  };
  return labels[category] || category;
}

function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    "farmer-harvest": "#2E7D32",
    "farmer-commission": "#7B1FA2",
    "investor-harvest": "#1565C0",
    "investor-sponsorship": "#F57C00",
    "landowner-rental": "#C62828",
  };
  return colors[category] || "#757575";
}

function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    active: "#4CAF50",
    pending: "#FF9800",
    completed: "#2196F3",
    cancelled: "#F44336",
    draft: "#9E9E9E",
  };
  return colors[status] || "#757575";
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  onViewMore,
  isLoading = false,
}) => {
  const [creatorProfilePictures, setCreatorProfilePictures] = useState<
    Map<string, string | null>
  >(new Map());

  useEffect(() => {
    const loadProfilePictures = async () => {
      const uniqueCreatorIds = Array.from(
        new Set(projects.map((p) => p.creator.id)),
      );

      const picturesMap = new Map<string, string | null>();

      await Promise.all(
        uniqueCreatorIds.map(async (creatorId) => {
          try {
            const userProfile = await userService.getUserProfile(creatorId);

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

            picturesMap.set(creatorId, profilePicUrl);
          } catch (error) {
            console.warn(
              `Failed to load profile picture for creator ${creatorId}:`,
              error,
            );
            picturesMap.set(creatorId, null);
          }
        }),
      );

      setCreatorProfilePictures(picturesMap);
    };

    if (projects.length > 0) {
      loadProfilePictures();
    }
  }, [projects]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography>Loading projects...</Typography>
      </Box>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <Info sx={{ fontSize: 48, color: "#BDBDBD", mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          No projects found
        </Typography>
      </Card>
    );
  }

  return (
    <TableContainer component={Card}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Project Title</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Creator</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
              Metric
            </TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              sx={{
                "&:hover": { backgroundColor: "#fafafa" },
              }}
            >
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  {project.cropIcon && (
                    <img
                      src={project.cropIcon}
                      alt={project.cropType}
                      style={{ width: 24, height: 24, borderRadius: "4px" }}
                    />
                  )}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {project.title.substring(0, 35)}...
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {project.location}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>

              <TableCell sx={{ minWidth: 280, maxWidth: 350 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar
                    src={
                      creatorProfilePictures.get(project.creator.id) ||
                      project.creator.image ||
                      ""
                    }
                    sx={{ width: 40, height: 40, flexShrink: 0, mt: 0.3 }}
                  >
                    {!(
                      creatorProfilePictures.get(project.creator.id) ||
                      project.creator.image
                    ) && project.creator.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0, py: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: "#000000",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.creator.name}
                    </Typography>
                    {project.creator.email && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "#666666",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mt: 0.3,
                        }}
                      >
                        {project.creator.email}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </TableCell>

              <TableCell>
                <Chip
                  label={getCategoryLabel(project.category)}
                  size="small"
                  sx={{
                    backgroundColor: getCategoryColor(project.category),
                    color: "white",
                    fontWeight: 500,
                  }}
                />
              </TableCell>

              <TableCell sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {project.financialMetric?.value?.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {project.financialMetric?.unit}
                </Typography>
              </TableCell>

              <TableCell sx={{ textAlign: "center" }}>
                <Chip
                  label={project.status.toUpperCase()}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(project.status),
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </TableCell>

              <TableCell sx={{ textAlign: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<Visibility sx={{ fontSize: 16 }} />}
                  onClick={() => onViewMore(project)}
                  sx={{
                    textTransform: "none",
                    borderColor: "#2196F3",
                    color: "#2196F3",
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectListView;
