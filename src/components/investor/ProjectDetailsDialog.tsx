import { AccessTime, CalendarToday, CheckCircle, Close, Email, ExpandLess, ExpandMore, LocationOn, Person, Phone, WarningAmber } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    LinearProgress,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import LocationMapDialog from './LocationMapDialog';
import type { OfferCardProps } from './OfferCard';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA3L-q18zc1dET4FtGpbC4GRfjd60KfWlc';

interface ProjectDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  project: OfferCardProps | null;
}

const ProjectDetailsDialog = ({ open, onClose, project }: ProjectDetailsDialogProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [budgetExpanded, setBudgetExpanded] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const calculatedBudgetBreakdown = useMemo(() => {
    if (!project || !project.financialBreakdown || project.financialBreakdown.length === 0) return [];
    
    const totalBudget = project.financialBreakdown.reduce((sum, item) => sum + item.amount, 0);
    
    return project.financialBreakdown
      .map(item => ({
        ...item,
        percentage: Math.round((item.amount / totalBudget) * 100 * 100) / 100,
        calculatedTotal: totalBudget
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [project]);

  const calculatedFinancials = useMemo(() => {
    if (!project || !project.payments || project.payments.length === 0) {
      const budget = project?.financialBreakdown?.reduce((sum, item) => sum + item.amount, 0) || 0;
      return { budget, disbursed: 0, remaining: budget };
    }

    const budget = project.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const disbursed = project.payments
      .filter(p => p.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const remaining = budget - disbursed;

    return { budget, disbursed, remaining };
  }, [project]);

  const calculatedMilestones = useMemo(() => {
    if (!project || !project.milestones || project.milestones.length === 0) {
      return { total: 0, completed: 0, pending: 0, inProgress: 0 };
    }

    const total = project.milestones.length;
    const completed = project.milestones.filter(m => m.status === 'completed').length;
    const inProgress = project.milestones.filter(m => m.status === 'in-progress').length;
    const pending = project.milestones.filter(m => m.status === 'pending').length;

    return { total, completed, pending, inProgress };
  }, [project]);

  const calculatedProgress = useMemo(() => {
    if (!project || !project.milestones || project.milestones.length === 0) return 0;

    const totalProgress = project.milestones.reduce((sum, milestone) => sum + milestone.progress, 0);
    return Math.round(totalProgress / project.milestones.length);
  }, [project]);

  const getCategoryColor = (index: number, percentage: number) => {
    if (percentage >= 20) return '#ef5350'; 
    if (percentage >= 15) return '#ffa726'; 
    if (percentage >= 10) return '#66bb6a'; 
    return `hsl(${120 + index * 25}, 60%, 55%)`;
  };

  if (!project) return null;

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

  const getRiskColor = () => {
    switch (project.riskLevel) {
      case 'LOW':
        return '#76c043';
      case 'MEDIUM':
        return '#ffa726';
      case 'HIGH':
        return '#ef5350';
      default:
        return '#76c043';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#76c043';
      case 'in-progress':
        return '#2196f3';
      case 'delayed':
        return '#ef5350';
      default:
        return '#757575';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#76c043';
      case 'pending':
        return '#ffa726';
      case 'overdue':
        return '#ef5350';
      default:
        return '#757575';
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <>
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: '#1a1a1a',
          maxHeight: '95vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        pb: 1,
        pt: 3,
        px: 3
      }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
            {project.projectName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" color="rgba(255,255,255,0.6)">
              {project.projectId || `PRJ-${project.id}`}
            </Typography>
            <Chip 
              label={project.status.toUpperCase()} 
              size="small"
              sx={{ 
                bgcolor: project.status === 'active' ? '#76c043' : project.status === 'completed' ? '#2196f3' : '#ffa726',
                color: 'white',
                fontWeight: 600
              }}
            />
            <Typography variant="body2" color="rgba(255,255,255,0.6)">
              <CalendarToday sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
              Started {formatDate(project.startDate)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', px: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          textColor="inherit"
          TabIndicatorProps={{
            sx: { bgcolor: '#76c043' }
          }}
        >
          <Tab label="Overview" sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: 'white' } }} />
          <Tab label="Milestones & Progress" sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: 'white' } }} />
          <Tab label="Payments & Finance" sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: 'white' } }} />
          <Tab label="Team Members" sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: 'white' } }} />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
        {activeTab === 0 && (
          <Box>
            {calculatedProgress !== undefined && project.status === 'active' && (
              <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(118, 192, 67, 0.08)', borderRadius: 2, border: '1px solid rgba(118, 192, 67, 0.2)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" gutterBottom>
                      OVERALL PROJECT PROGRESS
                    </Typography>
                    <Typography variant="h4" color="white" fontWeight={700}>
                      {calculatedProgress}% Complete
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="rgba(255,255,255,0.6)">
                      Expected Completion
                    </Typography>
                    <Typography variant="body1" color="white" fontWeight={600}>
                      {project.endDate ? formatDate(project.endDate) : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculatedProgress} 
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      backgroundColor: '#76c043',
                    }
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1, p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="h6" color="white" gutterBottom fontWeight={600}>
                  💰 Financial Summary
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.6)">
                      TOTAL INVESTMENT
                    </Typography>
                    <Typography variant="h5" color="white" fontWeight={700}>
                      {formatCurrency(calculatedFinancials.budget)}
                    </Typography>
                  </Box>
                  {calculatedFinancials.disbursed > 0 && (
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        DISBURSED AMOUNT
                      </Typography>
                      <Typography variant="h6" color="#76c043" fontWeight={600}>
                        {formatCurrency(calculatedFinancials.disbursed)}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(calculatedFinancials.disbursed / calculatedFinancials.budget) * 100} 
                        sx={{
                          mt: 1,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: '#76c043',
                          }
                        }}
                      />
                    </Box>
                  )}
                  {calculatedFinancials.remaining > 0 && (
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        REMAINING BALANCE
                      </Typography>
                      <Typography variant="h6" color="#ffa726" fontWeight={600}>
                        {formatCurrency(calculatedFinancials.remaining)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.6)">
                      EXPECTED ROI
                    </Typography>
                    <Typography variant="h5" color="#76c043" fontWeight={700}>
                      {project.expectedROI}%
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {calculatedMilestones.total > 0 && (
                <Box sx={{ flex: 1, p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="h6" color="white" gutterBottom fontWeight={600}>
                    🎯 Milestone Status
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        TOTAL MILESTONES
                      </Typography>
                      <Typography variant="h5" color="white" fontWeight={700}>
                        {calculatedMilestones.total}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Box sx={{ flex: 1, p: 2, bgcolor: 'rgba(118, 192, 67, 0.1)', borderRadius: 1 }}>
                        <Typography variant="caption" color="#76c043">
                          COMPLETED
                        </Typography>
                        <Typography variant="h4" color="#76c043" fontWeight={700}>
                          {calculatedMilestones.completed}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 2, bgcolor: 'rgba(255, 167, 38, 0.1)', borderRadius: 1 }}>
                        <Typography variant="caption" color="#ffa726">
                          PENDING
                        </Typography>
                        <Typography variant="h4" color="#ffa726" fontWeight={700}>
                          {calculatedMilestones.pending + calculatedMilestones.inProgress}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        COMPLETION RATE
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(calculatedMilestones.completed / calculatedMilestones.total) * 100} 
                        sx={{
                          mt: 1,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: '#76c043',
                          }
                        }}
                      />
                      <Typography variant="caption" color="white" sx={{ mt: 0.5, display: 'block' }}>
                        {Math.round((calculatedMilestones.completed / calculatedMilestones.total) * 100)}% Complete
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h6" color="white" gutterBottom fontWeight={600}>
                🤝 Tri-Party Agreement Members
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
                <Box sx={{ flex: 1, p: 2, bgcolor: 'rgba(118, 192, 67, 0.05)', borderRadius: 2, border: '1px solid rgba(118, 192, 67, 0.3)' }}>
                  <Chip 
                    label="Farmer" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#76c043', 
                      color: 'white',
                      fontWeight: 700,
                      mb: 2
                    }} 
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={project.farmerImage} 
                      sx={{ width: 56, height: 56, border: '2px solid #76c043' }}
                    />
                    <Box>
                      <Typography variant="h6" color="white" fontWeight={600}>
                        {project.farmerName}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        ID: {project.farmerId || 'FAR-234'}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    📍 {project.location}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, p: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: 2, border: '1px solid rgba(33, 150, 243, 0.3)' }}>
                  <Chip 
                    label="Investor" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#2196f3', 
                      color: 'white',
                      fontWeight: 700,
                      mb: 2
                    }} 
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      sx={{ width: 56, height: 56, bgcolor: '#2196f3', border: '2px solid #2196f3' }}
                    >
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" color="white" fontWeight={600}>
                        {project.investorName || 'You'}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        ID: {project.investorId || 'INV-067'}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    💼 Primary Investor
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, p: 2, bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: 2, border: '1px solid rgba(255, 152, 0, 0.3)' }}>
                  <Chip 
                    label="Landowner" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#ff9800', 
                      color: 'white',
                      fontWeight: 700,
                      mb: 2
                    }} 
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      sx={{ width: 56, height: 56, bgcolor: '#ff9800', border: '2px solid #ff9800' }}
                    >
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" color="white" fontWeight={600}>
                        {project.landownerName || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        ID: {project.landownerId || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    🏞️ Land Provider
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ flex: 1, p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="h6" color="white" gutterBottom fontWeight={600}>
                  📍 Location Details
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 3 }}>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        DISTRICT
                      </Typography>
                      <Typography variant="body1" color="white" fontWeight={600}>
                        {project.district || project.location}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        PROVINCE
                      </Typography>
                      <Typography variant="body1" color="white" fontWeight={600}>
                        {project.province || 'Central'}
                      </Typography>
                    </Box>
                    {project.coordinates && (
                      <Box>
                        <Typography variant="caption" color="rgba(255,255,255,0.6)">
                          GPS COORDINATES
                        </Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.8)" fontFamily="monospace">
                          {project.coordinates}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {project.coordinates && isLoaded && (
                    <Box sx={{ flex: 1, minWidth: 250 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          minHeight: 180,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '2px solid rgba(255,255,255,0.1)',
                          '& > div': {
                            borderRadius: 2,
                          },
                        }}
                      >
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%' }}
                          center={{
                            lat: parseFloat(project.coordinates.split(',')[0].trim()),
                            lng: parseFloat(project.coordinates.split(',')[1].trim()),
                          }}
                          zoom={12}
                          options={{
                            disableDefaultUI: true,
                            zoomControl: true,
                            mapTypeControl: false,
                            streetViewControl: false,
                            fullscreenControl: false,
                            styles: [
                              {
                                featureType: 'all',
                                elementType: 'geometry',
                                stylers: [{ color: '#242f3e' }],
                              },
                              {
                                featureType: 'all',
                                elementType: 'labels.text.stroke',
                                stylers: [{ color: '#242f3e' }],
                              },
                              {
                                featureType: 'all',
                                elementType: 'labels.text.fill',
                                stylers: [{ color: '#746855' }],
                              },
                              {
                                featureType: 'water',
                                elementType: 'geometry',
                                stylers: [{ color: '#17263c' }],
                              },
                            ],
                          }}
                        >
                          <Marker
                            position={{
                              lat: parseFloat(project.coordinates.split(',')[0].trim()),
                              lng: parseFloat(project.coordinates.split(',')[1].trim()),
                            }}
                          />
                        </GoogleMap>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Risk Assessment */}
              <Box sx={{ flex: 1, p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="h6" color="white" gutterBottom fontWeight={600}>
                  ⚠️ Risk Assessment
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={`Risk Level: ${project.riskLevel || 'LOW'}`}
                    sx={{ 
                      bgcolor: getRiskColor(),
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 2.5
                    }}
                  />
                  <Box sx={{ mt: 2 }}>
                    {(project.riskStatus || 'No Issues') === 'No Issues' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#76c043', fontSize: 24 }} />
                        <Typography variant="body1" color="#76c043" fontWeight={600}>
                          No Issues Detected
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningAmber sx={{ color: '#ffa726', fontSize: 24 }} />
                        <Typography variant="body1" color="#ffa726" fontWeight={600}>
                          {project.riskStatus}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Milestones Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h5" color="white" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              Project Milestones & Progress Tracking
            </Typography>
            {project.milestones && project.milestones.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {project.milestones.map((milestone, index) => (
                  <Box 
                    key={milestone.id}
                    sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(255,255,255,0.02)', 
                      borderRadius: 2, 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderLeft: `4px solid ${getMilestoneStatusColor(milestone.status)}`
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="h6" color="white" fontWeight={600}>
                            {index + 1}. {milestone.title}
                          </Typography>
                          <Chip 
                            label={milestone.status.replace('-', ' ').toUpperCase()} 
                            size="small"
                            sx={{ 
                              bgcolor: getMilestoneStatusColor(milestone.status),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 2 }}>
                          {milestone.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                          <Box>
                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                              START DATE
                            </Typography>
                            <Typography variant="body2" color="white">
                              {formatDate(milestone.startDate)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                              END DATE
                            </Typography>
                            <Typography variant="body2" color="white">
                              {formatDate(milestone.endDate)}
                            </Typography>
                          </Box>
                          {milestone.completedDate && (
                            <Box>
                              <Typography variant="caption" color="rgba(255,255,255,0.6)">
                                COMPLETED
                              </Typography>
                              <Typography variant="body2" color="#76c043" fontWeight={600}>
                                {formatDate(milestone.completedDate)}
                              </Typography>
                            </Box>
                          )}
                          <Box>
                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                              PAYMENT
                            </Typography>
                            <Typography variant="body2" color="#76c043" fontWeight={600}>
                              {formatCurrency(milestone.payment)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">
                          Progress: {milestone.tasks.completed}/{milestone.tasks.total} tasks completed
                        </Typography>
                        <Typography variant="body2" color="white" fontWeight={600}>
                          {milestone.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={milestone.progress} 
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            backgroundColor: getMilestoneStatusColor(milestone.status),
                          }
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="rgba(255,255,255,0.5)">
                No milestone data available
              </Typography>
            )}
          </Box>
        )}

        {/* Payments Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h5" color="white" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              Payment Schedule & Financial Breakdown
            </Typography>
            
            {/* Financial Breakdown - Auto-Calculated */}
            {calculatedBudgetBreakdown.length > 0 && (
              <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="white" fontWeight={600}>
                    💵 Budget Breakdown by Category
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="rgba(255,255,255,0.6)">
                      Total Budget: {formatCurrency(calculatedBudgetBreakdown[0]?.calculatedTotal || 0)}
                    </Typography>
                    {calculatedBudgetBreakdown.length > 4 && (
                      <Button
                        size="small"
                        endIcon={budgetExpanded ? <ExpandLess /> : <ExpandMore />}
                        onClick={() => setBudgetExpanded(!budgetExpanded)}
                        sx={{ 
                          color: '#76c043',
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        {budgetExpanded ? 'View Less' : `View All (${calculatedBudgetBreakdown.length})`}
                      </Button>
                    )}
                  </Box>
                </Box>
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {(budgetExpanded ? calculatedBudgetBreakdown : calculatedBudgetBreakdown.slice(0, 4)).map((item, index) => (
                    <Box 
                      key={index}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1" color="white" fontWeight={500}>
                          {item.category}
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body1" color="white" fontWeight={700}>
                            {formatCurrency(item.amount)}
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.6)">
                            {item.percentage}% of total
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ position: 'relative' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={item.percentage} 
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                              backgroundColor: getCategoryColor(index, item.percentage),
                              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            }
                          }}
                        />
                        {item.percentage >= 15 && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              position: 'absolute',
                              right: 8,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                            }}
                          >
                            {item.percentage}%
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
                {!budgetExpanded && calculatedBudgetBreakdown.length > 4 && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)">
                      Showing top 4 categories • {calculatedBudgetBreakdown.length - 4} more categories available
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Payment Schedule */}
            {project.payments && project.payments.length > 0 ? (
              <Box>
                <Typography variant="h6" color="white" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
                  📅 Payment Installments
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {project.payments.map((payment) => {
                    const daysRemaining = getDaysRemaining(payment.dueDate);
                    return (
                      <Box 
                        key={payment.id}
                        sx={{ 
                          p: 2.5, 
                          bgcolor: 'rgba(255,255,255,0.02)', 
                          borderRadius: 2, 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderLeft: `4px solid ${getPaymentStatusColor(payment.status)}`
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="body1" color="white" fontWeight={600}>
                                {payment.description}
                              </Typography>
                              <Chip 
                                label={payment.status.toUpperCase()} 
                                size="small"
                                sx={{ 
                                  bgcolor: getPaymentStatusColor(payment.status),
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                <CalendarToday sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                Due: {formatDate(payment.dueDate)}
                              </Typography>
                              {payment.paidDate && (
                                <Typography variant="body2" color="#76c043">
                                  <CheckCircle sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                  Paid: {formatDate(payment.paidDate)}
                                </Typography>
                              )}
                              {payment.status === 'pending' && daysRemaining >= 0 && (
                                <Typography variant="body2" color="#ffa726">
                                  <AccessTime sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                  {daysRemaining} days remaining
                                </Typography>
                              )}
                              {payment.status === 'overdue' && (
                                <Typography variant="body2" color="#ef5350">
                                  <WarningAmber sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                  {Math.abs(daysRemaining)} days overdue
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <Typography variant="h6" color="white" fontWeight={700}>
                            {formatCurrency(payment.amount)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ) : (
              <Typography variant="body1" color="rgba(255,255,255,0.5)">
                No payment data available
              </Typography>
            )}
          </Box>
        )}

        {/* Team Members Tab */}
        {activeTab === 3 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" color="white" gutterBottom fontWeight={600}>
                Project Team Members
              </Typography>
              {project.coordinates && (
                <Button
                  variant="contained"
                  startIcon={<LocationOn />}
                  onClick={() => setMapDialogOpen(true)}
                  sx={{ 
                    bgcolor: '#76c043',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#6ba83c'
                    }
                  }}
                >
                  View Location Map
                </Button>
              )}
            </Box>
            {project.partyMembers && project.partyMembers.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {project.partyMembers.map((member) => (
                  <Box 
                    key={member.id}
                    sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(255,255,255,0.02)', 
                      borderRadius: 2, 
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Avatar 
                        src={member.image} 
                        sx={{ width: 80, height: 80, border: '3px solid rgba(118, 192, 67, 0.5)' }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="h6" color="white" fontWeight={600}>
                            {member.name}
                          </Typography>
                          <Chip 
                            label={member.role.toUpperCase()} 
                            size="small"
                            sx={{ 
                              bgcolor: member.role === 'farmer' ? '#76c043' : member.role === 'investor' ? '#2196f3' : '#ff9800',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                          {member.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="body2" color="#ffa726">
                                ⭐ {member.rating.toFixed(1)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 2 }}>
                          ID: {member.id}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                          <Box>
                            <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Email sx={{ fontSize: 14 }} /> EMAIL
                            </Typography>
                            <Typography variant="body2" color="white">
                              {member.email}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Phone sx={{ fontSize: 14 }} /> PHONE
                            </Typography>
                            <Typography variant="body2" color="white">
                              {member.phone}
                            </Typography>
                          </Box>
                          {member.location && (
                            <Box>
                              <Typography variant="caption" color="rgba(255,255,255,0.6)">
                                LOCATION
                              </Typography>
                              <Typography variant="body2" color="white">
                                {member.location}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        {member.specialization && (
                          <Box>
                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                              SPECIALIZATION
                            </Typography>
                            <Typography variant="body2" color="white">
                              {member.specialization}
                            </Typography>
                          </Box>
                        )}
                        {member.experience && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                              EXPERIENCE
                            </Typography>
                            <Typography variant="body2" color="white">
                              {member.experience}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="rgba(255,255,255,0.5)">
                No team member data available
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            textTransform: 'none',
            px: 3,
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.5)',
              bgcolor: 'rgba(255,255,255,0.05)'
            }
          }}
        >
          Close
        </Button>
        <Button 
          variant="contained"
          sx={{ 
            bgcolor: '#76c043',
            color: 'white',
            textTransform: 'none',
            px: 4,
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#6ba83c'
            }
          }}
        >
          Download Full Report
        </Button>
      </DialogActions>
    </Dialog>

    {/* Location Map Dialog - Separate from main dialog */}
    {project.partyMembers && project.coordinates && (
      <LocationMapDialog
        open={mapDialogOpen}
        onClose={() => setMapDialogOpen(false)}
        partyMembers={project.partyMembers}
        projectLocation={project.location}
        coordinates={project.coordinates}
        district={project.district || ''}
        province={project.province || ''}
      />
    )}
    </>
  );
};

export default ProjectDetailsDialog;
