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

  if (!isHarvestCapital && commissionJob) {
    return (
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          pt: 8,
        }}
      >
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
                background: 'linear-gradient(135deg, var(--surface-muted) 0%, var(--surface-muted) 100%)',
                zIndex: 0,
              }
            }}
          >
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
                boxShadow: '0 8px 32px var(--overlay-lg)',
                fontSize: '2.5rem',
                fontWeight: 600,
                color: '#2d3e44',
              }}
            >
              {job.farmerName.charAt(0)}
            </Avatar>
          </Box>
        </Box>

        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(145deg, var(--bg-subtle) 0%, var(--bg-overlay) 100%)',
            border: '1px solid var(--surface-muted)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            overflow: 'visible',
            boxShadow: '0 4px 12px var(--overlay-lg)',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 8px 20px var(--overlay-xl)',
              border: '1px solid var(--color-lime-border)',
            },
          }}
        >
          <CardContent sx={{ p: 2.5, pt: 7, pb: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {/* Name */}
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700, mb: 0.8, fontSize: '1.25rem', letterSpacing: '-0.3px' }}>
              {job.farmerName}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.3 }}>
              <Star sx={{ fontSize: 16, color: 'var(--color-amber)' }} />
              <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                4.8
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.75rem' }}>
                (24 reviews)
              </Typography>
            </Box>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
              <LocationOn sx={{ fontSize: 14, color: 'var(--text-on-dark)' }} />
              <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.75rem' }}>
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
                borderBottom: '1px solid var(--surface-light)',
              }}
            >
              <Box sx={{ px: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', display: 'block', mb: 0.3, fontSize: '0.6rem', fontWeight: 400 }}>
                  Experience:
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {commissionJob.yearsOfExperience} Yrs
                </Typography>
              </Box>
              <Box sx={{ px: 1, borderLeft: '1px solid var(--surface-light)', borderRight: '1px solid var(--surface-light)' }}>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', display: 'block', mb: 0.3, fontSize: '0.6rem', fontWeight: 400 }}>
                  Rate:
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.2 }}>
                  LKR {(commissionJob.rate / 1000).toFixed(0)},{(commissionJob.rate % 1000).toString().padStart(3, '0')}/{commissionJob.rateType === 'PER_ACRE' ? 'acre' : 'day'}
                </Typography>
              </Box>
              <Box sx={{ px: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', display: 'block', mb: 0.3, fontSize: '0.6rem', fontWeight: 400 }}>
                  Success:
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
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
                    bgcolor: 'var(--color-lime-muted)',
                    color: 'var(--color-lime)',
                    border: '1px solid var(--color-lime-border)',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'var(--color-lime-muted-strong)',
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
                    bgcolor: 'var(--color-lime-muted)',
                    color: 'var(--color-lime)',
                    border: '1px solid var(--color-lime-border)',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'var(--color-lime-muted-strong)',
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
                    bgcolor: 'var(--color-lime-muted)',
                    color: 'var(--color-lime)',
                    border: '1px solid var(--color-lime-border)',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'var(--color-lime-muted-strong)',
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
                    bgcolor: 'var(--color-lime-muted)',
                    color: 'var(--color-lime)',
                    border: '1px solid var(--color-lime-border)',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'var(--color-lime-muted-strong)',
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
                bgcolor: 'var(--color-lime)',
                color: '#1a2d32',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                py: 1.5,
                borderRadius: 1.5,
                boxShadow: '0 3px 8px var(--overlay-md)',
                border: 'none',
                '&:hover': {
                  bgcolor: 'var(--color-lime-hover)',
                  boxShadow: '0 4px 12px var(--overlay-lg)',
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
        bgcolor: 'var(--bg-overlay)',
        border: '1px solid var(--surface-light)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px var(--overlay-lg)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid var(--surface-light)',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip
            label={job.status.replace('_', ' ')}
            size="small"
            sx={{
              bgcolor: job.status === 'OPEN' ? 'var(--color-success)' : 'var(--surface-light)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 24,
            }}
          />
          <Box
            sx={{
              px: 1,
              py: 0.4,
              bgcolor: isHarvestCapital ? 'var(--color-orange-muted)' : 'var(--color-info-blue-muted)',
              borderRadius: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: isHarvestCapital ? 'var(--color-orange)' : 'var(--color-info-blue)',
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
            color: 'var(--text-primary)',
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.4,
          }}
        >
          {job.title}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2, bgcolor: 'var(--bg-overlay)' }}>
        {/* Farmer Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid var(--bg-active)' }}>
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
            <Typography variant="body2" fontWeight="600" sx={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              {job.farmerName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.75rem' }}>
              📍 {job.district}
            </Typography>
          </Box>
        </Box>

        {/* Key Metrics */}
        {isHarvestCapital && harvestJob && (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                  Budget
                </Typography>
                <Typography variant="h6" sx={{ color: 'var(--color-orange)', fontSize: '1rem', fontWeight: 600 }}>
                  {formatCurrency(harvestJob.totalInvestmentRequired)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                  Expected ROI
                </Typography>
                <Typography variant="h6" sx={{ color: 'var(--color-info-blue)', fontSize: '1rem', fontWeight: 600 }}>
                  {harvestJob.expectedROI}%
                </Typography>
              </Box>
            </Box>

            {/* Progress */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.7rem' }}>
                  Progress
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--color-success)', fontSize: '0.75rem', fontWeight: 600 }}>
                  {investmentProgress.toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={investmentProgress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'var(--surface-light)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'var(--color-success)',
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            {/* Project Details */}
            <Box sx={{ display: 'flex', gap: 2, p: 1.5, bgcolor: 'var(--surface-tint)', borderRadius: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.7rem' }}>
                  🌾 {harvestJob.landSize} {harvestJob.landSizeUnit}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.7rem' }}>
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
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                  Rate
                </Typography>
                <Typography variant="h6" sx={{ color: 'var(--color-orange)', fontSize: '1rem', fontWeight: 600 }}>
                  {formatCurrency(commissionJob.rate)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.65rem' }}>
                  per {commissionJob.rateType}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                  Experience
                </Typography>
                <Typography variant="h6" sx={{ color: 'var(--color-purple)', fontSize: '1rem', fontWeight: 600 }}>
                  {commissionJob.yearsOfExperience}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.65rem' }}>
                  Years
                </Typography>
              </Box>
            </Box>

            {/* Skills */}
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.7rem', display: 'block', mb: 1 }}>
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
                      bgcolor: 'var(--color-info-blue-muted)',
                      color: 'var(--color-info-blue)',
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
                      bgcolor: 'var(--bg-active)',
                      color: 'var(--text-on-dark)',
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
          bgcolor: 'var(--overlay-sm)',
          borderTop: '1px solid var(--bg-active)',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.7rem' }}>
            Started: {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Typography>
          {isHarvestCapital && harvestJob && (
            <Typography variant="caption" sx={{ color: 'var(--text-on-dark)', fontSize: '0.7rem' }}>
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
      <CardActions sx={{ p: 2, pt: 0, bgcolor: 'var(--bg-overlay)' }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onConnect && job.status === 'OPEN' ? onConnect(job) : onViewMore(job)}
          sx={{
            bgcolor: job.status === 'OPEN' ? 'var(--color-success)' : 'var(--surface-light)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            textTransform: 'none',
            py: 1,
            borderRadius: 1.5,
            fontSize: '0.875rem',
            '&:hover': {
              bgcolor: job.status === 'OPEN' ? 'var(--color-lime-hover)' : 'var(--surface-light)',
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
