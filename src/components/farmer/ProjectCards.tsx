import type { Project } from '@/types';
import { Add, TrendingUp } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Grid, LinearProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Active Project Card - Hero section
interface ActiveProjectCardProps {
  project: Project;
  onViewDetails: () => void;
}

export const ActiveProjectCard = ({ project, onViewDetails }: ActiveProjectCardProps) => {
  const getPhaseLabel = (phase?: string) => {
    const labels: Record<string, string> = {
      planning: 'Planning',
      preparation: 'Land Preparation',
      cultivation: 'Cultivation',
      harvest: 'Harvesting',
      'post-harvest': 'Post-Harvest'
    };
    return phase ? labels[phase] || phase : 'In Progress';
  };

  return (
    <Card 
      elevation={3}
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        mb: 3
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Chip 
              label="ACTIVE PROJECT" 
              size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', mb: 1 }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {project.title}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
              {project.description}
            </Typography>
          </Box>
          <Chip 
            label={getPhaseLabel(project.currentPhase)} 
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Location</Typography>
            <Typography variant="body1" fontWeight="bold">{project.location}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Land Size</Typography>
            <Typography variant="body1" fontWeight="bold">{project.landSize} {project.landUnit}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Model</Typography>
            <Typography variant="body1" fontWeight="bold">
              {project.engagementModel === 'harvest-based' ? 'Harvest Based' : 'Commission Based'}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Investment</Typography>
            <Typography variant="body1" fontWeight="bold">
              Rs. {project.totalInvestment?.toLocaleString() || 'N/A'}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2" fontWeight="bold">{project.progressPercentage}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={project.progressPercentage} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'white'
              }
            }}
          />
        </Box>

        <Button 
          variant="contained" 
          onClick={onViewDetails}
          sx={{ 
            mt: 2,
            bgcolor: 'white', 
            color: '#667eea',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
          }}
        >
          View Full Details
        </Button>
      </CardContent>
    </Card>
  );
};

// Create New Project Card - CTA
export const CreateNewProjectCard = () => {
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        mb: 3,
        border: '2px dashed',
        borderColor: 'primary.main',
        bgcolor: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.3s',
        '&:hover': {
          bgcolor: 'primary.50',
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
      onClick={() => navigate('/farmer/create-project')}
    >
      <CardContent sx={{ py: 4, textAlign: 'center' }}>
        <Add sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" color="primary" fontWeight="bold">
          Create New Farming Opportunity
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Start a new harvest-based or commission-based project
        </Typography>
      </CardContent>
    </Card>
  );
};

// Past Project Card - Grid item
interface PastProjectCardProps {
  project: Project;
  onViewDetails: () => void;
}

export const PastProjectCard = ({ project, onViewDetails }: PastProjectCardProps) => {
  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'success' : 'default';
  };

  const getSuccessRating = (project: Project) => {
    if (project.profit && project.totalInvestment) {
      const roi = (project.profit / project.totalInvestment) * 100;
      return roi > 20 ? 'Excellent' : roi > 10 ? 'Good' : 'Moderate';
    }
    return 'N/A';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
      onClick={onViewDetails}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
            {project.title}
          </Typography>
          <Chip 
            label={project.status} 
            size="small" 
            color={getStatusColor(project.status)}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {project.location} • {project.landSize} {project.landUnit}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Revenue</Typography>
          <Typography variant="body2" fontWeight="bold" color="success.main">
            Rs. {project.revenue?.toLocaleString() || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Profit</Typography>
          <Typography variant="body2" fontWeight="bold">
            Rs. {project.profit?.toLocaleString() || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Chip 
            icon={<TrendingUp />}
            label={getSuccessRating(project)}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(project.actualEndDate || project.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
