import { CreateOfferButton, OfferCard } from '@/components/investor';
import type { OfferCardProps } from '@/components/investor';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Settings } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

// Mock data for active projects
const activeProjects: OfferCardProps[] = [
  {
    id: '1',
    projectName: 'Premium Rice Cultivation',
    cropType: 'Rice (Nadu)',
    cropIcon: '🌾',
    farmerName: 'Kamal Perera',
    farmerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    location: 'Anuradhapura',
    budget: 250000,
    expectedROI: 28,
    status: 'active',
    progress: 65,
    startDate: '2025-11-15',
    endDate: '2026-04-30',
    backgroundImage: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600',
  },
  {
    id: '2',
    projectName: 'Organic Vegetable Farm',
    cropType: 'Mixed Vegetables',
    cropIcon: '🥬',
    farmerName: 'Sunil Fernando',
    farmerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    location: 'Nuwara Eliya',
    budget: 180000,
    expectedROI: 35,
    status: 'active',
    progress: 40,
    startDate: '2025-12-01',
    endDate: '2026-03-15',
    backgroundImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600',
  },
  {
    id: '3',
    projectName: 'Tea Plantation Investment',
    cropType: 'Ceylon Tea',
    cropIcon: '🍵',
    farmerName: 'Nimal Jayawardena',
    farmerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    location: 'Kandy',
    budget: 450000,
    expectedROI: 22,
    status: 'pending',
    progress: 0,
    startDate: '2026-02-01',
    endDate: '2026-08-30',
    backgroundImage: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600',
  },
];

// Mock data for past projects
const pastProjects: OfferCardProps[] = [
  {
    id: '4',
    projectName: 'Coconut Plantation',
    cropType: 'King Coconut',
    cropIcon: '🥥',
    farmerName: 'Mahinda Silva',
    farmerImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
    location: 'Kurunegala',
    budget: 320000,
    expectedROI: 24,
    status: 'completed',
    progress: 100,
    startDate: '2025-06-01',
    endDate: '2025-11-30',
    backgroundImage: 'https://images.unsplash.com/photo-1580093407531-eb4a7b007c2a?w=600',
  },
  {
    id: '5',
    projectName: 'Spice Garden',
    cropType: 'Cinnamon & Pepper',
    cropIcon: '🌿',
    farmerName: 'Saman Kumara',
    farmerImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    location: 'Matale',
    budget: 280000,
    expectedROI: 32,
    status: 'completed',
    progress: 100,
    startDate: '2025-04-15',
    endDate: '2025-10-20',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
  },
];

const MyOffersPage = () => {
  const handleCreateOffer = () => {
    // TODO: Open create offer modal or navigate to create offer page
    console.log('Create new offer clicked');
  };

  const handleViewDetails = (id: string) => {
    // TODO: Open offer details modal or navigate to details page
    console.log('View details for offer:', id);
  };

  return (
    <DashboardLayout>
      {/* Page Header using Bootstrap and MUI */}
      <Box className="container-fluid" sx={{ mb: 4 }}>
        <div className="row align-items-start">
          <div className="col-12 col-lg-8">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              My Offers
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create Investment Offers including crop interest, budget, and profit-sharing models.
            </Typography>
          </div>
          <div className="col-12 col-lg-4 d-flex justify-content-lg-end align-items-center gap-2 mt-3 mt-lg-0">
            <CreateOfferButton onClick={handleCreateOffer} />
            <Tooltip title="Settings">
              <IconButton
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Box>

      {/* Active Projects Section */}
      <section className="mb-5">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&::before': {
              content: '""',
              width: 4,
              height: 24,
              background: 'linear-gradient(180deg, #6B8E23 0%, #8FA887 100%)',
              borderRadius: 1,
            },
          }}
        >
          Active Projects
        </Typography>
        {activeProjects.length > 0 ? (
          <div className="row g-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <OfferCard {...project} onViewDetails={handleViewDetails} />
              </div>
            ))}
          </div>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              p: 6,
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, opacity: 0.5 }}>
              📊
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Active Projects
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first investment offer to get started!
            </Typography>
          </Box>
        )}
      </section>

      {/* Divider */}
      <hr
        style={{
          margin: '3rem 0',
          border: 'none',
          height: 1,
          background: 'linear-gradient(90deg, transparent, #3a3a3a, transparent)',
        }}
      />

      {/* Past Projects Section */}
      <section>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&::before': {
              content: '""',
              width: 4,
              height: 24,
              background: 'linear-gradient(180deg, #6B8E23 0%, #8FA887 100%)',
              borderRadius: 1,
            },
          }}
        >
          Past Projects
        </Typography>
        {pastProjects.length > 0 ? (
          <div className="row g-4">
            {pastProjects.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <OfferCard {...project} onViewDetails={handleViewDetails} />
              </div>
            ))}
          </div>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              p: 6,
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, opacity: 0.5 }}>
              📁
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Past Projects
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your completed projects will appear here.
            </Typography>
          </Box>
        )}
      </section>
    </DashboardLayout>
  );
};

export default MyOffersPage;
