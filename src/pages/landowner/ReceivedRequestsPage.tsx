import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
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
  const [requests, setRequests] = useState<LandRequest[]>(requestData.requests);
  const [selectedRequest, setSelectedRequest] = useState<LandRequest | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests],
  );

  const handleOpenDetails = (request: LandRequest) => {
    setSelectedRequest(request);
    setDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailOpen(false);
  };

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.request_id === requestId
          ? { ...request, status: newStatus }
          : request,
      ),
    );
    if (selectedRequest?.request_id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  const selectedCurrency = selectedRequest?.financials.currency ?? "LKR";

  return (
    <>
      <Box className="container-fluid" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Received Requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and manage proposals from investors interested in your land.
          You can compare offers, view investor profiles, and message them
          directly to finalize details.
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        {pendingRequests.map((request) => {
          const { financials, investor_info } = request;

          return (
            <Box
              key={request.request_id}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                background: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    New proposal for {request.land_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Received from {investor_info.name} •{" "}
                    {formatTimestamp(request.timestamp)}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDetails(request)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      handleStatusChange(request.request_id, "approved")
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      handleStatusChange(request.request_id, "declined")
                    }
                  >
                    Decline
                  </Button>
                </Stack>
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {pendingRequests.length === 0 && (
        <Box
          sx={{
            mt: 2,
            textAlign: "center",
            p: 6,
            borderRadius: 2,
            border: "2px dashed",
            borderColor: "divider",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No Pending Proposals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            New investor requests will appear here.
          </Typography>
        </Box>
      )}

      <Dialog
        open={detailOpen}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
      >
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
                        .slice(0, 2)}
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
                          {selectedRequest.investor_info.rating.toFixed(1)} /
                          5.0
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
    </>
  );
};

export default ReceivedRequestsPage;
