import type { InvestmentRequest } from '@/types/farmer.types';
import {
    CalendarToday,
    Event,
    LocationOn,
    Person,
    Schedule,
    Star
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography
} from '@mui/material';

export interface InvestmentRequestCardProps {
  request: InvestmentRequest;
  onViewDetails?: (request: InvestmentRequest) => void;
}

const InvestmentRequestCard = ({ request, onViewDetails }: InvestmentRequestCardProps) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilDeadline = () => {
    const deadline = new Date(request.fundingDeadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline();
  const isUrgent = daysLeft <= 7;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#2a2a2a',
        border: '1px solid #3a3a3a',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          border: '1px solid #4a4a4a',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #3a3a3a',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip
            label={request.status.toUpperCase()}
            size="small"
            sx={{
              bgcolor: request.status === 'open' ? '#76c043' : '#666',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 22,
            }}
          />
          {isUrgent && (
            <Chip
              label={`${daysLeft} days left`}
              size="small"
              sx={{
                bgcolor: '#ff9800',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          )}
        </Stack>
        <Typography variant="h6" fontWeight={600} sx={{ color: '#fff', mb: 0.5, fontSize: '1.1rem' }}>
          {request.projectTitle}
        </Typography>
        <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#76c043', display: 'inline-block' }} />
          Investment Opportunity - Direct Harvest
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Farmer Profile */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
          <Avatar
            src={request.farmerImage}
            alt={request.farmerName}
            sx={{ width: 48, height: 48, border: '2px solid #76c043' }}
          >
            <Person />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={600} sx={{ color: '#fff', fontSize: '0.95rem' }}>
              {request.farmerName}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Schedule sx={{ fontSize: 14, color: '#999' }} />
                <Typography variant="caption" sx={{ color: '#999' }}>
                  {request.farmerExperience}+ years
                </Typography>
              </Stack>
              {request.farmerRating && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Star sx={{ fontSize: 14, color: '#ffa726' }} />
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    {request.farmerRating}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>
        </Stack>

        {/* Financial Metrics */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Box sx={{ p: 1.5, bgcolor: '#1f1f1f', borderRadius: 1.5, border: '1px solid #3a3a3a' }}>
            <Typography variant="caption" sx={{ color: '#999', mb: 0.5, display: 'block', fontSize: '0.7rem' }}>
              TOTAL INVESTMENT
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#76c043', fontSize: '1.3rem' }}>
              {formatCurrency(request.totalInvestmentRequired)}
            </Typography>
          </Box>

          <Box sx={{ p: 1.5, bgcolor: '#1f1f1f', borderRadius: 1.5, border: '1px solid #3a3a3a' }}>
            <Typography variant="caption" sx={{ color: '#999', mb: 0.5, display: 'block', fontSize: '0.7rem' }}>
              EXPECTED ROI
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#76c043', fontSize: '1.3rem' }}>
              {request.expectedROI}%
            </Typography>
          </Box>
        </Box>

        {/* Project Details */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#ccc', 
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '0.875rem',
              lineHeight: 1.5
            }}
          >
            {request.description}
          </Typography>
          
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOn sx={{ fontSize: 16, color: '#999' }} />
              <Typography variant="caption" sx={{ color: '#999' }}>
                {request.location}, {request.district}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Event sx={{ fontSize: 16, color: '#999' }} />
              <Typography variant="caption" sx={{ color: '#999' }}>
                {request.expectedDuration} months | Yield: {request.expectedYield}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarToday sx={{ fontSize: 16, color: isUrgent ? '#ff9800' : '#999' }} />
              <Typography variant="caption" sx={{ color: isUrgent ? '#ff9800' : '#999', fontWeight: isUrgent ? 600 : 400 }}>
                Deadline: {formatDate(request.fundingDeadline)}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* View More Button */}
        <Box sx={{ mt: 'auto' }}>
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            onClick={() => onViewDetails?.(request)}
            sx={{
              color: '#76c043',
              borderColor: '#3a3a3a',
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              '&:hover': {
                borderColor: '#76c043',
                bgcolor: 'rgba(118, 192, 67, 0.08)',
              },
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>

      {/* Footer Note */}
      <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid #3a3a3a', bgcolor: '#1f1f1f' }}>
        <Typography
          variant="caption"
          sx={{
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            gap: 0.5
          }}
        >
          <Box component="span" sx={{ color: '#ff9800' }}>⚡</Box>
          Only ONE investor can fund this project
        </Typography>
      </Box>
    </Card>
  );
};

export default InvestmentRequestCard;
