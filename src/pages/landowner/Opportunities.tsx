import type { AlertColor } from "@mui/material";
import {
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import Notification from "../../shared/components/Notification";
import { getInvestorOffersPaginated } from "../../services/offer.service";
import { RequestCard } from "../../components/investor/requests";

interface HarvestOffer {
  _id: string;
  investor?: {
    _id: string;
    fullName: string;
  };
  harvestBaseDetails?: {
    projectTitle: string;
    cropType: string;
    projectDuration: number;
    durationUnit: string;
    totalBudget: number;
    deliveryLocation: string;
    companyName?: string;
  };
  currency: string;
  status: string;
}

const ReceivedRequestsPage = () => {
  const [offers, setOffers] = useState<HarvestOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await getInvestorOffersPaginated(1, 50);
        const data = res.data as any;
        
        if (data && Array.isArray(data.data)) {
          const activeOffers = (data.data as HarvestOffer[]).filter(
            (o: any) => o.status === 'active' && o.harvestBaseDetails
          );
          setOffers(activeOffers);
        }
      } catch (err) {
        console.error('Failed to fetch investor harvest offers', err);
        setNotification({
          open: true,
          message: 'Failed to load investment opportunities',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchOffers();
  }, []);

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

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

        {/* Investor Direct Harvest Jobs Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Active Investment Opportunities ({offers.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Direct harvest investment requests from verified investors looking to collaborate.
          </Typography>

          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading opportunities...
            </Typography>
          ) : offers.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: 3,
              }}
            >
              {offers.map((offer) => {
                const investor = offer.investor;
                const details = offer.harvestBaseDetails;
                
                return (
                  <RequestCard
                    key={offer._id}
                    type="agreement"
                    name={investor?.fullName || "Investor"}
                    avatarInitials={
                      investor?.fullName
                        ?.split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "IN"
                    }
                    location={details?.deliveryLocation || "Sri Lanka"}
                    statusBadge={{
                      label: "Active",
                      variant: "new" as const,
                    }}
                    tags={[
                      {
                        label: details?.cropType || "Agriculture",
                        variant: "primary",
                      },
                      {
                        label: `${details?.projectDuration || 0} ${details?.durationUnit || 'months'}`,
                        variant: "secondary",
                      },
                      {
                        label: `LKR ${(details?.totalBudget || 0).toLocaleString()} budget`,
                        variant: "secondary",
                      },
                    ]}
                    description={details?.projectTitle || "Investment opportunity"}
                    timestamp={new Date().toLocaleString()}
                    primaryAction={{
                      label: "View Details",
                      onClick: () => {
                        setNotification({
                          open: true,
                          message: `Viewing opportunity from ${investor?.fullName}`,
                          severity: 'info',
                        });
                      },
                    }}
                    secondaryAction={{
                      label: "Interested",
                      onClick: () => {
                        setNotification({
                          open: true,
                          message: `Interest registered in ${details?.cropType} opportunity`,
                          severity: 'success',
                        });
                      },
                    }}
                    isVerified={true}
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
                No active opportunities at the moment
              </Typography>
              <Typography variant="body2">
                Check back soon for new investor opportunities or publish your land ad to attract investors.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

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
