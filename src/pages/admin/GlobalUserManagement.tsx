import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import { adminService, type ApiUser } from '@/services/admin.service';
import type { GlobalUser } from '@/types/admin.types';
import {
    CheckCircle,
    Error,
    Pending,
    Person,
    Search,
    Visibility,
    Warning
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Grid, IconButton,
    InputAdornment,
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
import { useEffect, useState } from 'react';

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

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTrustScoreColor = (score: number) => {
  if (score >= 90) return 'success';
  if (score >= 75) return 'info';
  if (score >= 60) return 'warning';
  return 'error';
};

const getVerificationIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return <CheckCircle fontSize="small" color="success" />;
    case 'pending':
      return <Pending fontSize="small" color="warning" />;
    case 'rejected':
      return <Error fontSize="small" color="error" />;
    default:
      return <Pending fontSize="small" color="disabled" />;
  }
};

const roleIdToRole = (roleId: string): GlobalUser['role'] => {
  const roleMapping: { [key: string]: GlobalUser['role'] } = {
    '696e40fda4f896e9f40c8b93': 'farmer',
    '696e6163b558abe269548099': 'investor',
    '696e616db558abe26954809c': 'landowner',
    '696f008a3e12fb6fd9ed945b': 'superadmin',
  };

  return roleMapping[roleId] || 'farmer';
};

const mapApiUserToGlobalUser = (user: ApiUser): GlobalUser => {
  const fullName = user.fullName || `${user.firstName} ${user.lastName}`.trim();
  const isVerified = Boolean(user.emailVerified);
  const phoneVerified = Boolean(user.phoneNumberVerified);
  const trustScore = isVerified ? 85 : 65;

  return {
    id: user._id,
    fullName: fullName || 'Unknown User',
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: roleIdToRole(user.role),
    registrationDate: user.createdAt,
    lastLogin: user.updatedAt || user.createdAt,
    isVerified,
    isActive: true,
    address: user.address,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTransactions: 0,
    verificationStatus: {
      identity: 'pending',
      email: isVerified ? 'verified' : 'pending',
      phone: phoneVerified ? 'verified' : 'pending',
    },
    documents: [],
    overduePayments: 0,
    disputesInvolved: 0,
    trustScore,
  };
};

