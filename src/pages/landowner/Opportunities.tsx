import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import InboxIcon from "@mui/icons-material/Inbox";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import type { AlertColor } from "@mui/material";
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
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { SectionHeader, TabNavigation, type TabItem } from "../../components/common";
import { RequestCard } from "../../components/investor/requests";
import Notification from "../../shared/components/Notification";

type RequestStatus = "pending" | "approved" | "declined";

interface LandRequest {
  request_id: string;
  ad_id: string;
  land_name: string;
  investor_info: {
    id: string;
    name: string;
    rating: number;
    is_verified: boolean;
    company: string;
  };
  financials: {
    landowner_asking_price: number;
    currency: string;
  };
  proposal_details: {
    project_type: string;
    duration: string;
    description: string;
  };
  status: RequestStatus;
  timestamp: string;
}

const requestData: { requests: LandRequest[] } = {
  requests: [
    {
      request_id: "REQ-7721",
      ad_id: "LAND-001",
      land_name: "Green Valley Plantation",
      investor_info: {
        id: "INV-552",
        name: "Alex Sterling",
        rating: 4.9,
        is_verified: true,
        company: "EcoHarvest Ventures",
      },
      financials: {
        landowner_asking_price: 25000.0,
        currency: "LKR",
      },
      proposal_details: {
        project_type: "Organic Berries",
        duration: "15 months",
        description:
          "We plan to implement high-tech drip irrigation for a sustainable strawberry farm.",
      },
      status: "pending",
      timestamp: "2026-02-14T09:30:00Z",
    },
    {
      request_id: "REQ-7722",
      ad_id: "LAND-002",
      land_name: "Green Valley Plantation",
      investor_info: {
        id: "INV-400",
        name: "Samantha Gunarathne",
        rating: 4.4,
        is_verified: true,
        company: "Samantha Agro",
      },
      financials: {
        landowner_asking_price: 25000.0,
        currency: "LKR",
      },
      proposal_details: {
        project_type: "Green Veg",
        duration: "12 months",
        description:
          "We plan to implement high-tech drip irrigation for a sustainable green vegetables farm.",
      },
      status: "pending",
      timestamp: "2026-02-14T09:30:00Z",
    },
    {
      request_id: "REQ-7723",
      ad_id: "LAND-005",
      land_name: "Green Valley Plantation",
      investor_info: {
        id: "INV-708",
        name: "Dinesh Keerthirathne",
        rating: 4.0,
        is_verified: true,
        company: "EcoHarvest Ventures",
      },
      financials: {
        landowner_asking_price: 25000.0,
        currency: "LKR",
      },
      proposal_details: {
        project_type: "Fruits",
        duration: "8 months",
        description:
          "We plan to implement high-tech drip irrigation for a sustainable fruits farm.",
      },
      status: "pending",
      timestamp: "2026-02-14T09:30:00Z",
    },
  ],
};

