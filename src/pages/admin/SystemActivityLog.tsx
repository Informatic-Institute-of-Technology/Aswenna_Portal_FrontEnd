import { CardHeaderWithIcon } from "@/components";
import type { ActivityType, SystemActivity } from "@/types/admin.types";
import {
  CheckCircle,
  Download,
  Info,
  Refresh,
  Timeline,
  Warning,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const mockActivities: SystemActivity[] = [
  {
    id: "1",
    timestamp: "2026-01-20T09:15:00",
    type: "agreement_signed",
    actor: { id: "FAR-234", name: "Prasanna Silva", role: "farmer" },
    target: {
      id: "PRJ-145",
      name: "Coconut Plantation Project",
      type: "project",
    },
    action: "Signed Tri-Party Agreement",
    description:
      "Farmer Prasanna Silva signed the tri-party agreement with Investor B and Landowner C",
    ipAddress: "192.168.1.105",
  },
  {
    id: "2",
    timestamp: "2026-01-20T08:42:00",
    type: "payment_completed",
    actor: { id: "INV-067", name: "Smart Agri Investments", role: "investor" },
    target: {
      id: "TXN-2026-00234",
      name: "Payment Transaction",
      type: "transaction",
    },
    action: "Payment Completed",
    description:
      "Payment of 250,000 LKR completed for Project Rice Cultivation - Milestone 2",
    ipAddress: "10.0.1.42",
  },
  {
    id: "3",
    timestamp: "2026-01-20T07:30:00",
    type: "milestone_completed",
    actor: { id: "FAR-089", name: "Nimal Fernando", role: "farmer" },
    target: { id: "MIL-567", name: "Land Preparation", type: "project" },
    action: "Milestone Completed",
    description:
      'Milestone "Land Preparation" marked as complete and submitted for approval',
    ipAddress: "192.168.2.88",
  },
  {
    id: "4",
    timestamp: "2026-01-19T16:20:00",
    type: "dispute_raised",
    actor: { id: "LND-091", name: "Perera Lands", role: "landowner" },
    target: { id: "PRJ-089", name: "Dispute Case", type: "project" },
    action: "Dispute Raised",
    description:
      "Landowner raised a dispute regarding delayed rent payment for Tea Plantation project",
    ipAddress: "172.16.0.23",
  },
  {
    id: "5",
    timestamp: "2026-01-19T14:05:00",
    type: "user_registration",
    actor: { id: "FAR-345", name: "New Farmer - Kumara Peris", role: "farmer" },
    action: "User Registered",
    description: "New farmer registered on the platform - verification pending",
    ipAddress: "203.94.10.156",
  },
  {
    id: "6",
    timestamp: "2026-01-19T12:30:00",
    type: "milestone_approved",
    actor: {
      id: "INV-012",
      name: "Green Future Investments",
      role: "investor",
    },
    target: { id: "MIL-456", name: "Site Survey", type: "project" },
    action: "Milestone Approved",
    description:
      'Investor approved milestone "Site Survey" - Payment released from escrow',
    ipAddress: "10.0.1.42",
  },
  {
    id: "7",
    timestamp: "2026-01-19T11:15:00",
    type: "project_created",
    actor: { id: "FAR-156", name: "Sunita Jayawardena", role: "farmer" },
    target: { id: "PRJ-199", name: "New Vegetable Farm", type: "project" },
    action: "Project Created",
    description:
      'Created new project "Vegetable Farm - Kurunegala" and invited parties',
    ipAddress: "192.168.5.77",
  },
  {
    id: "8",
    timestamp: "2026-01-19T09:45:00",
    type: "verification_completed",
    actor: { id: "INV-034", name: "Agri Ventures PLC", role: "investor" },
    action: "Verification Completed",
    description:
      "Investor identity verification completed successfully - All documents approved",
    ipAddress: "10.0.1.88",
  },
  {
    id: "9",
    timestamp: "2026-01-19T08:20:00",
    type: "document_uploaded",
    actor: { id: "LND-023", name: "Silva Estates", role: "landowner" },
    target: { id: "DOC-789", name: "Land Deed Document", type: "document" },
    action: "Document Uploaded",
    description:
      "Landowner uploaded land deed certificate for property verification",
    ipAddress: "172.16.5.44",
  },
  {
    id: "10",
    timestamp: "2026-01-18T17:00:00",
    type: "dispute_resolved",
    actor: {
      id: "ADMIN-001",
      name: "System Administrator",
      role: "superadmin",
    },
    target: { id: "DIS-023", name: "Payment Dispute", type: "project" },
    action: "Dispute Resolved",
    description:
      "Dispute resolved between Farmer and Landowner - Payment processed",
    ipAddress: "10.0.0.1",
  },
  {
    id: "11",
    timestamp: "2026-01-18T15:30:00",
    type: "user_login",
    actor: { id: "FAR-089", name: "Nimal Fernando", role: "farmer" },
    action: "User Login",
    description: "User logged into the platform",
    ipAddress: "192.168.2.88",
  },
  {
    id: "12",
    timestamp: "2026-01-18T14:15:00",
    type: "payment_initiated",
    actor: { id: "INV-034", name: "Agri Ventures PLC", role: "investor" },
    target: {
      id: "TXN-2026-00233",
      name: "Escrow Deposit",
      type: "transaction",
    },
    action: "Payment Initiated",
    description:
      "Initiated escrow deposit of 500,000 LKR for Fruit Orchard project",
    ipAddress: "10.0.1.88",
  },
];

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "user_registration":
    case "user_login":
      return <Info color="info" />;
    case "project_created":
    case "project_updated":
    case "milestone_completed":
      return <CheckCircle color="success" />;
    case "dispute_raised":
    case "dispute_resolved":
      return <Warning color="warning" />;
    case "payment_initiated":
    case "payment_completed":
      return <CheckCircle color="primary" />;
    case "verification_completed":
    case "milestone_approved":
      return <CheckCircle color="success" />;
    default:
      return <Info color="action" />;
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case "dispute_raised":
      return "warning";
    case "user_registration":
    case "project_created":
      return "success";
    case "payment_completed":
    case "milestone_completed":
      return "primary";
    case "verification_completed":
      return "info";
    default:
      return "default";
  }
};