const GlobalUserManagement = () => {
  const [users, setUsers] = useState<GlobalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<GlobalUser | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        const apiUsers = await adminService.getAllUsersPaginated();
        setUsers(apiUsers.map(mapApiUserToGlobalUser));
      } catch {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleViewDetails = (user: GlobalUser) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedUser(null);
  };

  const getRoleStats = () => {
    return {
      all: users.length,
      farmer: users.filter((u) => u.role === 'farmer').length,
      investor: users.filter((u) => u.role === 'investor').length,
      landowner: users.filter((u) => u.role === 'landowner').length,
    };
  };

  const roleStats = getRoleStats();

  return (
    <DashboardLayout>
      <Card sx={{ mb: 3 }}>
        <CardHeaderWithIcon icon={Person} title="Global User Management" />
        <CardContent>
          {/* Filters and Search */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search by name, email, or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Tabs
                  value={roleFilter}
                  onChange={(_, newValue) => setRoleFilter(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label={`All (${roleStats.all})`} value="all" />
                  <Tab label={`Farmers (${roleStats.farmer})`} value="farmer" />
                  <Tab label={`Investors (${roleStats.investor})`} value="investor" />
                  <Tab label={`Land Owners (${roleStats.landowner})`} value="landowner" />
                </Tabs>
              </Grid>
            </Grid>
          </Box>

          {/* Users Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Verification</TableCell>
                  <TableCell align="center">Trust Score</TableCell>
                  <TableCell align="center">Projects</TableCell>
                  <TableCell align="center">Transactions</TableCell>
                  <TableCell align="right">Total Value</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="center">Alerts</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={user.avatar} alt={user.fullName} />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        <Tooltip title={`Identity: ${user.verificationStatus.identity}`}>
                          {getVerificationIcon(user.verificationStatus.identity)}
                        </Tooltip>
                        <Tooltip title={`Email: ${user.verificationStatus.email}`}>
                          {getVerificationIcon(user.verificationStatus.email)}
                        </Tooltip>
                        <Tooltip title={`Phone: ${user.verificationStatus.phone}`}>
                          {getVerificationIcon(user.verificationStatus.phone)}
                        </Tooltip>
                        {user.verificationStatus.bankAccount && (
                          <Tooltip title={`Bank: ${user.verificationStatus.bankAccount}`}>
                            {getVerificationIcon(user.verificationStatus.bankAccount)}
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.trustScore}
                        size="small"
                        color={getTrustScoreColor(user.trustScore) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {user.activeProjects}/{user.totalProjects}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        active/total
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {user.totalTransactions}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {user.totalInvested
                          ? formatCurrency(user.totalInvested)
                          : user.totalEarnings
                          ? formatCurrency(user.totalEarnings)
                          : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(user.lastLogin)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        {user.overduePayments > 0 && (
                          <Tooltip title={`${user.overduePayments} overdue payment(s)`}>
                            <Chip
                              label={user.overduePayments}
                              size="small"
                              color="error"
                              icon={<Warning />}
                            />
                          </Tooltip>
                        )}
                        {user.disputesInvolved > 0 && (
                          <Tooltip title={`${user.disputesInvolved} dispute(s)`}>
                            <Chip
                              label={user.disputesInvolved}
                              size="small"
                              color="warning"
                              icon={<Error />}
                            />
                          </Tooltip>
                        )}
                        {user.overduePayments === 0 && user.disputesInvolved === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            None
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetails(user)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {loading && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Loading users...
              </Typography>
            </Box>
          )}

          {error && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            </Box>
          )}

          {filteredUsers.length === 0 && !loading && !error && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No users found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedUser.avatar} sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography variant="h6">{selectedUser.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.id} • {selectedUser.role}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Contact Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Contact Information
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">Email: {selectedUser.email}</Typography>
                    <Typography variant="body2">Phone: {selectedUser.phoneNumber}</Typography>
                    <Typography variant="body2">Address: {selectedUser.address}</Typography>
                  </Box>
                </Grid>

                {/* Account Status */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Account Status
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Registered: {formatDate(selectedUser.registrationDate)}
                    </Typography>
                    <Typography variant="body2">
                      Last Login: {formatDateTime(selectedUser.lastLogin)}
                    </Typography>
                    <Typography variant="body2">
                      Status: {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Typography>
                    <Typography variant="body2">
                      Trust Score: <Chip label={selectedUser.trustScore} size="small" color={getTrustScoreColor(selectedUser.trustScore) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"} />
                    </Typography>
                  </Box>
                </Grid>

                {/* Activity Metrics */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Activity Metrics
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Total Projects: {selectedUser.totalProjects}
                    </Typography>
                    <Typography variant="body2">
                      Active Projects: {selectedUser.activeProjects}
                    </Typography>
                    <Typography variant="body2">
                      Completed: {selectedUser.completedProjects}
                    </Typography>
                    <Typography variant="body2">
                      Transactions: {selectedUser.totalTransactions}
                    </Typography>
                  </Box>
                </Grid>

                {/* Financial Summary */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Financial Summary
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {selectedUser.totalInvested && (
                      <Typography variant="body2">
                        Total Invested: {formatCurrency(selectedUser.totalInvested)}
                      </Typography>
                    )}
                    {selectedUser.totalEarnings && (
                      <Typography variant="body2">
                        Total Earnings: {formatCurrency(selectedUser.totalEarnings)}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      Overdue Payments: {selectedUser.overduePayments}
                    </Typography>
                  </Box>
                </Grid>

                {/* Verification Status */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Verification Status
                  </Typography>
                  <Box sx={{ pl: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Identity: ${selectedUser.verificationStatus.identity}`}
                      size="small"
                      icon={getVerificationIcon(selectedUser.verificationStatus.identity)!}
                    />
                    <Chip
                      label={`Email: ${selectedUser.verificationStatus.email}`}
                      size="small"
                      icon={getVerificationIcon(selectedUser.verificationStatus.email)!}
                    />
                    <Chip
                      label={`Phone: ${selectedUser.verificationStatus.phone}`}
                      size="small"
                      icon={getVerificationIcon(selectedUser.verificationStatus.phone)!}
                    />
                    {selectedUser.verificationStatus.bankAccount && (
                      <Chip
                        label={`Bank: ${selectedUser.verificationStatus.bankAccount}`}
                        size="small"
                        icon={getVerificationIcon(selectedUser.verificationStatus.bankAccount)!}
                      />
                    )}
                  </Box>
                </Grid>

                {/* Risk Indicators */}
                {(selectedUser.overduePayments > 0 || selectedUser.disputesInvolved > 0) && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom color="error">
                      Risk Indicators
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {selectedUser.overduePayments > 0 && (
                        <Chip
                          label={`${selectedUser.overduePayments} Overdue Payment(s)`}
                          size="small"
                          color="error"
                          icon={<Warning />}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      )}
                      {selectedUser.disputesInvolved > 0 && (
                        <Chip
                          label={`${selectedUser.disputesInvolved} Dispute(s)`}
                          size="small"
                          color="warning"
                          icon={<Error />}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" color="primary">
                View Full Profile
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default GlobalUserManagement;
