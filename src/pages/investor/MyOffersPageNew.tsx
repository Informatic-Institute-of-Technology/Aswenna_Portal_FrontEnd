import DashboardLayout from '@/layouts/DashboardLayout';
import type { DirectHarvestOffer, InvestorOffer, SponsorshipOffer } from '@/types';
import { FilterList, Settings } from '@mui/icons-material';
import { Box, Button, IconButton, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { CreateOfferButton, CreateOfferDialog, OfferCardNew as OfferCard } from '../../components/investor';
import { completedOffersData, directHarvestOffersData, sponsorshipOffersData } from '../../data/json';

// Import mock data from JSON files
const mockDirectHarvestOffers: DirectHarvestOffer[] = directHarvestOffersData as DirectHarvestOffer[];
const mockSponsorshipOffers: SponsorshipOffer[] = sponsorshipOffersData as SponsorshipOffer[];
const mockCompletedOffers: InvestorOffer[] = completedOffersData as InvestorOffer[];

type OfferFilter = 'all' | 'direct-harvest' | 'sponsorship';

const MyOffersPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [offerFilter, setOfferFilter] = useState<OfferFilter>('all');

  // Combine all active offers
  const activeOffers: InvestorOffer[] = [
    ...mockDirectHarvestOffers.filter(o => o.status !== 'completed'),
    ...mockSponsorshipOffers.filter(o => o.status !== 'completed')
  ];

  // Filter offers based on type
  const filteredOffers = activeOffers.filter(offer => {
    if (offerFilter === 'all') return true;
    return offer.offerType === offerFilter;
  });

  const handleCreateOffer = (offerData: Partial<DirectHarvestOffer> | Partial<SponsorshipOffer>) => {
    console.log('Creating offer:', offerData);
    setCreateDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            My Offers
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <CreateOfferButton onClick={() => setCreateDialogOpen(true)} />
            <Tooltip title="Settings">
              <IconButton>
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Tabs: Active / Past */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={`Active (${activeOffers.length})`} 
            value="active" 
          />
          <Tab 
            label={`Completed (${mockCompletedOffers.length})`} 
            value="past" 
          />
        </Tabs>

        {/* Active Offers Tab */}
        {activeTab === 'active' && (
          <>
            {/* Filter Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant={offerFilter === 'all' ? 'contained' : 'outlined'}
                onClick={() => setOfferFilter('all')}
                startIcon={<FilterList />}
              >
                All ({activeOffers.length})
              </Button>
              <Button
                variant={offerFilter === 'direct-harvest' ? 'contained' : 'outlined'}
                onClick={() => setOfferFilter('direct-harvest')}
                color="secondary"
              >
                Direct Harvest ({mockDirectHarvestOffers.filter(o => o.status !== 'completed').length})
              </Button>
              <Button
                variant={offerFilter === 'sponsorship' ? 'contained' : 'outlined'}
                onClick={() => setOfferFilter('sponsorship')}
                color="success"
              >
                Sponsorships ({mockSponsorshipOffers.filter(o => o.status !== 'completed').length})
              </Button>
            </Box>

            {/* Offers Grid */}
            {filteredOffers.length > 0 ? (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: 3 
              }}>
                {filteredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                color: 'text.secondary'
              }}>
                <Typography variant="h6" gutterBottom>
                  No active offers
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Create your first offer to get started
                </Typography>
                <CreateOfferButton onClick={() => setCreateDialogOpen(true)} />
              </Box>
            )}
          </>
        )}

        {/* Completed Offers Tab */}
        {activeTab === 'past' && (
          <>
            {mockCompletedOffers.length > 0 ? (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: 3 
              }}>
                {mockCompletedOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                color: 'text.secondary'
              }}>
                <Typography variant="h6">
                  No completed offers yet
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Create Offer Dialog */}
        <CreateOfferDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateOffer}
        />
      </Box>
    </DashboardLayout>
  );
};

export default MyOffersPage;
