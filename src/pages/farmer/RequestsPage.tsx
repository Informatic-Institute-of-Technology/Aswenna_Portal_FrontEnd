import {
  Add,
  History,
  Inbox,
  PendingActions,
  Send,
  TrendingUp,
} from "@mui/icons-material";
import {
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
import investmentRequestsData from "../../data/json/investmentRequests.json";
import sentRequestsData from "../../data/json/sentRequests.json";

interface JourneyStep {
  title: string;
  description: string;
  timestamp?: string;
  status: "completed" | "active" | "pending";
  icon?: string;
  uploadArea?: {
    text: string;
    onUpload: () => void;
  };
}

interface RequestData {
  id: string;
  projectId?: string;
  partyType?: "farmer" | "landowner";
  recipientType?: "farmer" | "landowner";
  farmerName: string;
  farmerAvatar: string | null;
  farmerInitials: string;
  projectTitle?: string;
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
  journeySteps: JourneyStep[];
  insight?: string;
  highlighted: boolean;
  investmentAmount?: string;
}

interface InvestmentRequestSource {
  id: string;
  farmerName?: string;
  projectTitle?: string;
  description?: string;
  cropType?: string;
  landSize?: number;
  landSizeUnit?: string;
  location?: string;
  district?: string;
  totalInvestmentRequired?: number;
}

const getInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

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

const FarmerRequestsPage = () => {
  const [activeTab, setActiveTab] = useState<"incoming" | "sent" | "history">(
    "incoming",
  );
  const [incomingSubTab, setIncomingSubTab] = useState<
    "agreements" | "investor-requests"
  >("agreements");
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null,
  );

  const incomingInvestorRequests = (sentRequestsData as RequestData[])
    .filter((request) => request.recipientType === "farmer")
    .map((request) => ({
      ...request,
      tags: [
        ...request.tags,
        ...(request.investmentAmount
          ? [
              {
                label: request.investmentAmount,
                variant: "secondary" as const,
              },
            ]
          : []),
      ],
    }));

  const incomingAgreements = (agreementsPendingData as RequestData[])
    .filter((request) => request.partyType === "farmer")
    .map((request) => ({
      ...request,
      tags: [
        ...request.tags,
        ...(request.projectId
          ? [
              {
                label: request.projectId,
                variant: "secondary" as const,
              },
            ]
          : []),
      ],
    }));

  const sentInvestmentRequests = (
    investmentRequestsData as InvestmentRequestSource[]
  ).map((request, index) => {
    const amountLabel = `LKR ${Number(
      request.totalInvestmentRequired ?? 0,
    ).toLocaleString()}`;
    const location =
      request.district ?? request.location ?? "Location unavailable";
    const cropTag = request.cropType ?? "Cultivation";
    const sizeTags =
      request.landSize !== undefined && request.landSizeUnit
        ? [
            {
              label: `${request.landSize} ${request.landSizeUnit}`,
              variant: "secondary" as const,
            },
          ]
        : [];
    const farmerName = request.farmerName ?? "Farmer";

    return {
      id: request.id,
      farmerName,
      farmerAvatar: null,
      farmerInitials: getInitials(farmerName) || "FR",
      projectTitle: request.projectTitle,
      location,
      statusBadge: {
        label: "Pending Response",
        variant: "pending_response" as const,
      },
      tags: [
        { label: cropTag, variant: "primary" as const },
        ...sizeTags,
        { label: amountLabel, variant: "secondary" as const },
      ],
      description:
        request.description ??
        "Funding request submitted to matching investors.",
      timestamp: "Submitted • Waiting for investor response",
      journeySteps: [
        {
          title: "Request Submitted",
          description: "Funding request was sent successfully.",
          timestamp: "Just now",
          status: "completed",
          icon: "check",
        },
        {
          title: "Investor Review",
          description: "Investors are reviewing your request details.",
          status: "active",
          icon: "visibility",
        },
        {
          title: "Bond Confirmation",
          description: "Bond is created once both parties accept the request.",
          status: "pending",
        },
        {
          title: "Agreement Submission",
          description: "Upload signed agreement to start the project.",
          status: "pending",
          icon: "upload_file",
        },
      ],
      insight:
        "After investor acceptance, proceed with agreement submission to activate the project.",
      highlighted: index === 0,
      investmentAmount: amountLabel,
    } as RequestData;
  });

  const historyRequests = [
    ...incomingInvestorRequests,
    ...incomingAgreements,
  ].filter(
    (request) =>
      request.statusBadge.variant === "accepted" ||
      request.statusBadge.variant === "rejected",
  );

  const totalIncoming =
    incomingInvestorRequests.length + incomingAgreements.length;
  const totalSent = sentInvestmentRequests.length;

  const handleSelect = (request: RequestData) => {
    setSelectedRequest((previousRequest) =>
      previousRequest?.id === request.id ? null : request,
    );
  };

  const handleUploadAgreement = () => {
    console.log("Upload signed farmer agreement");
  };

  const handleTabChange = (_: unknown, value: string) => {
    setActiveTab(value as typeof activeTab);
    setSelectedRequest(null);
  };

  const journeySteps =
    selectedRequest?.journeySteps.map((step) =>
      step.status === "active" && step.icon === "upload_file"
        ? {
            ...step,
            uploadArea: {
              text: "Upload your signed agreement",
              onUpload: handleUploadAgreement,
            },
          }
        : step,
    ) ?? [];

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
              <Typography
                variant="caption"
                sx={{ color: "#fb923c", fontWeight: 800, fontSize: "0.8rem" }}
              >
                {totalIncoming} Incoming Actions
              </Typography>
              <Typography variant="caption" sx={{ color: "#71717A" }}>
                •
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#A1A1AA", fontSize: "0.78rem" }}
              >
                Investor connections and agreement steps for farmer requests
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
            New Request
          </Button>
        </Box>

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
                <span>My Requests</span>
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
                  count={incomingAgreements.length}
                  active={incomingSubTab === "agreements"}
                  onClick={() => {
                    setIncomingSubTab("agreements");
                    setSelectedRequest(null);
                  }}
                />
                <SubNavPill
                  label="Investor Requests"
                  icon={<TrendingUp sx={{ fontSize: 16 }} />}
                  count={incomingInvestorRequests.length}
                  active={incomingSubTab === "investor-requests"}
                  onClick={() => {
                    setIncomingSubTab("investor-requests");
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
                      label={incomingAgreements.length}
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

                  {incomingAgreements.length > 0 ? (
                    incomingAgreements.map((request) => (
                      <div
                        key={request.id}
                        onClick={() => handleSelect(request)}
                      >
                        <RequestCard
                          type="agreement"
                          name={request.farmerName}
                          avatarUrl={request.farmerAvatar || undefined}
                          avatarInitials={request.farmerInitials}
                          location={request.location}
                          statusBadge={request.statusBadge}
                          tags={request.tags}
                          description={request.description}
                          timestamp={request.timestamp}
                          primaryAction={{
                            label: "Upload Agreement",
                            icon: "upload_file",
                            onClick: handleUploadAgreement,
                          }}
                          secondaryAction={{
                            label: "View Contract",
                            onClick: () =>
                              console.log("View agreement contract"),
                          }}
                          highlighted={request.highlighted}
                          isSelected={selectedRequest?.id === request.id}
                        />
                      </div>
                    ))
                  ) : (
                    <Box
                      sx={{
                        border: "1px dashed #27272A",
                        borderRadius: 2,
                        p: 3,
                        color: "#71717A",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        No pending agreements
                      </Typography>
                      <Typography variant="caption">
                        Agreement requests appear here after investor connection
                        acceptance.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {incomingSubTab === "investor-requests" && (
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
                      INCOMING INVESTOR CONNECTION REQUESTS
                    </Typography>
                    <Chip
                      label={incomingInvestorRequests.length}
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

                  {incomingInvestorRequests.length > 0 ? (
                    incomingInvestorRequests.map((request) => (
                      <div
                        key={request.id}
                        onClick={() => handleSelect(request)}
                      >
                        <RequestCard
                          type="farmer-request"
                          name={request.farmerName}
                          avatarUrl={request.farmerAvatar || undefined}
                          avatarInitials={request.farmerInitials}
                          location={request.location}
                          isVerified={request.isVerified}
                          statusBadge={request.statusBadge}
                          tags={request.tags}
                          description={request.description}
                          timestamp={request.timestamp}
                          primaryAction={{
                            label: "Review Request",
                            onClick: () =>
                              console.log("Review investor request"),
                          }}
                          secondaryAction={{
                            label: "Create Bond",
                            onClick: () => console.log("Create investor bond"),
                          }}
                          highlighted={request.highlighted}
                          isSelected={selectedRequest?.id === request.id}
                        />
                      </div>
                    ))
                  ) : (
                    <Box
                      sx={{
                        border: "1px dashed #27272A",
                        borderRadius: 2,
                        p: 3,
                        color: "#71717A",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        No incoming investor requests
                      </Typography>
                      <Typography variant="caption">
                        Investor connection requests will appear here.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

          {activeTab === "sent" && (
            <Box
              sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 20,
                    borderRadius: 2,
                    background:
                      "linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                    color: "#60a5fa",
                    fontSize: "0.82rem",
                    letterSpacing: 0.5,
                  }}
                >
                  MY INVESTMENT REQUESTS
                </Typography>
              </Box>

              {sentInvestmentRequests.length > 0 ? (
                sentInvestmentRequests.map((request) => (
                  <div key={request.id} onClick={() => handleSelect(request)}>
                    <RequestCard
                      type="sent-request"
                      name={request.projectTitle ?? request.farmerName}
                      avatarInitials={request.projectTitle
                        ?.split(" ")
                        .slice(0, 2)
                        .map((part) => part.charAt(0).toUpperCase())
                        .join("")}
                      location={request.location}
                      statusBadge={request.statusBadge}
                      tags={request.tags}
                      description={request.description}
                      timestamp={request.timestamp}
                      primaryAction={{
                        label: "View Details",
                        onClick: () =>
                          console.log("View farmer request details"),
                      }}
                      secondaryAction={{
                        label: "Edit",
                        onClick: () => console.log("Edit farmer request"),
                      }}
                      highlighted={request.highlighted}
                      isSelected={selectedRequest?.id === request.id}
                    />
                  </div>
                ))
              ) : (
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
                  <Send sx={{ fontSize: 52 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    No Requests Sent
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create and send investment requests to investors.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {activeTab === "history" && (
            <Box
              sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {historyRequests.length > 0 ? (
                historyRequests.map((request) => (
                  <div key={request.id} onClick={() => handleSelect(request)}>
                    <RequestCard
                      type="sent-request"
                      name={request.projectTitle ?? request.farmerName}
                      avatarUrl={request.farmerAvatar || undefined}
                      avatarInitials={request.farmerInitials}
                      location={request.location}
                      isVerified={request.isVerified}
                      statusBadge={request.statusBadge}
                      tags={request.tags}
                      description={request.description}
                      timestamp={request.timestamp}
                      primaryAction={{
                        label: "View",
                        onClick: () => console.log("View history request"),
                      }}
                      highlighted={request.highlighted}
                      isSelected={selectedRequest?.id === request.id}
                    />
                  </div>
                ))
              ) : (
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
                    Completed and closed requests will appear here.
                  </Typography>
                </Box>
              )}
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
              farmerName={
                selectedRequest.projectTitle ?? selectedRequest.farmerName
              }
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
                gap: 1,
                color: "#71717A",
                textAlign: "center",
              }}
            >
              <Inbox sx={{ fontSize: 32 }} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Select a request
              </Typography>
              <Typography variant="caption">
                View bond timeline, agreement actions, and request status here.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FarmerRequestsPage;
