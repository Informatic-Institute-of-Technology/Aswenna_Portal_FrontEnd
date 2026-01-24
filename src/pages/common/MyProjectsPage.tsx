import { ActiveProjectCard, CreateNewProjectCard, PastProjectCard } from '@/components/farmer/ProjectCards';
import { ProjectDetailModal } from '@/components/farmer/ProjectDetailModal';
import DashboardLayout from '@/layouts/DashboardLayout';
import type { Project } from '@/types';
import { Add } from '@mui/icons-material';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data - replace with API call
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Organic Rice Cultivation',
    description: 'Premium basmati rice cultivation using organic farming methods',
    engagementModel: 'harvest-based',
    status: 'active',
    currentPhase: 'cultivation',
    progressPercentage: 65,
    location: 'Polonnaruwa District',
    landSize: 5,
    landUnit: 'acres',
    createdAt: new Date('2025-01-01'),
    startDate: new Date('2025-01-15'),
    expectedEndDate: new Date('2025-05-30'),
    totalInvestment: 500000,
    actualSpent: 325000,
    harvestBasedDetails: {
      boqItems: [],
      totalProjectCost: 500000,
      investorSharePercentage: 60,
      farmerSharePercentage: 40,
      estimatedYield: 5000,
      yieldUnit: 'kg',
      estimatedRevenue: 750000
    },
    investorId: 'inv1',
    investorName: 'Kumar Investments'
  },
  {
    id: '2',
    title: 'Vegetable Farming - Season 2024',
    description: 'Mixed vegetable cultivation project',
    engagementModel: 'harvest-based',
    status: 'completed',
    progressPercentage: 100,
    location: 'Anuradhapura',
    landSize: 3,
    landUnit: 'acres',
    createdAt: new Date('2024-06-01'),
    startDate: new Date('2024-06-15'),
    expectedEndDate: new Date('2024-11-30'),
    actualEndDate: new Date('2024-11-28'),
    totalInvestment: 300000,
    actualSpent: 280000,
    revenue: 450000,
    profit: 170000
  },
  {
    id: '3',
    title: 'Consultation Services - Mahaweli Project',
    description: 'Agricultural consulting for large-scale farming',
    engagementModel: 'commission-based',
    status: 'completed',
    progressPercentage: 100,
    location: 'Kandy District',
    landSize: 20,
    landUnit: 'acres',
    createdAt: new Date('2024-03-01'),
    startDate: new Date('2024-03-15'),
    expectedEndDate: new Date('2024-08-30'),
    actualEndDate: new Date('2024-08-25'),
    totalInvestment: 0,
    revenue: 200000,
    profit: 200000,
    commissionBasedDetails: {
      serviceDescription: 'Full-cycle agricultural consulting',
      commissionType: 'percentage',
      commissionPercentage: 15,
      estimatedEarnings: 200000
    }
  }
];

const MyProjectsPage = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get active project (only one allowed)
  const getActiveProject = () => {
    return mockProjects.find(p => p.status === 'active');
  };

  // Get past projects
  const getPastProjects = () => {
    return mockProjects.filter(p => p.status === 'completed' || p.status === 'cancelled');
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const activeProject = getActiveProject();
  const pastProjects = getPastProjects();

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header with Create Button */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              My Projects
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create Farming Opportunity and view the status of your current farming plans.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => navigate('/farmer/create-project')}
            sx={{
              bgcolor: 'primary.main',
              px: 3,
              py: 1.5,
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Create New Job
          </Button>
        </Box>

        {/* Active Project or Create New */}
        {activeProject ? (
          <ActiveProjectCard 
            project={activeProject} 
            onViewDetails={() => handleViewDetails(activeProject)} 
          />
        ) : (
          <CreateNewProjectCard />
        )}

        {/* Past Projects */}
        {pastProjects.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Past Projects
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              View your completed and historical farming projects
            </Typography>

            <Grid container spacing={3}>
              {pastProjects.map(project => (
                <Grid key={project.id} item xs={12} sm={6} md={4}>
                  <PastProjectCard 
                    project={project} 
                    onViewDetails={() => handleViewDetails(project)} 
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Project Detail Modal */}
        <ProjectDetailModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          project={selectedProject}
        />
      </Container>
    </DashboardLayout>
  );
};

export default MyProjectsPage;
