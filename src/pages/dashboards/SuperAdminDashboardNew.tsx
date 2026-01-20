import { SriLankaMap } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import { adminService, type ApiUser } from '@/services/admin.service';
import {
  AccessTime,
  Agriculture,
  Assessment,
  AssignmentOutlined,
  BarChartOutlined,
  Business,
  CheckCircle,
  GroupOutlined,
  Landscape,
  MapOutlined,
  People,
  PersonAdd,
  RefreshOutlined,
  TrendingDown,
  TrendingUp,
  Verified,
  Warning
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
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
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const SuperAdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    farmers: 0,
    investors: 0,
    landowners: 0,
    verified: 0,
    unverified: 0,
  });
  const [provinceDistribution, setProvinceDistribution] = useState<{
    [province: string]: {
      farmers: number;
      investors: number;
      landowners: number;
      total: number;
    };
  }>({});
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [usersResponse, stats, provinceData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getUserStats(),
        adminService.getProvinceDistribution(),
      ]);

      setUsers(usersResponse.data);
      setUserStats(stats);
      setProvinceDistribution(provinceData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(message);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculateGrowth = () => {
    return {
      users: 12.5,
      farmers: 15.3,
      investors: 8.7,
      landowners: 10.2,
    };
  };

  const growth = calculateGrowth();

  const ModernStatCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    growth,
    trend = 'up',
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    growth?: number;
    trend?: 'up' | 'down';
  }) => (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${color}20`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: color,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color, mt: 1, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {growth !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend === 'up' ? (
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: trend === 'up' ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {growth}% vs last month
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            height: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 3 }}>
              Loading Dashboard...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Fetching real-time data from the platform
            </Typography>
          </Box>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Super Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Platform-wide insights and analytics • Last updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshOutlined />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ModernStatCard
              title="Total Users"
              value={userStats.totalUsers}
              subtitle="Active platform users"
              icon={<GroupOutlined sx={{ fontSize: 32 }} />}
              color="#2196F3"
              growth={growth.users}
              trend="up"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ModernStatCard
              title="Farmers"
              value={userStats.farmers}
              subtitle="Cultivators registered"
              icon={<Agriculture sx={{ fontSize: 32 }} />}
              color="#4CAF50"
              growth={growth.farmers}
              trend="up"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ModernStatCard
              title="Investors"
              value={userStats.investors}
              subtitle="Active investors"
              icon={<Business sx={{ fontSize: 32 }} />}
              color="#FF9800"
              growth={growth.investors}
              trend="up"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ModernStatCard
              title="Landowners"
              value={userStats.landowners}
              subtitle="Property owners"
              icon={<Landscape sx={{ fontSize: 32 }} />}
              color="#9C27B0"
              growth={growth.landowners}
              trend="up"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                      Verified Users
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {userStats.verified}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                      {((userStats.verified / userStats.totalUsers) * 100).toFixed(1)}% of total users
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: 64, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                      Pending Verification
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {userStats.unverified}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                      {((userStats.unverified / userStats.totalUsers) * 100).toFixed(1)}% need attention
                    </Typography>
                  </Box>
                  <AccessTime sx={{ fontSize: 64, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="dashboard tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<MapOutlined />} iconPosition="start" label="Geographic Distribution" />
              <Tab icon={<BarChartOutlined />} iconPosition="start" label="User Analytics" />
              <Tab icon={<AssignmentOutlined />} iconPosition="start" label="Recent Activity" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Distribution Across Sri Lanka
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Interactive map showing user concentration by province
              </Typography>
              <SriLankaMap provinceDistribution={provinceDistribution} />
            </CardContent>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Role Distribution
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Agriculture sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {userStats.farmers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Farmers
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(userStats.farmers / userStats.totalUsers) * 100}
                      sx={{ mt: 2, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {((userStats.farmers / userStats.totalUsers) * 100).toFixed(1)}% of total
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Business sx={{ fontSize: 48, color: '#FF9800', mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {userStats.investors}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Investors
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(userStats.investors / userStats.totalUsers) * 100}
                      sx={{ mt: 2, height: 8, borderRadius: 4 }}
                      color="warning"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {((userStats.investors / userStats.totalUsers) * 100).toFixed(1)}% of total
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Landscape sx={{ fontSize: 48, color: '#9C27B0', mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {userStats.landowners}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Landowners
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(userStats.landowners / userStats.totalUsers) * 100}
                      sx={{ mt: 2, height: 8, borderRadius: 4 }}
                      color="secondary"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {((userStats.landowners / userStats.totalUsers) * 100).toFixed(1)}% of total
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Verification Status Chart */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Verification Status
                </Typography>
                <Paper sx={{ p: 3, mt: 2 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">Verified</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(userStats.verified / userStats.totalUsers) * 100}
                            sx={{ mt: 1, height: 10, borderRadius: 5 }}
                            color="success"
                          />
                        </Box>
                        <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                          {userStats.verified}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Warning sx={{ color: 'warning.main', mr: 2 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">Unverified</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(userStats.unverified / userStats.totalUsers) * 100}
                            sx={{ mt: 1, height: 10, borderRadius: 5 }}
                            color="warning"
                          />
                        </Box>
                        <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                          {userStats.unverified}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </CardContent>
          </TabPanel>

          {/* Tab 3: Recent Activity */}
          <TabPanel value={tabValue} index={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent User Registrations
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.slice(0, 10).map((user) => {
                      // Map role ID to name
                      const roleMap: { [key: string]: { name: string; color: string; icon?: React.ReactElement } } = {
                        '696e40fda4f896e9f40c8b93': { name: 'Farmer', color: '#4CAF50', icon: <Agriculture sx={{ fontSize: 16 }} /> },
                        '696e6163b558abe269548099': { name: 'Investor', color: '#FF9800', icon: <Business sx={{ fontSize: 16 }} /> },
                        '696e616db558abe26954809c': { name: 'Landowner', color: '#9C27B0', icon: <Landscape sx={{ fontSize: 16 }} /> },
                        '696f008a3e12fb6fd9ed945b': { name: 'Super Admin', color: '#F44336', icon: <Verified sx={{ fontSize: 16 }} /> },
                      };

                      const roleInfo = roleMap[user.role] || { name: 'Unknown', color: '#757575', icon: <People sx={{ fontSize: 16 }} /> };

                      return (
                        <TableRow key={user._id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 40, height: 40, bgcolor: roleInfo.color }}>
                                {user.firstName[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {user.fullName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {user.phoneNumber}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              icon={roleInfo.icon}
                              label={roleInfo.name}
                              size="small"
                              sx={{
                                bgcolor: `${roleInfo.color}20`,
                                color: roleInfo.color,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>{user.address}</TableCell>
                          <TableCell>
                            {user.emailVerified ? (
                              <Chip
                                icon={<CheckCircle sx={{ fontSize: 16 }} />}
                                label="Verified"
                                size="small"
                                color="success"
                              />
                            ) : (
                              <Chip
                                icon={<Warning sx={{ fontSize: 16 }} />}
                                label="Pending"
                                size="small"
                                color="warning"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </TabPanel>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PersonAdd />}
                  sx={{ py: 1.5 }}
                >
                  Add New User
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Assessment />}
                  sx={{ py: 1.5 }}
                >
                  Generate Report
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Verified />}
                  sx={{ py: 1.5 }}
                >
                  Verify Users
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BarChartOutlined />}
                  sx={{ py: 1.5 }}
                >
                  View Analytics
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
