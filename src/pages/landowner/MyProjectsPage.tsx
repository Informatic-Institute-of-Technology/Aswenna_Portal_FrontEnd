import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Agriculture,
  AttachMoney,
  NotificationsNoneOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { landownerProjectsData } from "../../data/json";

type ProjectStatus = "active" | "completed";

interface ProjectPerson {
  name: string;
  role: string;
  location: string;
  avatar: string;
}

interface LandownerProject {
  id: string;
  status: ProjectStatus;
  alertCount?: number;
  projectName: string;
  cropType: string;
  budget: number;
  roi: number;
  roiLabel: string;
  progress: number;
  startedDate: string;
  expectedEndDate: string;
  backgroundImage: string;
  farmer: ProjectPerson;
  investor: ProjectPerson;
}

const sectionTitleStyles = {
  fontWeight: 700,
  mb: 3,
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
};

const cardStyles = {
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "linear-gradient(155deg, #1f2326 0%, #171a1d 100%)",
  overflow: "hidden",
  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.35)",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const PersonRow = ({
  person,
  icon,
}: {
  person: ProjectPerson;
  icon: React.ReactNode;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
    <Avatar
      src={person.avatar}
      alt={person.name}
      sx={{
        width: 34,
        height: 34,
        border: "2px solid rgba(107, 142, 35, 0.5)",
      }}
    />
    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      <Typography
        sx={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}
        noWrap
      >
        {person.name}
      </Typography>
      <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }} noWrap>
        {person.role} • {person.location}
      </Typography>
    </Box>
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: "rgba(255, 255, 255, 0.06)",
        color: "#6B8E23",
      }}
    >
      {icon}
    </Box>
  </Box>
);

const ProjectCard = ({ project }: { project: LandownerProject }) => (
  <Card sx={cardStyles}>
    <Box sx={{ position: "relative", height: 132, overflow: "hidden" }}>
      <Box
        component="img"
        src={project.backgroundImage}
        alt={project.projectName}
        sx={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Chip
          label={project.status === "active" ? "ACTIVE" : "COMPLETED"}
          sx={{
            height: 24,
            fontSize: 12,
            fontWeight: 700,
            backgroundColor:
              project.status === "active"
                ? "rgba(107, 142, 35, 0.95)"
                : "rgba(139, 156, 68, 0.95)",
            color: "#fff",
          }}
        />

        {project.status === "active" && project.alertCount ? (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "2px solid #f0625f",
              background: "rgba(240, 98, 95, 0.18)",
              display: "grid",
              placeItems: "center",
              color: "#ffd7d6",
              position: "relative",
            }}
          >
            <NotificationsNoneOutlined sx={{ fontSize: 16 }} />
            <Box
              sx={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#f44336",
                color: "#fff",
                fontSize: 10,
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
              }}
            >
              {project.alertCount}
            </Box>
          </Box>
        ) : null}
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 14,
          left: 14,
          right: 14,
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 1.5,
            display: "grid",
            placeItems: "center",
            fontSize: 18,
            background: "rgba(107, 142, 35, 0.2)",
            color: "#a7cb75",
          }}
        >
          <Agriculture sx={{ fontSize: 20 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
            }}
            noWrap
          >
            {project.projectName}
          </Typography>
          <Typography
            sx={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}
            noWrap
          >
            {project.cropType}
          </Typography>
        </Box>
      </Box>
    </Box>

    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.2,
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              color: "rgba(255,255,255,0.58)",
              letterSpacing: 0.3,
            }}
          >
            BUDGET
          </Typography>
          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 700,
              color: "#78a43e",
              lineHeight: 1.25,
            }}
          >
            {formatCurrency(project.budget)}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              color: "rgba(255,255,255,0.58)",
              letterSpacing: 0.3,
            }}
          >
            {project.roiLabel}
          </Typography>
          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 700,
              color: "#46b061",
              lineHeight: 1.25,
            }}
          >
            {project.roi}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 1.75 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>
            Project Progress
          </Typography>
          <Typography sx={{ fontSize: 22, color: "#89bb4b", fontWeight: 700 }}>
            {project.progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={project.progress}
          sx={{
            height: 7,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.16)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              background: "linear-gradient(90deg, #7b9f49 0%, #a1be69 100%)",
            },
          }}
        />
      </Box>

      <Box sx={{ display: "grid", gap: 1.1, mb: 1.4 }}>
        <PersonRow
          person={project.farmer}
          icon={<Agriculture sx={{ fontSize: 16 }} />}
        />
        <PersonRow
          person={project.investor}
          icon={<AttachMoney sx={{ fontSize: 16 }} />}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 1.2,
          color: "#7ea843",
        }}
      >
        <VisibilityOutlined sx={{ fontSize: 18 }} />
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 1.2 }} />

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            STARTED
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: "rgba(235,235,235,0.95)",
              fontWeight: 600,
            }}
          >
            {formatDate(project.startedDate)}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            EXPECTED END
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: "rgba(235,235,235,0.95)",
              fontWeight: 600,
            }}
          >
            {formatDate(project.expectedEndDate)}
          </Typography>
        </Box>
      </Box>
    </Box>
  </Card>
);

const MyProjectsPage = () => {
  const projects = landownerProjectsData as LandownerProject[];

  const activeProjects = useMemo(
    () => projects.filter((project) => project.status === "active"),
    [projects],
  );

  const pastProjects = useMemo(
    () => projects.filter((project) => project.status === "completed"),
    [projects],
  );

  return (
    <DashboardLayout>
      <Box sx={{ pb: 2 }}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={sectionTitleStyles}>
            Active Projects
          </Typography>

          <div className="row g-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="col-12 col-xl-6">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </Box>

        <Typography variant="h5" sx={sectionTitleStyles}>
          Past Projects
        </Typography>

        <div className="row g-4">
          {pastProjects.map((project) => (
            <div key={project.id} className="col-12 col-xl-6">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </Box>
    </DashboardLayout>
  );
};

export default MyProjectsPage;
