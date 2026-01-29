import { LocationOn, Star } from '@mui/icons-material';
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

  // For Commission Jobs - render modern card design
  if (!isHarvestCapital && commissionJob) {
    return (
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          pt: 8,
        }}
      >
        {/* Avatar positioned above card - PLACEHOLDER STYLE */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -6,
                left: -6,
                right: -6,
                bottom: -6,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(150,160,170,0.4) 0%, rgba(120,130,140,0.3) 100%)',
                zIndex: 0,
              }
            }}
          >
            {/* Avatar with Image Support */}
            <Avatar
              src={job.farmerImage}
              alt={job.farmerName}
              sx={{
                width: 110,
                height: 110,
                position: 'relative',
                zIndex: 1,
                border: '5px solid #1e2a35',
                bgcolor: '#6b7c84',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                fontSize: '2.5rem',
                fontWeight: 600,
                color: '#2d3e44',
              }}
            >
              {job.farmerName.charAt(0)}
            </Avatar>
          </Box>
        </Box>

        {/* Card - SAME BACKGROUND AS INVESTMENT CARD */}
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #1e2a35 0%, #1a1f28 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            overflow: 'visible',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.7)',
              border: '1px solid rgba(118, 192, 67, 0.3)',
            },
          }}
        >
          <CardContent sx={{ p: 2.5, pt: 7, pb: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {/* Name */}
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.8, fontSize: '1.25rem', letterSpacing: '-0.3px' }}>
              {job.farmerName}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.3 }}>
              <Star sx={{ fontSize: 16, color: '#FFA726' }} />
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
                4.8
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                (24 reviews)
              </Typography>
            </Box>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
              <LocationOn sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                {job.district}
              </Typography>
            </Box>

            {/* Stats Grid - RATE IS PROMINENT */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 0,
                width: '100%',
                mb: 2,
                pb: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Box sx={{ px: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 0.3, fontSize: '0.6rem', fontWeight: 400 }}>
                  Experience:
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                  {commissionJob.yearsOfExperience} Yrs
                </Typography>
              </Box>
              <Box sx={{ px: 1, borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 0.3, fontSize: '0.6rem', fontWeight: 400 }}>
                  Rate:
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.2 }}>
                  LKR {(commissionJob.rate / 1000).toFixed(0)},{(commissionJob.rate % 1000).toString().padStart(3, '0')}/{commissionJob.rateType === 'PER_ACRE' ? 'acre' : 'day'}
                </Typography>
              </Box>
              <Box sx={{ px: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 0.3, fontSize: '0.6rem', fontWeight: 400 }}>
                  Success:
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                  98%
                </Typography>
              </Box>
            </Box>

            {/* Skills - UPDATED CONTENT */}
            <Box sx={{ width: '100%', mb: 2.5 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, justifyContent: 'center' }}>
                <Chip
                  label="Combine Harvesting"
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 26,
                    px: 1.2,
                    bgcolor: 'rgba(118, 192, 67, 0.12)',
                    color: '#76c043',
                    border: '1px solid rgba(118, 192, 67, 0.25)',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(118, 192, 67, 0.2)',
                    }
                  }}
                />
                <Chip
                  label="Manual Harvesting"
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 26,
                    px: 1.2,
                    bgcolor: 'rgba(118, 192, 67, 0.12)',
                    color: '#76c043',
                    border: '1px solid rgba(118, 192, 67, 0.25)',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(118, 192, 67, 0.2)',
                    }
                  }}
                />
                <Chip
                  label="Threshing"
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 26,
                    px: 1.2,
                    bgcolor: 'rgba(118, 192, 67, 0.12)',
                    color: '#76c043',
                    border: '1px solid rgba(118, 192, 67, 0.25)',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(118, 192, 67, 0.2)',
                    }
                  }}
                />
                <Chip
                  label="Grain Cleaning"
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 26,
                    px: 1.2,
                    bgcolor: 'rgba(118, 192, 67, 0.12)',
                    color: '#76c043',
                    border: '1px solid rgba(118, 192, 67, 0.25)',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(118, 192, 67, 0.2)',
                    }
                  }}
                />
              </Box>
            </Box>

            {/* View Profile Button - DEFINED SHADOWS */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => onConnect && job.status === 'OPEN' ? onConnect(job) : onViewMore(job)}
              sx={{
                bgcolor: '#76c043',
                color: '#1a2d32',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                py: 1.5,
                borderRadius: 1.5,
                boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
                border: 'none',
                '&:hover': {
                  bgcolor: '#68a83a',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View Profile
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // For Harvest Capital Jobs - keep existing design
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
