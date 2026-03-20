import {
  Add,
  Agriculture,
  AttachMoney,
  History,
  Inbox,
  Landscape,
  NotificationsActive,
  PendingActions,
  PriorityHigh,
  Send,
  Tune,
  Verified,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  ConnectionJourney,
  RequestCard,
} from "../../components/investor/requests";
import agreementsPendingData from "../../data/json/agreementsPending.json";
import farmerRequestsData from "../../data/json/farmerRequests.json";
import sentRequestsData from "../../data/json/sentRequests.json";

interface RequestData {
  id: string;
  projectId?: string;
  partyType?: "farmer" | "landowner";
  recipientType?: "farmer" | "landowner";
  farmerName: string;
  farmerAvatar: string | null;
  farmerInitials: string;
  location: string;
  isVerified?: boolean;
  statusBadge: {
    label: string;
    variant:
      | "pending"
      | "action"
      | "review"
      | "new"
      | "accepted"
      | "rejected"
      | "pending_response"
      | "under_review"
      | "negotiating";
    color?: string;
  };
  tags: Array<{ label: string; variant: "primary" | "secondary" }>;
  description: string;
  timestamp: string;
  journeySteps: Array<{
    title: string;
    description: string;
    timestamp?: string;
    status: "completed" | "active" | "pending";
    icon?: string;
  }>;
  insight: string;
  highlighted: boolean;
}

const SubNavPill = ({
  label,
  icon,
  count,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  count: number;
  active: boolean;
  onClick: () => void;
}) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      px: 2,
      py: 1,
      borderRadius: "20px",
      cursor: "pointer",
      transition: "all 0.2s",
      background: active ? "#27272A" : "transparent",
      "&:hover": {
        background: active ? "#27272A" : "rgba(255,255,255,0.04)",
      },
    }}
  >
    <Box sx={{ color: active ? "#F4F4F5" : "#A1A1AA", display: "flex" }}>
      {icon}
    </Box>
    <Typography
      variant="body2"
      sx={{
        fontWeight: active ? 700 : 500,
        color: active ? "#F4F4F5" : "#A1A1AA",
        fontSize: "0.82rem",
      }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        minWidth: 22,
        height: 22,
        borderRadius: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "#3F3F46" : "rgba(255,255,255,0.06)",
        px: 0.75,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.65rem",
          fontWeight: 700,
          color: active ? "#F4F4F5" : "#A1A1AA",
        }}
      >
        {count}
      </Typography>
    </Box>
  </Box>
);

