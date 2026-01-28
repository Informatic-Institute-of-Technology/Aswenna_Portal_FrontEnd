import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material';
import React from 'react';
import type {
  CommissionJob,
  FarmerJob,
  HarvestCapitalJob
} from '../../types/farmer.types';
import { FarmerJobType } from '../../types/farmer.types';

interface FarmerJobCardProps {
  job: FarmerJob;
  onViewMore: (job: FarmerJob) => void;
  onConnect?: (job: FarmerJob) => void;
}

const FarmerJobCard: React.FC<FarmerJobCardProps> = ({ job, onViewMore, onConnect }) => {
  const isHarvestCapital = job.jobType === FarmerJobType.HARVEST_CAPITAL;
  const harvestJob = isHarvestCapital ? (job as HarvestCapitalJob) : null;
  const commissionJob = !isHarvestCapital ? (job as CommissionJob) : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const investmentProgress = harvestJob
    ? (harvestJob.investmentSecured / harvestJob.totalInvestmentRequired) * 100
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip
            label={job.status.replace('_', ' ')}
            size="small"
            sx={{
              bgcolor: job.status === 'OPEN' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 24,
            }}
          />
          <Box
            sx={{
              px: 1,
              py: 0.4,
              bgcolor: isHarvestCapital ? 'rgba(255,152,0,0.15)' : 'rgba(33,150,243,0.15)',
              borderRadius: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: isHarvestCapital ? '#FF9800' : '#2196F3',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            >
              {isHarvestCapital ? '💰 Needs Investment' : '🤝 Offering Services'}
            </Typography>
          </Box>
        </Stack>

        <Typography 
          variant="h6" 
          sx={{ 
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.4,
          }}
        >
          {job.title}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2, bgcolor: '#1a1a1a' }}>
        {/* Farmer Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Avatar
            src={job.farmerImage}
            alt={job.farmerName}
            sx={{
              width: 40,
              height: 40,
            }}
          >
            {job.farmerName.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ color: '#fff', fontSize: '0.9rem' }}>
              {job.farmerName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
              📍 {job.district}
            </Typography>
          </Box>
        </Box>

        {/* Key Metrics */}
        {isHarvestCapital && harvestJob && (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                  Budget
                </Typography>
                <Typography variant="h6" sx={{ color: '#FF9800', fontSize: '1rem', fontWeight: 600 }}>
                  {formatCurrency(harvestJob.totalInvestmentRequired)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                  Expected ROI
                </Typography>
                <Typography variant="h6" sx={{ color: '#2196F3', fontSize: '1rem', fontWeight: 600 }}>
                  {harvestJob.expectedROI}%
                </Typography>
              </Box>
            </Box>

            {/* Progress */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                  Progress
                </Typography>
                <Typography variant="caption" sx={{ color: '#4CAF50', fontSize: '0.75rem', fontWeight: 600 }}>
                  {investmentProgress.toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={investmentProgress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#4CAF50',
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            {/* Project Details */}
            <Box sx={{ display: 'flex', gap: 2, p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                  🌾 {harvestJob.landSize} {harvestJob.landSizeUnit}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                  ⏱️ {harvestJob.expectedDuration} months
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {!isHarvestCapital && commissionJob && (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                  Rate
                </Typography>
                <Typography variant="h6" sx={{ color: '#FF9800', fontSize: '1rem', fontWeight: 600 }}>
                  {formatCurrency(commissionJob.rate)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
                  per {commissionJob.rateType}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                  Experience
                </Typography>
                <Typography variant="h6" sx={{ color: '#9C27B0', fontSize: '1rem', fontWeight: 600 }}>
                  {commissionJob.yearsOfExperience}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
                  Years
                </Typography>
              </Box>
            </Box>

            {/* Skills */}
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', display: 'block', mb: 1 }}>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                {commissionJob.skills.slice(0, 4).map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: 22,
                      bgcolor: 'rgba(33,150,243,0.1)',
                      color: '#2196F3',
                      fontWeight: 500,
                    }}
                  />
                ))}
                {commissionJob.skills.length > 4 && (
                  <Chip
                    label={`+${commissionJob.skills.length - 4}`}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: 22,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.5)',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Box>
          </>
        )}
      </CardContent>

      {/* Footer */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: 'rgba(0,0,0,0.2)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
            Started: {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Typography>
          {isHarvestCapital && harvestJob && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
              Ends: {new Date(
                new Date(job.createdAt).setMonth(
                  new Date(job.createdAt).getMonth() + harvestJob.expectedDuration
                )
              ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Action Button */}
      <CardActions sx={{ p: 2, pt: 0, bgcolor: '#1a1a1a' }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onConnect && job.status === 'OPEN' ? onConnect(job) : onViewMore(job)}
          sx={{
            bgcolor: job.status === 'OPEN' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
            color: '#fff',
            fontWeight: 600,
            textTransform: 'none',
            py: 1,
            borderRadius: 1.5,
            fontSize: '0.875rem',
            '&:hover': {
              bgcolor: job.status === 'OPEN' ? '#45a049' : 'rgba(255,255,255,0.15)',
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default FarmerJobCard;
