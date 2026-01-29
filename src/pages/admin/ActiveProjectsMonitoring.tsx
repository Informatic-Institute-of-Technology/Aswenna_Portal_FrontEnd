import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import type { ProjectSummary } from '@/types/admin.types';
import {
    Assessment,
    CheckCircle,
    Error,
    LocationOn,
    Search,
    TrendingUp,
    Visibility,
    Warning,
} from '@mui/icons-material';
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Grid, InputAdornment,
    LinearProgress,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { useState } from 'react';

const mockProjects: ProjectSummary[] = [
  {
    id: 'PRJ-045',
    name: 'Rice Cultivation - Polonnaruwa',
    type: 'Paddy Field',
    status: 'active',
    startDate: '2025-12-01',
    completionPercentage: 45,
    farmer: { id: 'FAR-089', name: 'Nimal Fernando' },
    investor: { id: 'INV-012', name: 'Green Future Investments' },
    landowner: { id: 'LND-023', name: 'Silva Estates' },
    totalInvestment: 600000,
    disbursedAmount: 450000,
    remainingBudget: 150000,
    totalMilestones: 6,
    completedMilestones: 3,
    pendingMilestones: 2,
    overdueMilestones: 1,
    location: {
      district: 'Polonnaruwa',
      province: 'North Central',
      coordinates: { lat: 7.9403, lng: 81.0188 },
    },
    hasDisputes: false,
    hasOverduePayments: true,
    riskLevel: 'medium',
  },
  {
    id: 'PRJ-102',
    name: 'Fruit Orchard - Matale',
    type: 'Fruit Plantation',
    status: 'active',
    startDate: '2026-01-10',
    completionPercentage: 15,
    farmer: { id: 'FAR-145', name: 'Amara Bandara' },
    investor: { id: 'INV-034', name: 'Agri Ventures PLC' },
    landowner: { id: 'LND-056', name: 'Highland Properties' },
    totalInvestment: 850000,
    disbursedAmount: 127500,
    remainingBudget: 722500,
    totalMilestones: 8,
    completedMilestones: 1,
    pendingMilestones: 7,
    overdueMilestones: 0,
    location: {
      district: 'Matale',
      province: 'Central',
      coordinates: { lat: 7.4675, lng: 80.6234 },
    },
    hasDisputes: false,
    hasOverduePayments: false,
    riskLevel: 'low',
  },
  {
    id: 'PRJ-078',
    name: 'Vegetable Farm - Kurunegala',
    type: 'Vegetable Cultivation',
    status: 'active',
    startDate: '2025-11-20',
    completionPercentage: 65,
    farmer: { id: 'FAR-156', name: 'Sunita Jayawardena' },
    investor: { id: 'INV-023', name: 'Farm Capital Ltd' },
    landowner: { id: 'LND-042', name: 'Rathnayake Properties' },
    totalInvestment: 420000,
    disbursedAmount: 273000,
    remainingBudget: 147000,
    totalMilestones: 5,
    completedMilestones: 3,
    pendingMilestones: 2,
    overdueMilestones: 0,
    location: {
      district: 'Kurunegala',
      province: 'North Western',
      coordinates: { lat: 7.4818, lng: 80.3609 },
    },
    hasDisputes: false,
    hasOverduePayments: false,
    riskLevel: 'low',
  },
  {
    id: 'PRJ-133',
    name: 'Coconut Plantation - Gampaha',
    type: 'Coconut',
    status: 'active',
    startDate: '2025-10-15',
    completionPercentage: 72,
    farmer: { id: 'FAR-234', name: 'Prasanna Silva' },
    investor: { id: 'INV-067', name: 'Smart Agri Investments' },
    landowner: { id: 'LND-019', name: 'Coastal Lands' },
    totalInvestment: 720000,
    disbursedAmount: 518400,
    remainingBudget: 201600,
    totalMilestones: 7,
    completedMilestones: 5,
    pendingMilestones: 2,
    overdueMilestones: 0,
    location: {
      district: 'Gampaha',
      province: 'Western',
      coordinates: { lat: 7.0873, lng: 80.0142 },
    },
    hasDisputes: false,
    hasOverduePayments: false,
    riskLevel: 'low',
  },
  {
    id: 'PRJ-089',
    name: 'Tea Plantation - Nuwara Eliya',
    type: 'Tea',
    status: 'disputed',
    startDate: '2025-09-01',
    completionPercentage: 38,
    farmer: { id: 'FAR-178', name: 'Chaminda Gunawardena' },
    investor: { id: 'INV-045', name: 'Investor Corp Ltd' },
    landowner: { id: 'LND-091', name: 'Perera Lands' },
    totalInvestment: 950000,
    disbursedAmount: 361000,
    remainingBudget: 589000,
    totalMilestones: 9,
    completedMilestones: 3,
    pendingMilestones: 4,
    overdueMilestones: 2,
    location: {
      district: 'Nuwara Eliya',
      province: 'Central',
      coordinates: { lat: 6.9497, lng: 80.7891 },
    },
    hasDisputes: true,
    hasOverduePayments: true,
    riskLevel: 'high',
  },
  {
    id: 'PRJ-156',
    name: 'Organic Farm - Kandy',
    type: 'Organic Mixed',
    status: 'completed',
    startDate: '2025-06-01',
    endDate: '2026-01-15',
    completionPercentage: 100,
    farmer: { id: 'FAR-098', name: 'Dinesh Rathnayake' },
    investor: { id: 'INV-078', name: 'Green Earth Fund' },
    landowner: { id: 'LND-034', name: 'Hill Country Estates' },
    totalInvestment: 380000,
    disbursedAmount: 380000,
    remainingBudget: 0,
    totalMilestones: 4,
    completedMilestones: 4,
    pendingMilestones: 0,
    overdueMilestones: 0,
    location: {
      district: 'Kandy',
      province: 'Central',
      coordinates: { lat: 7.2906, lng: 80.6337 },
    },
    hasDisputes: false,
    hasOverduePayments: false,
    riskLevel: 'low',
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'completed':
      return 'info';
    case 'cancelled':
      return 'default';
    case 'disputed':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low':
      return 'success';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
    default:
      return 'default';
  }
};