const formatMoney = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatTimestamp = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ReceivedRequestsPage = () => {
  const [activeTab, setActiveTab] = useState<"incoming">("incoming");
  const [requests, setRequests] = useState<LandRequest[]>(requestData.requests);
  const [selectedRequest, setSelectedRequest] = useState<LandRequest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests],
  );

  const tabs: TabItem[] = [
    {
      value: "incoming",
      label: "Incoming Investor Requests",
      icon: <InboxIcon sx={{ fontSize: 20 }} />,
      count: pendingRequests.length,
    },
  ];

  const handleOpenDetails = (request: LandRequest) => {
    setSelectedRequest(request);
    setDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailOpen(false);
    setSelectedRequest(null);
  };

  const handleStatusChange = (
    requestId: string,
    newStatus: RequestStatus,
    showToast = true,
  ) => {
    setRequests((prevRequests) => {
      const matchedRequest = prevRequests.find(
        (request) => request.request_id === requestId,
      );

      if (showToast && matchedRequest) {
        const actionLabel = newStatus === "approved" ? "approved" : "declined";
        setNotification({
          open: true,
          message: `Request from ${matchedRequest.investor_info.name} was ${actionLabel}.`,
          severity: newStatus === "approved" ? "success" : "info",
        });
      }

      return prevRequests.map((request) =>
        request.request_id === requestId
          ? { ...request, status: newStatus }
          : request,
      );
    });

    if (selectedRequest?.request_id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
      if (newStatus !== "pending") {
        setDetailOpen(false);
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const selectedCurrency = selectedRequest?.financials.currency ?? "LKR";

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Opportunities
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review incoming investor proposals for your land opportunities.
          </Typography>
        </Box>

        <TabNavigation
          activeTab={activeTab}
          tabs={tabs}
          onChange={(value) => setActiveTab(value as "incoming")}
          variant="dark"
        />

        {activeTab === "incoming" && (
          <Box>
            <SectionHeader
              title="Incoming Investor Requests"
              description="Only active investor requests are shown here. Open any request to review full proposal details and respond."
              accentColor="var(--color-brand-accent)"
              showLeftBorder={true}
            />

            {pendingRequests.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: 3,
                }}
              >
                {pendingRequests.map((request) => {
                  const investor = request.investor_info;
                  return (
                    <RequestCard
                      key={request.request_id}
                      type="agreement"
                      name={investor.name}
                      avatarInitials={investor.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                      location={request.land_name}
                      statusBadge={{
                        label: "Pending Review",
                        variant: "pending",
                      }}
                      tags={[
                        {
                          label: request.proposal_details.project_type,
                          variant: "primary",
                        },
                        {
                          label: request.proposal_details.duration,
                          variant: "secondary",
                        },
                        {
                          label: `${formatMoney(
                            request.financials.landowner_asking_price,
                            request.financials.currency,
                          )} asking`,
                          variant: "secondary",
                        },
                      ]}
                      description={request.proposal_details.description}
                      timestamp={formatTimestamp(request.timestamp)}
                      primaryAction={{
                        label: "View Details",
                        onClick: () => handleOpenDetails(request),
                      }}
                      secondaryAction={{
                        label: "Approve",
                        onClick: () =>
                          handleStatusChange(request.request_id, "approved"),
                      }}
                      isVerified={investor.is_verified}
                    />
                  );
                })}
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: "var(--surface-tint)",
                  borderRadius: 2,
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No incoming investor requests
                </Typography>
                <Typography variant="body2">
                  New investor requests will appear here when they arrive.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Dialog open={detailOpen} onClose={handleCloseDetails} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: 1,
          }}
        >
          Proposal Details
          <Button
            size="small"
            onClick={handleCloseDetails}
            startIcon={<CloseIcon />}
          ></Button>
        </DialogTitle>

        {selectedRequest && (
          <>
            <DialogContent dividers>
              <Stack spacing={3}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Investor Identity
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 56, height: 56 }}>
                      {selectedRequest.investor_info.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </Avatar>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {selectedRequest.investor_info.name}
                        </Typography>
                        {selectedRequest.investor_info.is_verified && (
                          <Chip
                            icon={<VerifiedIcon />}
                            label="Verified"
                            color="success"
                            size="small"
                          />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {selectedRequest.investor_info.company}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        sx={{ mt: 0.5 }}
                      >
                        <StarIcon color="warning" fontSize="small" />
                        <Typography variant="body2">
                          {selectedRequest.investor_info.rating.toFixed(1)} / 5.0
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Stack spacing={1}>
                    <Typography variant="body1">
                      Asking Price:{" "}
                      <strong>
                        {formatMoney(
                          selectedRequest.financials.landowner_asking_price,
                          selectedCurrency,
                        )}
                      </strong>
                    </Typography>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Project Proposal
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.7 }}>
                    <strong>Type:</strong>{" "}
                    {selectedRequest.proposal_details.project_type}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1.2 }}>
                    <strong>Duration:</strong>{" "}
                    {selectedRequest.proposal_details.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRequest.proposal_details.description}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                color="success"
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={() =>
                  handleStatusChange(selectedRequest.request_id, "approved")
                }
              >
                Approve Request
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() =>
                  handleStatusChange(selectedRequest.request_id, "declined")
                }
              >
                Decline
              </Button>
              <Button variant="contained" startIcon={<ChatIcon />}>
                Chat with Investor
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        duration={4000}
        onClose={handleCloseNotification}
      />
    </>
  );
};

export default ReceivedRequestsPage;
