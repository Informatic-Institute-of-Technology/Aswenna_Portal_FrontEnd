import type { Project } from '@/types';
import {
    AccountBalance,
    Assignment,
    CheckCircle,
    Circle,
    Close,
    RadioButtonChecked,
    Timeline as TimelineIcon,
    TrendingUp
} from '@mui/icons-material';
import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
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

interface ProjectDetailModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ paddingTop: 16 }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const ProjectDetailModal = ({ open, onClose, project }: ProjectDetailModalProps) => {
  const [tabValue, setTabValue] = useState(0);

  if (!project) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      active: 'success',
      completed: 'success',
      cancelled: 'error',
      draft: 'warning'
    };
    return colors[status] || 'info';
  };

  const getPhaseLabel = (phase?: string) => {
    const labels: Record<string, string> = {
      planning: 'Planning',
      preparation: 'Land Preparation',
      cultivation: 'Cultivation',
      harvest: 'Harvesting',
      'post-harvest': 'Post-Harvest'
    };
    return phase ? labels[phase] || phase : 'N/A';
  };

  // Mock milestones data
  const milestones = [
    { phase: 'Planning', date: '2025-01-01', status: 'completed', description: 'Project planning and budgeting' },
    { phase: 'Land Preparation', date: '2025-01-15', status: 'completed', description: 'Soil testing and land clearing' },
    { phase: 'Cultivation', date: '2025-02-01', status: 'active', description: 'Planting and initial care' },
    { phase: 'Harvesting', date: '2025-04-30', status: 'pending', description: 'Crop harvesting' },
    { phase: 'Post-Harvest', date: '2025-05-15', status: 'pending', description: 'Processing and distribution' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {project.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label={project.status} size="small" color={getStatusColor(project.status)} />
              <Chip label={project.engagementModel === 'harvest-based' ? 'Harvest Based' : 'Commission Based'} size="small" variant="outlined" />
              {project.currentPhase && (
                <Chip label={getPhaseLabel(project.currentPhase)} size="small" color="primary" variant="outlined" />
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Assignment />} label="Overview" />
          <Tab icon={<AccountBalance />} label="Financial Report" />
          <Tab icon={<TimelineIcon />} label="Timeline & Milestones" />
          {project.engagementModel === 'harvest-based' && (
            <Tab icon={<TrendingUp />} label="Bill of Quantities" />
          )}
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Project Information</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{project.description}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body1">{project.location}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Land Size</Typography>
                  <Typography variant="body1">{project.landSize} {project.landUnit}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Progress</Typography>
                  <Typography variant="body1">{project.progressPercentage}%</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Start Date</Typography>
                  <Typography variant="body1">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Expected End Date</Typography>
                  <Typography variant="body1">
                    {project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                {project.investorName && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Investor</Typography>
                    <Typography variant="body1">{project.investorName}</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </TabPanel>

        {/* Financial Report Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.50' }}>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell align="right"><strong>Amount (Rs.)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total Investment</TableCell>
                  <TableCell align="right">{project.totalInvestment?.toLocaleString() || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Actual Spent</TableCell>
                  <TableCell align="right">{project.actualSpent?.toLocaleString() || 'N/A'}</TableCell>
                </TableRow>
                {project.revenue !== undefined && (
                  <TableRow sx={{ bgcolor: 'success.50' }}>
                    <TableCell><strong>Revenue</strong></TableCell>
                    <TableCell align="right"><strong>{project.revenue.toLocaleString()}</strong></TableCell>
                  </TableRow>
                )}
                {project.profit !== undefined && (
                  <TableRow sx={{ bgcolor: project.profit >= 0 ? 'success.100' : 'error.50' }}>
                    <TableCell><strong>Profit/Loss</strong></TableCell>
                    <TableCell align="right">
                      <strong style={{ color: project.profit >= 0 ? 'green' : 'red' }}>
                        {project.profit >= 0 ? '+' : ''}{project.profit.toLocaleString()}
                      </strong>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {project.harvestBasedDetails && (
            <Box sx={{ mt: 2 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Harvest-Based Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Investor Share</Typography>
                    <Typography variant="body1">{project.harvestBasedDetails.investorSharePercentage}%</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Farmer Share</Typography>
                    <Typography variant="body1">{project.harvestBasedDetails.farmerSharePercentage}%</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Estimated Yield</Typography>
                    <Typography variant="body1">
                      {project.harvestBasedDetails.estimatedYield} {project.harvestBasedDetails.yieldUnit}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Estimated Revenue</Typography>
                    <Typography variant="body1">
                      Rs. {project.harvestBasedDetails.estimatedRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}

          {project.commissionBasedDetails && (
            <Box sx={{ mt: 2 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Commission-Based Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Service Description</Typography>
                    <Typography variant="body1">{project.commissionBasedDetails.serviceDescription}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Commission Type</Typography>
                    <Typography variant="body1">
                      {project.commissionBasedDetails.commissionType === 'fixed' ? 'Fixed Amount' : 'Percentage-Based'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Commission</Typography>
                    <Typography variant="body1">
                      {project.commissionBasedDetails.commissionType === 'fixed'
                        ? `Rs. ${project.commissionBasedDetails.commissionAmount?.toLocaleString()}`
                        : `${project.commissionBasedDetails.commissionPercentage}%`
                      }
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Estimated Earnings</Typography>
                    <Typography variant="body1">
                      Rs. {project.commissionBasedDetails.estimatedEarnings.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </TabPanel>

        {/* Timeline & Milestones Tab */}
        <TabPanel value={tabValue} index={2}>
          <Stack spacing={3}>
            {milestones.map((milestone, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
                  {milestone.status === 'completed' ? (
                    <CheckCircle color="success" sx={{ fontSize: 32 }} />
                  ) : milestone.status === 'active' ? (
                    <RadioButtonChecked color="primary" sx={{ fontSize: 32 }} />
                  ) : (
                    <Circle sx={{ fontSize: 32, color: 'grey.400' }} />
                  )}
                  {index < milestones.length - 1 && (
                    <Box sx={{ 
                      width: 2, 
                      flex: 1, 
                      bgcolor: milestone.status === 'completed' ? 'success.main' : 'grey.300',
                      minHeight: 40,
                      my: 1
                    }} />
                  )}
                </Box>
                <Box sx={{ flex: 1, pb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(milestone.date).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={milestone.status}
                      size="small"
                      color={
                        milestone.status === 'completed' ? 'success' :
                        milestone.status === 'active' ? 'primary' : 'default'
                      }
                    />
                  </Box>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {milestone.phase}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {milestone.description}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
          </Stack>
        </TabPanel>

        {/* BOQ Tab (only for harvest-based) */}
        {project.engagementModel === 'harvest-based' && (
          <TabPanel value={tabValue} index={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.50' }}>
                    <TableCell><strong>Section</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell align="right"><strong>Quantity</strong></TableCell>
                    <TableCell align="right"><strong>Unit Cost</strong></TableCell>
                    <TableCell align="right"><strong>Total</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.harvestBasedDetails?.boqItems && project.harvestBasedDetails.boqItems.length > 0 ? (
                    project.harvestBasedDetails.boqItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.section}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity} {item.unit}</TableCell>
                        <TableCell align="right">Rs. {item.unitCost.toFixed(2)}</TableCell>
                        <TableCell align="right"><strong>Rs. {item.totalCost.toFixed(2)}</strong></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">No BOQ items available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {project.harvestBasedDetails?.boqItems && project.harvestBasedDetails.boqItems.length > 0 && (
                  <TableBody>
                    <TableRow sx={{ bgcolor: 'primary.100' }}>
                      <TableCell colSpan={4} align="right"><strong>Grand Total</strong></TableCell>
                      <TableCell align="right">
                        <strong>Rs. {project.harvestBasedDetails.totalProjectCost.toLocaleString()}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </TabPanel>
        )}
      </DialogContent>
    </Dialog>
  );
};
