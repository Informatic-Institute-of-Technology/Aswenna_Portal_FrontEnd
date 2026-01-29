import DashboardLayout from '@/layouts/DashboardLayout';
import type { FarmerJob, InvestmentRequest } from '@/types/farmer.types';
import { AccountBalanceWallet, Handshake } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { SectionHeader, TabNavigation, type TabItem } from '../../components/common';
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
  };

  const tabs: TabItem[] = [
    {
      value: 'investments',
      label: 'Investment Opportunities',
      icon: <AccountBalanceWallet sx={{ fontSize: 20 }} />,
      count: investmentRequests.length,
    },
    {
      value: 'hire',
      label: 'Hire Farmers',
      icon: <Handshake sx={{ fontSize: 20 }} />,
      count: farmerJobs.length,
    },
  ];

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

        {/* Tabs Navigation */}
        <TabNavigation
          activeTab={activeTab}
          tabs={tabs}
          onChange={(value) => setActiveTab(value as 'investments' | 'hire')}
          variant="dark"
        />

        {activeTab === 'investments' && (
          <Box>
            <SectionHeader
              title="Investment Opportunities"
              description="Fund farmers' cultivation projects with detailed cost breakdowns and payment schedules"
              accentColor="#F7931E"
              showLeftBorder={true}
            />

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
            <SectionHeader
              title="Hire Farmers"
              description="Hire skilled farmers for various agricultural services"
              accentColor="#F7931E"
              showLeftBorder={true}
            />

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
