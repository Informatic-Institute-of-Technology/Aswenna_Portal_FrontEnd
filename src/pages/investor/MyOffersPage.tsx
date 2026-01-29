import { useAuth } from '@/Context/useAuth';
import DashboardLayout from '@/layouts/DashboardLayout';
import type { DirectHarvestOffer, SponsorshipOffer } from '@/types/investor.types';
import { BarChart, Folder, Settings } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import type { OfferCardProps } from '../../components/investor';
import { CreateOfferButton, CreateOfferDialog, OfferCard, ProjectDetailsDialog } from '../../components/investor';
import comprehensiveProjectsData from '../../data/json/comprehensiveProjects.json';
import pendingProjectsData from '../../data/json/pendingProjects.json';
import Notification from '../../shared/components/Notification';
import { useNotification } from '../../shared/hooks/useNotification';

const MyOffersPage = () => {
  const { user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<OfferCardProps | null>(null);
  const { notification, showError, showSuccess, hideNotification } = useNotification();

  const allProjects = useMemo(() => {
    const projects = comprehensiveProjectsData as (OfferCardProps & { investorId?: string })[];
    return projects.filter(p => p.investorId === user?._id);
  }, [user?._id]);

  const activeProjects = useMemo(() =>
    allProjects.filter(p => p.status === 'active'),
    [allProjects]
  );

  const pastProjects = useMemo(() =>
    allProjects.filter(p => p.status === 'completed'),
    [allProjects]
  );

  const pendingProjects = useMemo(() => {
    const projects = pendingProjectsData as (OfferCardProps & { investorId?: string })[];
    return projects.filter(p => p.investorId === user?._id);
  }, [user?._id]);

  const handleCreateOffer = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleOfferSubmit = (offerData: Partial<DirectHarvestOffer> | Partial<SponsorshipOffer>) => {
    try {
      console.log('New offer created:', offerData);
      showSuccess('Offer created successfully! Farmers will be notified.');
      setCreateDialogOpen(false);
    } catch {
      showError('Failed to create offer. Please try again.');
    }
  };

  const handleViewDetails = (id: string) => {
    const project = [...activeProjects, ...pendingProjects, ...pastProjects].find(p => p.id === id);
    if (project) {
      setSelectedProject(project);
      setDetailsDialogOpen(true);
    }
  };

  return (
    <DashboardLayout>
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
              <BarChart sx={{ fontSize: 40, opacity: 0.5 }} />
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
              <Folder sx={{ fontSize: 40, opacity: 0.5 }} />
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

      {/* Create Offer Dialog */}
      <CreateOfferDialog
        open={createDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleOfferSubmit}
      />

      {/* Notification */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        duration={5000}
        onClose={hideNotification}
      />

      {/* Project Details Dialog */}
      <ProjectDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        project={selectedProject}
      />
    </DashboardLayout>
  );
};

export default MyOffersPage;
