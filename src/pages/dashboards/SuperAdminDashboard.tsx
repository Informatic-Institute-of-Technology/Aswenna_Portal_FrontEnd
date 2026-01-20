import {
    CardHeaderWithIcon,
    StatCard,
} from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    AccountBalance,
    Assessment,
    AttachMoney,
    Gavel,
    People,
    TrendingUp,
    Warning,
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const platformStats = {
  totalUsers: 2847,
  farmers: 1523,
  investors: 892,
  landowners: 432,
  totalLandArea: '12,458 Acres',
  totalInvestment: '$8.5M',
  platformRevenue: '$127K',
  pendingPayouts: '$45K',
  lockedFunds: '$2.3M',
};

const projectStatusData = [
  { name: 'Negotiation', value: 45, color: '#FF9800' },
  { name: 'Active', value: 127, color: '#4CAF50' },
  { name: 'Completed', value: 89, color: '#2196F3' },
  { name: 'Disputed', value: 8, color: '#f44336' },
];

const recentActivities = [
  { id: 1, user: 'John Farmer', action: 'Uploaded land deed', time: '5 mins ago', type: 'document' },
  { id: 2, user: 'Sarah Investor', action: 'Funded Project #1245', amount: '$25,000', time: '12 mins ago', type: 'payment' },
  { id: 3, user: 'Mike Landowner', action: 'Listed new property', time: '23 mins ago', type: 'listing' },
  { id: 4, user: 'Emma Farmer', action: 'Disputed milestone #3', time: '1 hour ago', type: 'dispute' },
  { id: 5, user: 'David Investor', action: 'Requested verification', time: '2 hours ago', type: 'verification' },
];

const criticalAlerts = [
  { id: 1, message: '8 Projects in Dispute - Require immediate attention', severity: 'error' },
  { id: 2, message: '23 Verification requests pending approval', severity: 'warning' },
  { id: 3, message: '12 Milestone deadlines approaching in next 48 hours', severity: 'info' },
];

const SuperAdminDashboard = () => {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        {criticalAlerts.map((alert) => (
          <Paper
            key={alert.id}
            sx={{
              p: 2,
              mb: 1,
              backgroundColor:
                alert.severity === 'error'
                  ? 'rgba(244, 67, 54, 0.1)'
                  : alert.severity === 'warning'
                  ? 'rgba(255, 152, 0, 0.1)'
                  : 'rgba(33, 150, 243, 0.1)',
              borderLeft: 4,
              borderColor:
                alert.severity === 'error'
                  ? '#f44336'
                  : alert.severity === 'warning'
                  ? '#FF9800'
                  : '#2196F3',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning
                sx={{
                  color:
                    alert.severity === 'error'
                      ? '#f44336'
                      : alert.severity === 'warning'
                      ? '#FF9800'
                      : '#2196F3',
                }}
              />
              <Typography variant="body1">{alert.message}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Platform Health Metrics */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Platform Health Metrics
      </Typography>
      <div className="row g-3" style={{ marginBottom: '1.5rem' }}>
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            icon={People}
            iconBgColor="rgba(107, 142, 35, 0.2)"
            iconColor="primary.main"
            label="Total Active Users"
            value={platformStats.totalUsers.toLocaleString()}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            icon={TrendingUp}
            iconBgColor="rgba(59, 130, 246, 0.2)"
            iconColor="#3b82f6"
            label="Total Land Cultivated"
            value={platformStats.totalLandArea}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            icon={AttachMoney}
            iconBgColor="rgba(76, 175, 80, 0.2)"
            iconColor="#4CAF50"
            label="Total Investment Volume"
            value={platformStats.totalInvestment}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <StatCard
            icon={Assessment}
            iconBgColor="rgba(156, 39, 176, 0.2)"
            iconColor="#9C27B0"
            label="Platform Revenue"
            value={platformStats.platformRevenue}
          />
        </div>
      </div>

      {/* User Breakdown */}
      <div className="row g-3" style={{ marginBottom: '1.5rem' }}>
        <div className="col-12 col-md-4">
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Farmers
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#6B8E23' }}>
                  {platformStats.farmers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {((platformStats.farmers / platformStats.totalUsers) * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(platformStats.farmers / platformStats.totalUsers) * 100}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Investors
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                  {platformStats.investors.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {((platformStats.investors / platformStats.totalUsers) * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(platformStats.investors / platformStats.totalUsers) * 100}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Land Owners
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF9800' }}>
                  {platformStats.landowners.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {((platformStats.landowners / platformStats.totalUsers) * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(platformStats.landowners / platformStats.totalUsers) * 100}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Financial Snapshot & Project Status */}
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={AccountBalance}
              title="Financial Snapshot"
              action={<Chip label="Real-time" size="small" color="success" />}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">Platform Revenue (Commission)</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                    {platformStats.platformRevenue}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">Pending Payouts</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF9800' }}>
                    {platformStats.pendingPayouts}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">Locked Funds (Escrow)</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196F3' }}>
                    {platformStats.lockedFunds}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={Gavel}
              title="Project Status Breakdown"
              action={
                <Chip
                  label={`${projectStatusData.reduce((sum, item) => sum + item.value, 0)} Total`}
                  size="small"
                  color="primary"
                />
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Platform Activities */}
        <div className="col-12">
          <Card>
            <CardHeaderWithIcon
              icon={Assessment}
              title="Recent Platform Activities"
              action={<Chip label="Live Feed" size="small" color="primary" />}
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {activity.user}
                          </Typography>
                        </TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>
                          {activity.amount && (
                            <Chip label={activity.amount} size="small" color="success" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={activity.type}
                            size="small"
                            color={
                              activity.type === 'dispute'
                                ? 'error'
                                : activity.type === 'payment'
                                ? 'success'
                                : 'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