const SentCard = ({
  request,
  isSelected,
  onClick,
}: {
  request: RequestData;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const statusColorMap: Record<string, { bg: string; text: string }> = {
    accepted: { text: "#34D399", bg: "#064E3B" },
    rejected: { text: "#F87171", bg: "#7F1D1D" },
    under_review: { text: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
    pending_response: { text: "#FBBF24", bg: "#4B330B" },
    negotiating: { text: "#c084fc", bg: "rgba(192,132,252,0.15)" },
  };
  const iconMap: Record<string, string> = {
    accepted: "check_circle",
    rejected: "block",
    under_review: "schedule",
    pending_response: "pending",
    negotiating: "auto_awesome",
  };
  const icon = iconMap[request.statusBadge.variant] ?? "pending";
  const statusStyle = statusColorMap[request.statusBadge.variant] ?? {
    text: "#94a3b8",
    bg: "rgba(148,163,184,0.15)",
  };
  const isLandowner = request.recipientType === "landowner";

  return (
    <Box
      onClick={onClick}
      sx={{
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: isSelected ? "rgba(163, 230, 53, 0.3)" : "#27272A",
        background: isSelected ? "rgba(163, 230, 53, 0.05)" : "#18181B",
        p: 2,
        cursor: "pointer",
        transition: "all 0.25s",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "rgba(255,255,255,0.12)",
        },
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1.25,
          pl: 1,
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: "#262626",
            fontWeight: 800,
            fontSize: "0.85rem",
            color: "#cbd5e1",
            flexShrink: 0,
          }}
        >
          {request.farmerInitials}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#F4F4F5" }}
          >
            {request.farmerName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#A1A1AA", fontSize: "0.72rem" }}
          >
            {isLandowner ? "Landowner" : "Farmer"} • {request.location}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.25,
            py: 0.45,
            borderRadius: 1.5,
            background: statusStyle.bg,
          }}
        >
          <span
            className="material-icons"
            style={{ fontSize: 13, color: statusStyle.text }}
          >
            {icon}
          </span>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: statusStyle.text,
              fontSize: "0.68rem",
              whiteSpace: "nowrap",
            }}
          >
            {request.statusBadge.label}
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: "#A1A1AA",
          fontSize: "0.74rem",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          mb: 1.25,
          pl: 1,
        }}
      >
        {request.description}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pl: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "#71717A", fontSize: "0.67rem", fontWeight: 500 }}
        >
          {request.timestamp}
        </Typography>
        <Stack direction="row" spacing={0.75}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => e.stopPropagation()}
            sx={{
              fontSize: "0.67rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 1.5,
              borderColor: "rgba(255,255,255,0.12)",
              color: "#94a3b8",
              py: 0.35,
              minWidth: 0,
              px: 1.25,
              "&:hover": {
                borderColor: `${statusStyle.text}45`,
                color: statusStyle.text,
              },
            }}
          >
            View
          </Button>
          {request.statusBadge.variant === "accepted" ? (
            <Button
              size="small"
              variant="contained"
              onClick={(e) => e.stopPropagation()}
              sx={{
                fontSize: "0.67rem",
                fontWeight: 800,
                textTransform: "none",
                borderRadius: 1.5,
                py: 0.35,
                px: 1.25,
                minWidth: 0,
                background: `linear-gradient(135deg, #85a446 0%, #aed95c 100%)`,
                color: "#fff",
                boxShadow: "0 2px 8px rgba(133,164,70,0.35)",
              }}
            >
              Message
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              onClick={(e) => e.stopPropagation()}
              sx={{
                fontSize: "0.67rem",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 1.5,
                py: 0.35,
                px: 1.25,
                minWidth: 0,
                borderColor: "#f87171",
                color: "#f87171",
                "&:hover": {
                  background: "rgba(248,113,113,0.1)",
                  borderColor: "#f87171",
                },
              }}
            >
              Withdraw
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState<"incoming" | "sent" | "history">(
    "incoming",
  );
  const [incomingSubTab, setIncomingSubTab] = useState<
    "agreements" | "farmer-requests"
  >("agreements");
  const [sentFilter, setSentFilter] = useState<"landowner" | "farmer">(
    "landowner",
  );
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null,
  );

  const handleTabChange = (_: unknown, val: string) => {
    setActiveTab(val as typeof activeTab);
    setSelectedRequest(null);
  };
  const handleUploadAgreement = () => console.log("Upload agreement");
  const handleSelect = (r: RequestData) =>
    setSelectedRequest((prev) => (prev?.id === r.id ? null : r));

  const journeySteps =
    selectedRequest?.journeySteps.map((step) =>
      step.status === "active" && step.icon === "upload_file"
        ? {
            ...step,
            uploadArea: {
              text: "Click to upload PDF",
              onUpload: handleUploadAgreement,
            },
          }
        : step,
    ) ?? [];

  const totalIncoming =
    agreementsPendingData.length + farmerRequestsData.length;
  const totalSent = sentRequestsData.length;
  const sentLandowners = (sentRequestsData as RequestData[]).filter(
    (r) => r.recipientType === "landowner",
  );
  const sentFarmers = (sentRequestsData as RequestData[]).filter(
    (r) => r.recipientType === "farmer",
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#09090B",
      }}
    >
      <Box sx={{ px: 4, pt: 4, pb: 0, flexShrink: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "#f1f5f9",
                mb: 0.75,
                letterSpacing: -0.3,
              }}
            >
              Requests Management
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <NotificationsActive sx={{ fontSize: 15, color: "#fb923c" }} />
              <Typography
                variant="caption"
                sx={{ color: "#fb923c", fontWeight: 800, fontSize: "0.8rem" }}
              >
                {totalIncoming} Actions Needed
              </Typography>
              <Typography variant="caption" sx={{ color: "#71717A" }}>
                •
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#A1A1AA", fontSize: "0.78rem" }}
              >
                Categorized farmer inquiries and pending agreements
              </Typography>
            </Stack>
          </Box>

          <Button
            startIcon={<Add />}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #85a446 0%, #aed95c 100%)",
              color: "#fff",
              fontWeight: 800,
              borderRadius: 2,
              px: 2.5,
              py: 1,
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(133,164,70,0.35)",
              "&:hover": {
                boxShadow: "0 6px 22px rgba(133,164,70,0.45)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.25s ease",
            }}
          >
            New Inquiry
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 44,
              "& .MuiTabs-indicator": {
                background: "#A3E635",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.83rem",
                color: "#A1A1AA",
                minHeight: 44,
                px: 2,
                "&.Mui-selected": { color: "#F4F4F5", fontWeight: 700 },
              },
            }}
          >
            <Tab
              value="incoming"
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Inbox sx={{ fontSize: 17 }} />
                  <span>Incoming Requests</span>
                  <Chip
                    label={totalIncoming}
                    size="small"
                    sx={{
                      height: 19,
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      bgcolor: "rgba(251,146,60,0.2)",
                      color: "#fb923c",
                      border: "1px solid rgba(251,146,60,0.4)",
                      minWidth: 24,
                    }}
                  />
                </Stack>
              }
            />
            <Tab
              value="sent"
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Send sx={{ fontSize: 16 }} />
                  <span>My Sent Requests</span>
                  <Chip
                    label={totalSent}
                    size="small"
                    sx={{
                      height: 19,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: "#E2E8F0",
                      minWidth: 24,
                    }}
                  />
                </Stack>
              }
            />
            <Tab
              value="history"
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <History sx={{ fontSize: 17 }} />
                  <span>History</span>
                </Stack>
              }
            />
          </Tabs>

          <Stack direction="row" spacing={1}>
            {[
              {
                label: "Urgent",
                icon: <PriorityHigh sx={{ fontSize: 12 }} />,
                color: "#f87171",
                bg: "rgba(248,113,113,0.1)",
                border: "rgba(248,113,113,0.35)",
              },
              {
                label: "High-Value",
                icon: <AttachMoney sx={{ fontSize: 12 }} />,
                color: "#fbbf24",
                bg: "rgba(251,191,36,0.1)",
                border: "rgba(251,191,36,0.35)",
              },
              {
                label: "Verified",
                icon: <Verified sx={{ fontSize: 12 }} />,
                color: "#aed95c",
                bg: "rgba(174,217,92,0.1)",
                border: "rgba(174,217,92,0.35)",
              },
            ].map(({ label, icon, color, bg, border }) => (
              <Chip
                key={label}
                icon={<Box sx={{ color, display: "flex" }}>{icon}</Box>}
                label={label}
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  height: 26,
                  cursor: "pointer",
                  background: bg,
                  color,
                  border: `1.5px solid ${border}`,
                  "&:hover": { opacity: 0.8 },
                  "& .MuiChip-icon": { ml: 0.75 },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mt: 0 }} />

      <Box sx={{ flex: 1, overflow: "hidden", display: "flex" }}>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {activeTab === "incoming" && (
            <Box
              sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: 0.5,
                  borderRadius: "24px",
                  background: "transparent",
                  border: "1px solid #27272A",
                  width: "fit-content",
                }}
              >
                <SubNavPill
                  label="Agreements Pending"
                  icon={<PendingActions sx={{ fontSize: 16 }} />}
                  count={agreementsPendingData.length}
                  active={incomingSubTab === "agreements"}
                  onClick={() => {
                    setIncomingSubTab("agreements");
                    setSelectedRequest(null);
                  }}
                />
                <SubNavPill
                  label="Initial Farmer Requests"
                  icon={<Inbox sx={{ fontSize: 16 }} />}
                  count={farmerRequestsData.length}
                  active={incomingSubTab === "farmer-requests"}
                  onClick={() => {
                    setIncomingSubTab("farmer-requests");
                    setSelectedRequest(null);
                  }}
                />
              </Box>

              {incomingSubTab === "agreements" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 20,
                        borderRadius: 2,
                        background:
                          "linear-gradient(180deg, #fb923c 0%, #f59e0b 100%)",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 800,
                        color: "#fb923c",
                        fontSize: "0.82rem",
                        letterSpacing: 0.5,
                      }}
                    >
                      AGREEMENTS AWAITING YOUR ACTION
                    </Typography>
                    <Chip
                      label={agreementsPendingData.length}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        bgcolor: "rgba(251,146,60,0.15)",
                        color: "#fb923c",
                        border: "1px solid rgba(251,146,60,0.4)",
                      }}
                    />
                  </Box>
                  {(agreementsPendingData as RequestData[]).map((a) => (
                    <div key={a.id} onClick={() => handleSelect(a)}>
                      <RequestCard
                        type="agreement"
                        name={a.farmerName}
                        avatarUrl={a.farmerAvatar || undefined}
                        avatarInitials={a.farmerInitials}
                        location={a.location}
                        statusBadge={a.statusBadge}
                        tags={a.tags}
                        description={a.description}
                        timestamp={a.timestamp}
                        primaryAction={{
                          label: "Upload Agreement",
                          icon: "upload_file",
                          onClick: handleUploadAgreement,
                        }}
                        highlighted={a.highlighted}
                        isSelected={selectedRequest?.id === a.id}
                      />
                    </div>
                  ))}
                </Box>
              )}

              {incomingSubTab === "farmer-requests" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 20,
                        borderRadius: 2,
                        background:
                          "linear-gradient(180deg, #aed95c 0%, #85a446 100%)",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 800,
                        color: "#aed95c",
                        fontSize: "0.82rem",
                        letterSpacing: 0.5,
                      }}
                    >
                      INCOMING FARMER REQUESTS
                    </Typography>
                    <Chip
                      label={farmerRequestsData.length}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        bgcolor: "rgba(174,217,92,0.12)",
                        color: "#aed95c",
                        border: "1px solid rgba(174,217,92,0.35)",
                      }}
                    />
                  </Box>
                  {(farmerRequestsData as RequestData[]).map((r) => (
                    <div key={r.id} onClick={() => handleSelect(r)}>
                      <RequestCard
                        type="farmer-request"
                        name={r.farmerName}
                        avatarUrl={r.farmerAvatar || undefined}
                        avatarInitials={r.farmerInitials}
                        location={r.location}
                        isVerified={r.isVerified}
                        statusBadge={r.statusBadge}
                        tags={r.tags}
                        description={r.description}
                        timestamp={r.timestamp}
                        primaryAction={{
                          label: "Review Request",
                          onClick: () => console.log("Review"),
                        }}
                        highlighted={r.highlighted}
                        isSelected={selectedRequest?.id === r.id}
                      />
                    </div>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {activeTab === "sent" && (
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1.25,
                  p: 0.5,
                  mb: 3,
                  borderRadius: "24px",
                  background: "transparent",
                  border: "1px solid #27272A",
                  width: "fit-content",
                }}
              >
                <SubNavPill
                  label="Landowners"
                  icon={<Landscape sx={{ fontSize: 16 }} />}
                  count={sentLandowners.length}
                  active={sentFilter === "landowner"}
                  onClick={() => setSentFilter("landowner")}
                />
                <SubNavPill
                  label="Farmers"
                  icon={<Agriculture sx={{ fontSize: 16 }} />}
                  count={sentFarmers.length}
                  active={sentFilter === "farmer"}
                  onClick={() => setSentFilter("farmer")}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      borderRadius: 2,
                      background:
                        sentFilter === "landowner"
                          ? "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)"
                          : "linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                      color: sentFilter === "landowner" ? "#fbbf24" : "#60a5fa",
                      fontSize: "0.82rem",
                      letterSpacing: 0.5,
                    }}
                  >
                    {sentFilter === "landowner"
                      ? "LANDOWNER CONNECTION REQUESTS"
                      : "FARMER CONNECTION REQUESTS"}
                  </Typography>
                </Box>
                {(sentFilter === "landowner"
                  ? sentLandowners
                  : sentFarmers
                ).map((r) => (
                  <SentCard
                    key={r.id}
                    request={r}
                    isSelected={selectedRequest?.id === r.id}
                    onClick={() => handleSelect(r)}
                  />
                ))}
              </Box>
            </Box>
          )}
          {activeTab === "history" && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 14,
                gap: 1.5,
                opacity: 0.3,
              }}
            >
              <History sx={{ fontSize: 52 }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                No History Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed and archived requests will appear here.
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            width: { lg: 370, xl: 410 },
            flexShrink: 0,
            borderLeft: "1px solid rgba(255,255,255,0.07)",
            overflowY: "auto",
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            background: "#0a0a0a",
          }}
        >
          {selectedRequest ? (
            <ConnectionJourney
              requestId={selectedRequest.id}
              farmerName={selectedRequest.farmerName}
              steps={journeySteps}
            />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                gap: 1.5,
                opacity: 0.25,
              }}
            >
              <Tune sx={{ fontSize: 42 }} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Select a request
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
              >
                Click any card to view the connection journey.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RequestsPage;
