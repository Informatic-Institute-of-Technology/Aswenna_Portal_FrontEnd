import type { FarmerJob, InvestmentRequest } from "@/types/farmer.types";
import { AccountBalanceWallet, Handshake } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import {
  SectionHeader,
  TabNavigation,
  type TabItem,
} from "../../components/common";
import FarmerJobCard from "../../components/farmer/FarmerJobCard";
import InvestmentRequestCard from "../../components/investor/InvestmentRequestCard";
import InvestmentRequestDialog from "../../components/investor/InvestmentRequestDialog";
import HireFarmerDialog from "../../components/investor/HireFarmerDialog";
import { farmerJobsData, investmentRequestsData } from "../../data/json";
import { FarmerJobType } from "../../types/farmer.types";
import Notification from "../../shared/components/Notification";
import { getInvestorOffers } from "../../services/offer.service";
import { useEffect } from "react";

const OpportunitiesPage = () => {
  const [activeTab, setActiveTab] = useState<"investments" | "hire">("investments");
  const [selectedRequest, setSelectedRequest] = useState<InvestmentRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [hireDialogOpen, setHireDialogOpen] = useState(false);
  const [selectedFarmerForHire, setSelectedFarmerForHire] = useState<FarmerJob | null>(null);
  const [liveOffers, setLiveOffers] = useState<any[]>([]);

  const [notification, setNotification] = useState<{ open: boolean, message: string }>({ open: false, message: "" });

  useEffect(() => {
    getInvestorOffers().then((res) => {
      if (res.data) {
        const mappedOffers = res.data
          .filter(offer => offer.offerType === 'direct-harvest' && offer.status !== 'completed' && offer.status !== 'cancelled')
          .map(offer => {
            const details = (offer as any).harvestBaseDetails;
            return {
              id: offer._id,
              projectTitle: details?.projectTitle || 'Untitled Harvest',
              cropType: details?.cropType || 'Crop',
              cropIcon: '🌾',
              requiredQuantity: details?.requiredQuantity || 0,
              quantityUnit: details?.quantityUnit || 'kg',
              totalBudget: details?.totalBudget || 0,
            };
          });
        setLiveOffers(mappedOffers);
      }
    }).catch(err => console.error("Failed to load offers", err));
  }, []);

  const investmentRequests = (investmentRequestsData as InvestmentRequest[]).filter((req) => req.status === "open");

  const allFarmerJobs = farmerJobsData as FarmerJob[];
  const farmerJobs = allFarmerJobs.filter(
    (job) => job.jobType === FarmerJobType.COMMISSION && job.status === "OPEN"
  );

  const handleViewDetails = (request: InvestmentRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleInvest = (id: string) => {
    console.log("Invest in request:", id);
  };

  const handleOpenHireDialog = (farmer: FarmerJob) => {
    setSelectedFarmerForHire(farmer);
    setHireDialogOpen(true);
  };

  const handleCloseHireDialog = () => {
    setHireDialogOpen(false);
    setSelectedFarmerForHire(null);
  };

  const handleHireSubmit = (farmer: FarmerJob, offer: any) => {
    setNotification({
      open: true,
      message: `The Project ${offer.projectTitle} ${farmer.farmerName} has been requested`
    });
    setHireDialogOpen(false);
    setSelectedFarmerForHire(null);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const tabs: TabItem[] = [
    {
      value: "investments",
      label: "Investment Opportunities",
      icon: <AccountBalanceWallet sx={{ fontSize: 20 }} />,
      count: investmentRequests.length,
    },
    {
      value: "hire",
      label: "Hire Farmers",
      icon: <Handshake sx={{ fontSize: 20 }} />,
      count: farmerJobs.length,
    },
  ];

  return (
    <>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Opportunities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore investment opportunities and hire skilled farmers
          </Typography>
        </Box>

        <TabNavigation
          activeTab={activeTab}
          tabs={tabs}
          onChange={(value) => setActiveTab(value as "investments" | "hire")}
          variant="dark"
        />

        {activeTab === "investments" && (
          <Box>
            <SectionHeader
              title="Investment Opportunities"
              description="Fund farmers' cultivation projects with detailed cost breakdowns and payment schedules"
              accentColor="var(--color-brand-accent)"
              showLeftBorder={true}
            />

            {investmentRequests.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                  gap: 3,
                }}
              >
                {investmentRequests.map((request) => (
                  <InvestmentRequestCard
                    key={request.id}
                    request={request}
                    onViewDetails={handleViewDetails}
                  />
                ))}
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
                  No investment opportunities available
                </Typography>
                <Typography variant="body2">
                  Check back later for new farmer funding requests
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {activeTab === "hire" && (
          <Box>
            <SectionHeader
              title="Hire Farmers"
              description="Hire skilled farmers for various agricultural services"
              accentColor="var(--color-brand-accent)"
              showLeftBorder={true}
            />

            {farmerJobs.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: 3,
                }}
              >
                {farmerJobs.map((job) => (
                  <FarmerJobCard
                    key={job.id}
                    job={job}
                    onViewMore={(job) => console.log("View job:", job)}
                    onConnect={(job) => console.log("Connect to job:", job)}
                    onHire={handleOpenHireDialog}
                  />
                ))}
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
                  No farmers available for hire
                </Typography>
                <Typography variant="body2">
                  Check back later for available services
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <InvestmentRequestDialog
        request={selectedRequest}
        open={dialogOpen}
        onClose={handleCloseDialog}
        onInvest={handleInvest}
      />

      <HireFarmerDialog
        open={hireDialogOpen}
        onClose={handleCloseHireDialog}
        farmer={selectedFarmerForHire}
        offers={liveOffers}
        onSubmit={handleHireSubmit}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity="success"
        duration={5000}
        onClose={handleCloseNotification}
      />
    </>
  );
};

export default OpportunitiesPage;
