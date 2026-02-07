import type { InvestmentRequest } from '@/types/farmer.types';
import {
    CalendarToday,
    Close,
    Description,
    GetApp,
    Info,
    LocationOn,
    Person,
    Schedule,
    Star,
    TrendingUp
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    IconButton,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from '@mui/material';
import { useState } from 'react';

export interface InvestmentRequestDialogProps {
  request: InvestmentRequest | null;
  open: boolean;
  onClose: () => void;
  onInvest?: (id: string) => void;
}

const InvestmentRequestDialog = ({ request, open, onClose, onInvest }: InvestmentRequestDialogProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!request) return null;

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: '#2a2a2a',
          borderRadius: 2,
          maxHeight: '92vh',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid #3a3a3a',
          position: 'relative',
          bgcolor: '#242424',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: '#999',
            bgcolor: '#1f1f1f',
            '&:hover': { bgcolor: '#333', color: '#fff' },
          }}
        >
          <Close fontSize="small" />
        </IconButton>

        <Typography variant="h5" fontWeight={600} sx={{ color: '#fff', mb: 1.5, pr: 6 }}>
          {request.projectTitle}
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Chip
            label={`INV-${request.id.toUpperCase()}`}
            size="small"
            sx={{
              bgcolor: '#1f1f1f',
              color: '#999',
              fontWeight: 600,
              fontSize: '0.7rem',
              border: '1px solid #3a3a3a',
              height: 24,
            }}
          />
          <Chip
            label={request.status.toUpperCase()}
            size="small"
            sx={{
              bgcolor: request.status === 'open' ? '#76c043' : '#666',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 24,
            }}
          />
          <Stack direction="row" spacing={0.5} alignItems="center">
            <CalendarToday sx={{ fontSize: 14, color: '#999' }} />
            <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
              Started {formatDate(request.createdAt)}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, overflowY: 'auto', maxHeight: 'calc(92vh - 180px)' }}>
        {/* Farmer Profile Section */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={request.farmerImage}
              alt={request.farmerName}
              sx={{ width: 60, height: 60, border: '2px solid #76c043' }}
            >
              <Person />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} sx={{ color: '#fff', mb: 0.5 }}>
                {request.farmerName}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Schedule sx={{ fontSize: 16, color: '#999' }} />
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    {request.farmerExperience}+ years experience
                  </Typography>
                </Stack>
                {request.farmerRating && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Star sx={{ fontSize: 16, color: '#ffa726' }} />
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {request.farmerRating} rating
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOn sx={{ fontSize: 18, color: '#999' }} />
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                {request.location}, {request.district}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Full Financial Summary - Investment Transparency */}
        <Box
          sx={{
            bgcolor: '#1f1f1f',
            border: '1px solid #3a3a3a',
            borderRadius: 2,
            p: 3,
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{ fontSize: '1.3rem' }}>💰</Box>
            Investment Financial Summary
          </Typography>

          {/* Investment Overview Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 3,
            }}
          >
            <Box sx={{ p: 2, bgcolor: '#242424', borderRadius: 1.5, border: '1px solid #3a3a3a' }}>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                Total Investment
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#fff' }}>
                {formatCurrency(request.totalInvestmentRequired)}
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, bgcolor: '#242424', borderRadius: 1.5, border: '1px solid #3a3a3a' }}>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                Expected ROI
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#76c043' }}>
                {request.expectedROI}%
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, bgcolor: '#242424', borderRadius: 1.5, border: '1px solid #3a3a3a' }}>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                Project Duration
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#fff' }}>
                {request.expectedDuration} months
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, bgcolor: '#242424', borderRadius: 1.5, border: '1px solid #3a3a3a' }}>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                Payment Installments
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#fff' }}>
                {request.installmentSchedule.length}
              </Typography>
            </Box>
          </Box>

          {/* Investment Type and Details */}
          <Box sx={{ mb: 3, p: 2, bgcolor: '#242424', borderRadius: 1.5, border: '1px solid #3a3a3a' }}>
            <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
              <Box>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                  Investment Type
                </Typography>
                <Chip
                  icon={<Info sx={{ fontSize: 14 }} />}
                  label="Harvest-Based"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(118, 192, 67, 0.15)',
                    color: '#76c043',
                    border: '1px solid rgba(118, 192, 67, 0.3)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                  Crop Type
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#fff' }}>
                  {request.cropType}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                  Expected Yield
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#fff' }}>
                  {request.expectedYield}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                  Funding Deadline
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: isUrgent ? '#ff9800' : '#fff' }}>
                  {formatDate(request.fundingDeadline)} {isUrgent && `(${daysLeft} days left)`}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Tabs for detailed information */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: '1px solid #3a3a3a',
              mb: 3,
              '& .MuiTab-root': {
                color: '#999',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                minHeight: 48,
                '&.Mui-selected': {
                  color: '#76c043',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#76c043',
                height: 3,
              },
            }}
          >
            <Tab label="Project Details" />
            <Tab label="Cost Breakdown" />
            <Tab label="Payment Schedule" />
          </Tabs>

          {/* Tab Panel 0: Project Details */}
          {activeTab === 0 && (
            <Box>
              <Box
                sx={{
                  bgcolor: '#1f1f1f',
                  border: '1px solid #3a3a3a',
                  borderRadius: 2,
                  p: 2.5,
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#fff', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description sx={{ fontSize: 20 }} />
                  Project Description
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc', lineHeight: 1.7, mb: 2 }}>
                  {request.description}
                </Typography>
                
                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Box>
                    <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 0.5 }}>
                      Duration
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#fff' }}>
                      {request.expectedDuration} months
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 0.5 }}>
                      Expected Yield
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#fff' }}>
                      {request.expectedYield}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 0.5 }}>
                      Crop Type
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#fff' }}>
                      {request.cropType}
                    </Typography>
                  </Box>
                  {isUrgent && (
                    <Box>
                      <Typography variant="caption" sx={{ color: '#ff9800', display: 'block', mb: 0.5 }}>
                        ⚠️ Funding Deadline
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#ff9800' }}>
                        {daysLeft} days left
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Box>
          )}

          {/* Tab Panel 1: Cost Breakdown */}
          {activeTab === 1 && (
            <Box
              sx={{
                bgcolor: '#1f1f1f',
                border: '1px solid #3a3a3a',
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#fff', mb: 2 }}>
                💵 Detailed Cost Breakdown
              </Typography>

              <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: '#999',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderBottom: '1px solid #3a3a3a',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      py: 1.5,
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: '#999',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderBottom: '1px solid #3a3a3a',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      py: 1.5,
                    }}
                  >
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {request.costBreakdown.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                    }}
                  >
                    <TableCell
                      sx={{
                        borderBottom: '1px solid #333',
                        py: 2,
                      }}
                    >
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#fff', mb: 0.5 }}>
                        {item.category}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        {item.description}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: '#ccc',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        borderBottom: '1px solid #333',
                      }}
                    >
                      {formatCurrency(item.estimatedCost)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderTop: '2px solid #3a3a3a',
                      borderBottom: 'none',
                      py: 2,
                    }}
                  >
                    Total Investment Required
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: '#76c043',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderTop: '2px solid #3a3a3a',
                      borderBottom: 'none',
                    }}
                  >
                    {formatCurrency(request.totalInvestmentRequired)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
              </TableContainer>
            </Box>
          )}

          {/* Tab Panel 2: Payment Schedule */}
          {activeTab === 2 && (
            <Box
              sx={{
                bgcolor: '#1f1f1f',
                border: '1px solid #3a3a3a',
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#fff', mb: 2 }}>
                📅 Payment Schedule ({request.installmentSchedule.length} Installments)
              </Typography>

              <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#999', fontWeight: 600, fontSize: '0.75rem', borderBottom: '1px solid #3a3a3a', textTransform: 'uppercase', py: 1.5, width: 60 }}>
                    #
                  </TableCell>
                  <TableCell sx={{ color: '#999', fontWeight: 600, fontSize: '0.75rem', borderBottom: '1px solid #3a3a3a', textTransform: 'uppercase', py: 1.5 }}>
                    Milestone
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#999', fontWeight: 600, fontSize: '0.75rem', borderBottom: '1px solid #3a3a3a', textTransform: 'uppercase', py: 1.5 }}>
                    Amount
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#999', fontWeight: 600, fontSize: '0.75rem', borderBottom: '1px solid #3a3a3a', textTransform: 'uppercase', py: 1.5 }}>
                    Due Date
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#999', fontWeight: 600, fontSize: '0.75rem', borderBottom: '1px solid #3a3a3a', textTransform: 'uppercase', py: 1.5 }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {request.installmentSchedule.map((installment) => (
                  <TableRow
                    key={installment.id}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: '#ccc',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        borderBottom: '1px solid #333',
                      }}
                    >
                      {installment.installmentNumber}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid #333',
                        fontWeight: 500,
                      }}
                    >
                      {installment.milestone}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: '#ccc',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        borderBottom: '1px solid #333',
                      }}
                    >
                      {formatCurrency(installment.amount)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: '#999',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid #333',
                      }}
                    >
                      {formatDate(installment.dueDate)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderBottom: '1px solid #333',
                      }}
                    >
                      <Chip
                        label={installment.status?.toUpperCase() || 'PENDING'}
                        size="small"
                        sx={{
                          bgcolor: installment.status === 'paid' ? 'rgba(118, 192, 67, 0.2)' : 'rgba(255, 167, 38, 0.2)',
                          color: installment.status === 'paid' ? '#76c043' : '#ffa726',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 22,
                          border: installment.status === 'paid' ? '1px solid rgba(118, 192, 67, 0.3)' : '1px solid rgba(255, 167, 38, 0.3)',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2.5,
          borderTop: '1px solid #3a3a3a',
          bgcolor: '#242424',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          size="large"
          onClick={onClose}
          sx={{
            borderColor: '#3a3a3a',
            color: '#ccc',
            fontWeight: 600,
            textTransform: 'none',
            px: 4,
            '&:hover': {
              borderColor: '#4a4a4a',
              bgcolor: 'rgba(255, 255, 255, 0.02)',
            },
          }}
        >
          Close
        </Button>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<GetApp />}
            sx={{
              bgcolor: '#76c043',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              px: 4,
              boxShadow: '0 4px 12px rgba(118, 192, 67, 0.3)',
              '&:hover': {
                bgcolor: '#68a83b',
                boxShadow: '0 6px 16px rgba(118, 192, 67, 0.4)',
              },
            }}
          >
            Download Full Report
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<TrendingUp />}
            onClick={() => {
              onInvest?.(request.id);
              onClose();
            }}
            disabled={request.status !== 'open'}
            sx={{
              bgcolor: request.status === 'open' ? '#76c043' : '#444',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              px: 4,
              boxShadow: request.status === 'open' ? '0 4px 12px rgba(118, 192, 67, 0.3)' : 'none',
              '&:hover': {
                bgcolor: request.status === 'open' ? '#68a83b' : '#444',
                boxShadow: request.status === 'open' ? '0 6px 16px rgba(118, 192, 67, 0.4)' : 'none',
              },
            }}
          >
            {request.status === 'open' ? 'Invest Now' : 'Not Available'}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default InvestmentRequestDialog;

