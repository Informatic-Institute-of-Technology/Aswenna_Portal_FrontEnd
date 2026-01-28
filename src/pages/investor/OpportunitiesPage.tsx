import DashboardLayout from '@/layouts/DashboardLayout';
import type { FarmerJob, InvestmentRequest } from '@/types/farmer.types';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import FarmerJobCard from '../../components/farmer/FarmerJobCard';
import InvestmentRequestCard from '../../components/investor/InvestmentRequestCard';
import InvestmentRequestDialog from '../../components/investor/InvestmentRequestDialog';
import farmerJobsData from '../../data/json/farmerJobs.json';
import investmentRequestsData from '../../data/json/investmentRequests.json';
import { FarmerJobType } from '../../types/farmer.types';

const OpportunitiesPage = () => {
  const [activeTab, setActiveTab] = useState<'investments' | 'hire'>('investments');
  const [selectedRequest, setSelectedRequest] = useState<InvestmentRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Investment opportunities - Farmers requesting funding for cultivation
  const investmentRequests = (investmentRequestsData as InvestmentRequest[]).filter(
    req => req.status === 'open'
  );

  // Farmer services available for hire (Commission jobs only)
  const allFarmerJobs = farmerJobsData as FarmerJob[];
  const farmerJobs = allFarmerJobs.filter(
    job => job.jobType === FarmerJobType.COMMISSION && job.status === 'OPEN'
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
    console.log('Invest in request:', id);
    // TODO: Open dialog to add commission rate and confirm investment
  };

  return (
    <DashboardLayout>
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

        {/* Tabs: Investments / Hire Farmers */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>💰</span>
                <span>Investment Opportunities ({investmentRequests.length})</span>
              </Box>
            } 
            value="investments" 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>🤝</span>
                <span>Hire Farmers ({farmerJobs.length})</span>
              </Box>
            } 
            value="hire" 
          />
        </Tabs>

        {/* Investment Opportunities Tab */}
        {activeTab === 'investments' && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                💰 Investment Opportunities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fund farmers' cultivation projects with detailed cost breakdowns and payment schedules
              </Typography>
            </Box>

            {investmentRequests.length > 0 ? (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: 3 
              }}>
                {investmentRequests.map((request) => (
                  <InvestmentRequestCard 
                    key={request.id} 
                    request={request}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                bgcolor: 'rgba(255,255,255,0.02)',
                borderRadius: 2,
                color: 'text.secondary'
              }}>
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

        {/* Hire Farmers Tab */}
        {activeTab === 'hire' && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                🤝 Hire Farmers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hire skilled farmers for various agricultural services
              </Typography>
            </Box>

            {farmerJobs.length > 0 ? (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: 3 
              }}>
                {farmerJobs.map((job) => (
                  <FarmerJobCard 
                    key={job.id} 
                    job={job}
                    onViewMore={(job) => console.log('View job:', job)}
                    onConnect={(job) => console.log('Connect to job:', job)}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                bgcolor: 'rgba(255,255,255,0.02)',
                borderRadius: 2,
                color: 'text.secondary'
              }}>
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

      {/* Investment Request Details Dialog */}
      <InvestmentRequestDialog
        request={selectedRequest}
        open={dialogOpen}
        onClose={handleCloseDialog}
        onInvest={handleInvest}
      />
    </DashboardLayout>
  );
};

export default OpportunitiesPage;
