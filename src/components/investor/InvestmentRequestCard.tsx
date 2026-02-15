import type { InvestmentRequest } from '@/types/farmer.types';
import {
  CalendarToday,
  Event,
  LocationOn,
  OpenInNew,
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

  const getCropImage = (cropType: string) => {
    const cropImages: Record<string, string> = {
      'Tomatoes': 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800',
      'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
      'Vegetables': 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800',
      'Tea': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
      'Coconut': 'https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=800',
      'Chili': 'https://images.unsplash.com/photo-1583454155184-870a1f63fd67?w=800',
    };
    return cropImages[cropType] || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800';
  };

  const daysLeft = getDaysUntilDeadline();
  const isUrgent = daysLeft <= 7;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 2.5,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(107, 142, 35, 0.1)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url('${getCropImage(request.cropType)}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px 12px 0 0',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%)',
            zIndex: 1,
          }}
        />
        
        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            p: 2.5,
            pb: 2,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Chip
              label={request.status.toUpperCase()}
              size="small"
              sx={{
                bgcolor: '#76c043',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 24,
                px: 0.5,
                letterSpacing: '0.5px',
              }}
            />
            {isUrgent && (
              <Chip
                label={`${daysLeft} days left`}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 152, 0, 0.25)',
                  color: '#ffa726',
                  border: '1px solid rgba(255, 152, 0, 0.4)',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  backdropFilter: 'blur(10px)',
                }}
              />
            )}
          </Stack>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mb: 1, fontSize: '1.15rem', lineHeight: 1.3, textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>
            {request.projectTitle}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#76c043', display: 'inline-block', boxShadow: '0 0 8px rgba(118, 192, 67, 0.6)' }} />
            Investment Opportunity • Direct Harvest
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5, pt: 2.5 }}>
        {/* Farmer Profile */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            src={request.farmerImage}
            alt={request.farmerName}
            sx={{ width: 52, height: 52, border: '3px solid rgba(118, 192, 67, 0.3)' }}
          >
            <Person />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={700} sx={{ color: '#fff', fontSize: '1rem', mb: 0.5 }}>
              {request.farmerName}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Schedule sx={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                  {request.farmerExperience}+ years
                </Typography>
              </Stack>
              {request.farmerRating && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Star sx={{ fontSize: 15, color: '#ffa726' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600 }}>
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
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 1.5, border: '1px solid rgba(255,255,255,0.06)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.5px' }}>
              TOTAL INVESTMENT
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', fontSize: '1.4rem' }}>
              LKR {(request.totalInvestmentRequired / 1000).toFixed(0)},000
            </Typography>
          </Box>

          <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 1.5, border: '1px solid rgba(255,255,255,0.06)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.5px' }}>
              EXPECTED ROI
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', fontSize: '1.4rem' }}>
              {request.expectedROI}%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '0.875rem',
              lineHeight: 1.6
            }}
          >
            {request.description}
          </Typography>
          
          <Stack spacing={1.2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOn sx={{ fontSize: 17, color: 'rgba(255,255,255,0.4)' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                {request.location}, {request.district}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Event sx={{ fontSize: 17, color: 'rgba(255,255,255,0.4)' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                {request.expectedDuration} months | Yield: {request.expectedYield}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarToday sx={{ fontSize: 17, color: isUrgent ? '#ff9800' : 'rgba(255,255,255,0.4)' }} />
              <Typography variant="caption" sx={{ color: isUrgent ? '#ff9800' : 'rgba(255,255,255,0.6)', fontWeight: isUrgent ? 600 : 400, fontSize: '0.8rem' }}>
                Deadline: {formatDate(request.fundingDeadline)}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* View Details Button */}
        <Box sx={{ mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            endIcon={<OpenInNew sx={{ fontSize: 18 }} />}
            onClick={() => onViewDetails?.(request)}
            sx={{
              background: 'linear-gradient(135deg, #6B8E23 0%, #8FA887 100%)',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              py: 1.5,
              borderRadius: 1.5,
              boxShadow: '0 4px 16px rgba(107, 142, 35, 0.35)',
              border: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #7C9F34 0%, #A4C29D 100%)',
                boxShadow: '0 6px 20px rgba(107, 142, 35, 0.45)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvestmentRequestCard;