const ActiveProjectsMonitoring = () => {
  const [projects] = useState<ProjectSummary[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.investor.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (project: ProjectSummary) => {
    setSelectedProject(project);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedProject(null);
  };

  const getStatusStats = () => {
    return {
      all: projects.length,
      active: projects.filter((p) => p.status === 'active').length,
      completed: projects.filter((p) => p.status === 'completed').length,
      disputed: projects.filter((p) => p.status === 'disputed').length,
    };
  };

  const statusStats = getStatusStats();
  const totalInvestment = projects.reduce((sum, p) => sum + p.totalInvestment, 0);
  const totalDisbursed = projects.reduce((sum, p) => sum + p.disbursedAmount, 0);
  const projectsWithIssues = projects.filter(
    (p) => p.hasDisputes || p.hasOverduePayments
  ).length;

  return (
    <DashboardLayout>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Assessment color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Total Projects
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {projects.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {statusStats.active} active • {statusStats.completed} completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp color="success" />
                <Typography variant="body2" color="text.secondary">
                  Total Investment
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {formatCurrency(totalInvestment)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatCurrency(totalDisbursed)} disbursed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircle color="info" />
                <Typography variant="body2" color="text.secondary">
                  Avg. Completion
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {Math.round(
                  projects.reduce((sum, p) => sum + p.completionPercentage, 0) /
                    projects.length
                )}
                %
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Warning color="error" />
                <Typography variant="body2" color="text.secondary">
                  Projects with Issues
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {projectsWithIssues}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Require attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardHeaderWithIcon icon={Assessment} title="All Projects - Real-time Monitoring" />
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search by project name, ID, or party..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Tabs
                  value={statusFilter}
                  onChange={(_, newValue) => setStatusFilter(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label={`All (${statusStats.all})`} value="all" />
                  <Tab label={`Active (${statusStats.active})`} value="active" />
                  <Tab label={`Completed (${statusStats.completed})`} value="completed" />
                  <Tab label={`Disputed (${statusStats.disputed})`} value="disputed" />
                </Tabs>
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Tri-Party Members</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell align="right">Investment</TableCell>
                  <TableCell align="center">Milestones</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="center">Risk</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {project.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project.id} • {project.type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                        <Tooltip title={`Farmer: ${project.farmer.name}`}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#6B8E23' }}>
                            F
                          </Avatar>
                        </Tooltip>
                        <Tooltip title={`Investor: ${project.investor.name}`}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#2196F3' }}>
                            I
                          </Avatar>
                        </Tooltip>
                        <Tooltip title={`Landowner: ${project.landowner.name}`}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF9800' }}>
                            L
                          </Avatar>
                        </Tooltip>
                      </AvatarGroup>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">{project.completionPercentage}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={project.completionPercentage}
                          color={project.completionPercentage > 75 ? 'success' : 'primary'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(project.totalInvestment)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(project.disbursedAmount)} paid
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {project.completedMilestones}/{project.totalMilestones}
                        </Typography>
                        {project.overdueMilestones > 0 && (
                          <Chip
                            label={`${project.overdueMilestones} overdue`}
                            size="small"
                            color="error"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption">{project.location.district}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {project.location.province}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={project.riskLevel}
                        size="small"
                        color={getRiskColor(project.riskLevel) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                      />
                      {(project.hasDisputes || project.hasOverduePayments) && (
                        <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          {project.hasDisputes && (
                            <Tooltip title="Has active disputes">
                              <Error fontSize="small" color="error" />
                            </Tooltip>
                          )}
                          {project.hasOverduePayments && (
                            <Tooltip title="Has overdue payments">
                              <Warning fontSize="small" color="warning" />
                            </Tooltip>
                          )}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={project.status}
                        size="small"
                        color={getStatusColor(project.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View 360° Details">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(project)}
                        >
                          View
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredProjects.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No projects found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle>
              <Typography variant="h6">{selectedProject.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedProject.id} • Started {formatDate(selectedProject.startDate)}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Progress Overview
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Overall Completion: {selectedProject.completionPercentage}%
                      </Typography>
                      <Chip
                        label={selectedProject.status}
                        size="small"
                        color={getStatusColor(selectedProject.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={selectedProject.completionPercentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Financial Details
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Total Investment: {formatCurrency(selectedProject.totalInvestment)}
                    </Typography>
                    <Typography variant="body2">
                      Disbursed: {formatCurrency(selectedProject.disbursedAmount)}
                    </Typography>
                    <Typography variant="body2">
                      Remaining: {formatCurrency(selectedProject.remainingBudget)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Milestone Status
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Total: {selectedProject.totalMilestones}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      Completed: {selectedProject.completedMilestones}
                    </Typography>
                    <Typography variant="body2" color="warning.main">
                      Pending: {selectedProject.pendingMilestones}
                    </Typography>
                    {selectedProject.overdueMilestones > 0 && (
                      <Typography variant="body2" color="error.main">
                        Overdue: {selectedProject.overdueMilestones}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Tri-Party Agreement Members
                  </Typography>
                  <Grid container spacing={2} sx={{ pl: 2 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Chip label="Farmer" size="small" color="primary" sx={{ mb: 1 }} />
                        <Typography variant="body2" fontWeight={600}>
                          {selectedProject.farmer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedProject.farmer.id}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Chip label="Investor" size="small" color="info" sx={{ mb: 1 }} />
                        <Typography variant="body2" fontWeight={600}>
                          {selectedProject.investor.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedProject.investor.id}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Chip label="Landowner" size="small" color="warning" sx={{ mb: 1 }} />
                        <Typography variant="body2" fontWeight={600}>
                          {selectedProject.landowner.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedProject.landowner.id}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>


                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Location
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      District: {selectedProject.location.district}
                    </Typography>
                    <Typography variant="body2">
                      Province: {selectedProject.location.province}
                    </Typography>
                    {selectedProject.location.coordinates && (
                      <Typography variant="caption" color="text.secondary">
                        Coordinates: {selectedProject.location.coordinates.lat}, {selectedProject.location.coordinates.lng}
                      </Typography>
                    )}
                  </Box>
                </Grid>


                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Risk Assessment
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Chip
                      label={`Risk Level: ${selectedProject.riskLevel.toUpperCase()}`}
                      size="small"
                      color={getRiskColor(selectedProject.riskLevel) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                      sx={{ mr: 1 }}
                    />
                    {selectedProject.hasDisputes && (
                      <Chip label="Active Disputes" size="small" color="error" icon={<Error />} sx={{ mr: 1 }} />
                    )}
                    {selectedProject.hasOverduePayments && (
                      <Chip label="Overdue Payments" size="small" color="warning" icon={<Warning />} />
                    )}
                    {!selectedProject.hasDisputes && !selectedProject.hasOverduePayments && (
                      <Chip label="No Issues" size="small" color="success" icon={<CheckCircle />} />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" color="primary">
                View Full Project Details
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default ActiveProjectsMonitoring;