const SystemActivityLog = () => {
  const [activities] = useState<SystemActivity[]>(mockActivities);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = activities.filter((activity) => {
    const matchesType = typeFilter === "all" || activity.type === typeFilter;
    const matchesRole =
      roleFilter === "all" || activity.actor.role === roleFilter;
    const matchesSearch =
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesRole && matchesSearch;
  });

  const activityTypes: ActivityType[] = [
    "user_registration",
    "user_login",
    "project_created",
    "agreement_signed",
    "payment_completed",
    "milestone_completed",
    "dispute_raised",
    "verification_completed",
  ];

  return (
    <>
      <Card>
        <CardHeaderWithIcon
          icon={Timeline}
          title="Global System Activity Log"
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<Refresh />}>
                Refresh
              </Button>
              <Button variant="outlined" size="small" startIcon={<Download />}>
                Export
              </Button>
            </Box>
          }
        />
        <CardContent>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Activity Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Activity Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {activityTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>User Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="User Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="farmer">Farmer</MenuItem>
                  <MenuItem value="investor">Investor</MenuItem>
                  <MenuItem value="landowner">Land Owner</MenuItem>
                  <MenuItem value="superadmin">Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Activity Feed */}
          <Paper sx={{ maxHeight: 800, overflow: "auto", p: 2 }}>
            <List>
              {filteredActivities.map((activity, index) => (
                <ListItem
                  key={activity.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    pb: 3,
                    mb: 3,
                    borderBottom:
                      index < filteredActivities.length - 1
                        ? "1px solid"
                        : "none",
                    borderColor: "divider",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Timeline Icon */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "background.paper",
                      border: "2px solid",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Box>

                  {/* Activity Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: "0.75rem",
                          bgcolor: "primary.main",
                        }}
                      >
                        {activity.actor.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        {activity.actor.name}
                      </Typography>
                      <Chip
                        label={activity.actor.role}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: "auto" }}
                      >
                        {formatDateTime(activity.timestamp)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={activity.action}
                        size="small"
                        color={
                          getActivityColor(activity.type) as
                            | "default"
                            | "primary"
                            | "secondary"
                            | "error"
                            | "info"
                            | "success"
                            | "warning"
                        }
                        variant="outlined"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {activity.description}
                    </Typography>

                    {/* Metadata */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      {activity.target && (
                        <Typography variant="caption" color="text.secondary">
                          Target: <strong>{activity.target.name}</strong> (
                          {activity.target.type})
                        </Typography>
                      )}
                      {activity.ipAddress && (
                        <Typography variant="caption" color="text.secondary">
                          IP: <strong>{activity.ipAddress}</strong>
                        </Typography>
                      )}
                      <Chip
                        label={activity.type.replace(/_/g, " ")}
                        size="small"
                        variant="outlined"
                        sx={{ height: 18, fontSize: "0.65rem" }}
                      />
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>

            {filteredActivities.length === 0 && (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  No activities found matching your filters
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Stats Summary */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "background.paper",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Showing {filteredActivities.length} of {activities.length}{" "}
              activities
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default SystemActivityLog;
