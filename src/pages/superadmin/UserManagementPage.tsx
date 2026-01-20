import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    Block,
    CheckCircle,
    FilterList,
    ManageAccounts,
    Search,
    Visibility,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'John Farmer',
    email: 'john@example.com',
    role: 'farmer',
    verified: true,
    status: 'active',
    joinDate: '2025-11-15',
    projects: 12,
  },
  {
    id: 2,
    name: 'Sarah Investor',
    email: 'sarah@example.com',
    role: 'investor',
    verified: true,
    status: 'active',
    joinDate: '2025-10-22',
    projects: 8,
  },
  {
    id: 3,
    name: 'Mike Landowner',
    email: 'mike@example.com',
    role: 'landowner',
    verified: false,
    status: 'pending',
    joinDate: '2026-01-10',
    projects: 0,
  },
  {
    id: 4,
    name: 'Emma Cultivator',
    email: 'emma@example.com',
    role: 'farmer',
    verified: true,
    status: 'suspended',
    joinDate: '2025-09-05',
    projects: 5,
  },
  {
    id: 5,
    name: 'David Capital',
    email: 'david@example.com',
    role: 'investor',
    verified: true,
    status: 'active',
    joinDate: '2025-12-01',
    projects: 15,
  },
];

const UserManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'suspended':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer':
        return '#6B8E23';
      case 'investor':
        return '#3b82f6';
      case 'landowner':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeaderWithIcon
          icon={ManageAccounts}
          title="User Management & Account Oversight"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={`${mockUsers.length} Total Users`} color="primary" />
              <Chip
                label={`${mockUsers.filter((u) => !u.verified).length} Unverified`}
                color="warning"
              />
            </Box>
          }
        />
        <CardContent>
          {/* Search and Filter Section */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(107, 142, 35, 0.05)' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flexGrow: 1, minWidth: '300px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                displayEmpty
                startAdornment={<FilterList sx={{ mr: 1 }} />}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="farmer">Farmer</MenuItem>
                <MenuItem value="investor">Investor</MenuItem>
                <MenuItem value="landowner">Land Owner</MenuItem>
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </Box>
          </Paper>

          {/* User Statistics */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                {mockUsers.filter((u) => u.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                {mockUsers.filter((u) => !u.verified).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Verification
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                {mockUsers.filter((u) => u.status === 'suspended').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Suspended Accounts
              </Typography>
            </Paper>
          </Box>

          {/* Users Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Verified</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Projects</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: getRoleColor(user.role) }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{
                            bgcolor: `${getRoleColor(user.role)}20`,
                            color: getRoleColor(user.role),
                            textTransform: 'capitalize',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {user.verified ? (
                          <CheckCircle sx={{ color: '#4CAF50' }} />
                        ) : (
                          <Chip label="Pending" size="small" color="warning" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={getStatusColor(user.status)}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>{user.projects}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.joinDate}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Suspend Account">
                          <IconButton
                            size="small"
                            color="error"
                            disabled={user.status === 'suspended'}
                          >
                            <Block />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={mockUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Quick Actions */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" startIcon={<FilterList />}>
              Export User List
            </Button>
            <Button variant="contained" color="error">
              Bulk Actions
            </Button>
          </Box>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default UserManagementPage;
