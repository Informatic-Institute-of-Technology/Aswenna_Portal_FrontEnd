import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import { adminService, type ApiUser } from '@/services/admin.service';
import type { GlobalUser } from '@/types/admin.types';
import {
  CheckCircle,
  Close,
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
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

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

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <DashboardLayout>
      <Card sx={{ mb: 3 }}>
        <CardHeaderWithIcon icon={Person} title="Global User Management" />
        <CardContent>
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
                {paginatedUsers.map((user) => (
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

          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            sx={{ borderTop: 1, borderColor: 'divider' }}
          />

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

      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        {selectedUser && (
          <>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                p: 3,
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
                <Avatar
                  src={selectedUser.avatar}
                  sx={{
                    width: 70,
                    height: 70,
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                    {selectedUser.fullName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                      {selectedUser.id}
                    </Typography>
                    <Chip
                      label={selectedUser.role}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                  </Box>
                </Box>
                <IconButton
                  onClick={handleCloseDialog}
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            </Box>



            <DialogContent sx={{ p: 0, bgcolor: 'transparent' }}>
              {/* Stats Row - Instagram/Facebook style */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-around',
                p: 3,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                bgcolor: 'rgba(255,255,255,0.02)',
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                    {selectedUser.totalProjects}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Projects
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                    {selectedUser.activeProjects}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Active
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                    {selectedUser.completedProjects}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Completed
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip
                    label={selectedUser.trustScore}
                    size="small"
                    color={getTrustScoreColor(selectedUser.trustScore) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                    sx={{ fontWeight: 700, fontSize: '1rem', height: 32, minWidth: 50 }}
                  />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mt: 0.5 }}>
                    Trust Score
                  </Typography>
                </Box>
              </Box>

              {/* About Section */}
              <Box sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white', mb: 2, letterSpacing: 0.5 }}>
                  ABOUT
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Email
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {selectedUser.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Phone
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {selectedUser.phoneNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Address
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {selectedUser.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Joined
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {formatDate(selectedUser.registrationDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Last Active
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {formatDateTime(selectedUser.lastLogin)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Status
                      </Typography>
                    </Box>
                    <Chip
                      label={selectedUser.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={selectedUser.isActive ? 'success' : 'error'}
                      sx={{ fontWeight: 600, height: 24 }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Verification Section */}
              <Box sx={{ px: 3, pb: 3, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white', mb: 2, letterSpacing: 0.5 }}>
                  VERIFICATION
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Identity: ${selectedUser.verificationStatus.identity}`}
                    size="small"
                    icon={getVerificationIcon(selectedUser.verificationStatus.identity)!}
                    sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                  />
                  <Chip
                    label={`Email: ${selectedUser.verificationStatus.email}`}
                    size="small"
                    icon={getVerificationIcon(selectedUser.verificationStatus.email)!}
                    color={selectedUser.verificationStatus.email === 'verified' ? 'success' : 'warning'}
                  />
                  <Chip
                    label={`Phone: ${selectedUser.verificationStatus.phone}`}
                    size="small"
                    icon={getVerificationIcon(selectedUser.verificationStatus.phone)!}
                    color={selectedUser.verificationStatus.phone === 'verified' ? 'success' : 'warning'}
                  />
                  {selectedUser.verificationStatus.bankAccount && (
                    <Chip
                      label={`Bank: ${selectedUser.verificationStatus.bankAccount}`}
                      size="small"
                      icon={getVerificationIcon(selectedUser.verificationStatus.bankAccount)!}
                      sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                    />
                  )}
                </Box>
              </Box>

              {/* Financial Section */}
              {(selectedUser.totalInvested || selectedUser.totalEarnings || selectedUser.overduePayments > 0) && (
                <Box sx={{ px: 3, pb: 3, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white', mb: 2, letterSpacing: 0.5 }}>
                    FINANCIALS
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selectedUser.totalInvested && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Total Invested
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                          {formatCurrency(selectedUser.totalInvested)}
                        </Typography>
                      </Box>
                    )}
                    {selectedUser.totalEarnings && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Total Earnings
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                          {formatCurrency(selectedUser.totalEarnings)}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Overdue Payments
                      </Typography>
                      <Typography variant="body2" sx={{ color: selectedUser.overduePayments > 0 ? '#f44336' : 'white', fontWeight: 600 }}>
                        {selectedUser.overduePayments}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Transactions
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        {selectedUser.totalTransactions}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Risk Indicators Section */}
              {(selectedUser.overduePayments > 0 || selectedUser.disputesInvolved > 0) && (
                <Box sx={{
                  px: 3,
                  pb: 3,
                  borderTop: '1px solid rgba(244, 67, 54, 0.3)',
                  pt: 3,
                  bgcolor: 'rgba(244, 67, 54, 0.05)',
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f44336', mb: 2, letterSpacing: 0.5 }}>
                    ⚠️ ALERTS
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedUser.overduePayments > 0 && (
                      <Chip
                        label={`${selectedUser.overduePayments} Overdue Payment(s)`}
                        size="small"
                        color="error"
                        icon={<Warning />}
                      />
                    )}
                    {selectedUser.disputesInvolved > 0 && (
                      <Chip
                        label={`${selectedUser.disputesInvolved} Dispute(s)`}
                        size="small"
                        color="warning"
                        icon={<Error />}
                      />
                    )}
                  </Box>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default GlobalUserManagement;
