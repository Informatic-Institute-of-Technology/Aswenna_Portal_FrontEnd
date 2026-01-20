import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    Assessment,
    CheckCircle,
    Error,
    FilterList,
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
    IconButton,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';

// Mock project data
const projects = [
  {
    id: 1245,
    name: 'Organic Rice Cultivation',
    farmer: { name: 'John Farmer', avatar: 'JF' },
    investor: { name: 'Sarah Capital', avatar: 'SC' },
    landowner: { name: 'Mike Properties', avatar: 'MP' },
    status: 'active',
    progress: 65,
    startDate: '2025-12-01',
    endDate: '2026-06-30',
    totalFunding: '$45,000',
    milestonesCompleted: 3,
    milestonesTotal: 5,
  },
  {
    id: 1246,
    name: 'Vegetable Export Project',
    farmer: { name: 'Emma Green', avatar: 'EG' },
    investor: { name: 'David Funds', avatar: 'DF' },
    landowner: { name: 'Lisa Land', avatar: 'LL' },
    status: 'negotiation',
    progress: 15,
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    totalFunding: '$78,000',
    milestonesCompleted: 0,
    milestonesTotal: 6,
  },
  {
    id: 1243,
    name: 'Fruit Orchard Development',
    farmer: { name: 'Robert Farm', avatar: 'RF' },
    investor: { name: 'Helen Invest', avatar: 'HI' },
    landowner: { name: 'Tom Estate', avatar: 'TE' },
    status: 'disputed',
    progress: 40,
    startDate: '2025-10-15',
    endDate: '2026-10-15',
    totalFunding: '$125,000',
    milestonesCompleted: 2,
    milestonesTotal: 8,
  },
  {
    id: 1240,
    name: 'Herb Garden Initiative',
    farmer: { name: 'Alice Herbs', avatar: 'AH' },
    investor: { name: 'Bob Money', avatar: 'BM' },
    landowner: { name: 'Carol Fields', avatar: 'CF' },
    status: 'completed',
    progress: 100,
    startDate: '2025-06-01',
    endDate: '2025-12-31',
    totalFunding: '$32,000',
    milestonesCompleted: 4,
    milestonesTotal: 4,
  },
];

const ProjectOversightPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'disputed':
        return 'error';
      case 'negotiation':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle />;
      case 'completed':
        return <CheckCircle />;
      case 'disputed':
        return <Error />;
      case 'negotiation':
        return <Warning />;
      default:
        return <CheckCircle />;
    }
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeaderWithIcon
          icon={Assessment}
          title="Project & Agreement Oversight"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={`${projects.length} Total Projects`} color="primary" />
              <Chip
                label={`${projects.filter((p) => p.status === 'disputed').length} Disputes`}
                color="error"
              />
            </Box>
          }
        />
        <CardContent>
          {/* Project Statistics */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                {projects.filter((p) => p.status === 'negotiation').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Negotiation
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                {projects.filter((p) => p.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Projects
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                {projects.filter((p) => p.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                {projects.filter((p) => p.status === 'disputed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Disputed
              </Typography>
            </Paper>
          </Box>

          {/* Filter */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(107, 142, 35, 0.05)' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FilterList />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="all">All Projects</MenuItem>
                <MenuItem value="negotiation">Negotiation</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="disputed">Disputed</MenuItem>
              </Select>
              <Button variant="outlined" sx={{ ml: 'auto' }}>
                Export to CSV
              </Button>
            </Box>
          </Paper>

          {/* Projects Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project ID</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Tri-Party</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Funding</TableCell>
                  <TableCell>Milestones</TableCell>
                  <TableCell>Timeline</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        #{project.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {project.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <AvatarGroup max={3}>
                        <Tooltip title={`Farmer: ${project.farmer.name}`}>
                          <Avatar sx={{ bgcolor: '#6B8E23', width: 32, height: 32, fontSize: '0.875rem' }}>
                            {project.farmer.avatar}
                          </Avatar>
                        </Tooltip>
                        <Tooltip title={`Investor: ${project.investor.name}`}>
                          <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32, fontSize: '0.875rem' }}>
                            {project.investor.avatar}
                          </Avatar>
                        </Tooltip>
                        <Tooltip title={`Land Owner: ${project.landowner.name}`}>
                          <Avatar sx={{ bgcolor: '#FF9800', width: 32, height: 32, fontSize: '0.875rem' }}>
                            {project.landowner.avatar}
                          </Avatar>
                        </Tooltip>
                      </AvatarGroup>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(project.status)}
                        label={project.status}
                        size="small"
                        color={getStatusColor(project.status)}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: 100 }}>
                        <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                          {project.progress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                        {project.totalFunding}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${project.milestonesCompleted}/${project.milestonesTotal}`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block">
                        {project.startDate}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        to {project.endDate}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Agreement">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {project.status === 'disputed' && (
                        <Button size="small" variant="contained" color="error" sx={{ ml: 1 }}>
                          Resolve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ProjectOversightPage;
