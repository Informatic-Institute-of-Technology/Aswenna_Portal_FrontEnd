import {
    CardHeaderWithIcon,
    PlaceholderWidget,
    StatCard,
} from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    AccountBalance,
    Assignment,
    AttachMoney,
    BarChart as BarChartIcon,
    LocalShipping,
    Payment,
    People,
    Percent,
    ShoppingCart,
    TrendingUp,
} from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Divider, LinearProgress, Typography } from '@mui/material';

const InvestorDashboard = () => {
  // Mock data - would come from API in real app
  const stats = {
    // Direct Harvest Stats
    activeHarvestOrders: 3,
    totalHarvestBudget: 180000,
    pendingDeliveries: 2,
    
    // Sponsorship Stats
    activeSponsorships: 5,
    totalSponsorshipInvested: 850000,
    expectedCommissions: 127500,
    earnedCommissions: 45000,
    
    // Overall Stats
    totalActiveInvestments: 8,
    pendingApplications: 24,
    
    // Payments
    upcomingPayments: 6,
    overduePayments: 0,
  };

  return (
    <DashboardLayout>
      {/* Overview Stats Row 1 - Investment Summary */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCart /> Investment Overview
        </Typography>
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              icon={ShoppingCart}
              iconBgColor="rgba(255, 152, 0, 0.2)"
              iconColor="#FF9800"
              label="Harvest Orders"
              value={stats.activeHarvestOrders}
              subValue={`LKR ${stats.totalHarvestBudget.toLocaleString()}`}
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              icon={AccountBalance}
              iconBgColor="rgba(33, 150, 243, 0.2)"
              iconColor="#2196F3"
              label="Active Sponsorships"
              value={stats.activeSponsorships}
              subValue={`LKR ${stats.totalSponsorshipInvested.toLocaleString()}`}
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              icon={People}
              iconBgColor="rgba(107, 142, 35, 0.2)"
              iconColor="primary.main"
              label="Pending Applications"
              value={stats.pendingApplications}
              subValue="From farmers"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              icon={AttachMoney}
              iconBgColor="rgba(76, 175, 80, 0.2)"
              iconColor="#4caf50"
              label="Total Invested"
              value={`LKR ${(stats.totalHarvestBudget + stats.totalSponsorshipInvested).toLocaleString()}`}
              subValue={`${stats.totalActiveInvestments} active projects`}
            />
          </div>
        </div>
      </Box>

      {/* Overview Stats Row 2 - Returns & Payments */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp /> Returns & Payments
        </Typography>
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              icon={LocalShipping}
              iconBgColor="rgba(255, 152, 0, 0.2)"
              iconColor="#FF9800"
              label="Pending Deliveries"
              value={stats.pendingDeliveries}
              subValue="Harvest orders"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              icon={TrendingUp}
              iconBgColor="rgba(33, 150, 243, 0.2)"
              iconColor="#2196F3"
              label="Expected Commission"
              value={`LKR ${stats.expectedCommissions.toLocaleString()}`}
              subValue="From sponsorships"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              icon={Percent}
              iconBgColor="rgba(76, 175, 80, 0.2)"
              iconColor="#4caf50"
              label="Earned Commission"
              value={`LKR ${stats.earnedCommissions.toLocaleString()}`}
              subValue={`${((stats.earnedCommissions / stats.expectedCommissions) * 100).toFixed(1)}% of expected`}
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              icon={Payment}
              iconBgColor={stats.overduePayments > 0 ? "rgba(244, 67, 54, 0.2)" : "rgba(107, 142, 35, 0.2)"}
              iconColor={stats.overduePayments > 0 ? "#f44336" : "primary.main"}
              label="Upcoming Payments"
              value={stats.upcomingPayments}
              subValue={stats.overduePayments > 0 ? `${stats.overduePayments} overdue` : "All on track"}
            />
          </div>
        </div>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Detailed Cards */}
      <div className="row g-3">
        {/* Direct Harvest Orders Overview */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={ShoppingCart}
              title="Direct Harvest Orders"
              action={
                <Chip 
                  label={`${stats.activeHarvestOrders} Active`} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(255, 152, 0, 0.2)', 
                    color: '#FF9800',
                    fontWeight: 600
                  }} 
                />
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Product orders with specific quantity and delivery deadlines
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Sample Order 1 */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(255, 152, 0, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 152, 0, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      100 KG Tomatoes
                    </Typography>
                    <Chip label="Active" size="small" color="success" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    ABC Sauce Company • Delivery: Mar 15, 2026
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Payment Progress</Typography>
                      <Typography variant="caption" fontWeight={600}>1/2 Paid</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={50} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 1,
                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#FF9800'
                        }
                      }} 
                    />
                  </Box>
                </Box>

                {/* Sample Order 2 */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(255, 152, 0, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 152, 0, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      500 KG Rice
                    </Typography>
                    <Chip label="Pending" size="small" color="warning" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Delivery: Jun 30, 2026 • 8 Applications
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: '#FF9800' }}>
                    Awaiting farmer selection
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Sponsorship Programs Overview */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={AccountBalance}
              title="Sponsorship Programs"
              action={
                <Chip 
                  label={`${stats.activeSponsorships} Active`} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(33, 150, 243, 0.2)', 
                    color: '#2196F3',
                    fontWeight: 600
                  }} 
                />
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Support farmers and earn commission on their harvest
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Sample Sponsorship 1 */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(33, 150, 243, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(33, 150, 243, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Organic Farming 2026
                    </Typography>
                    <Chip label="Active" size="small" color="success" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Mixed Vegetables • 15% Commission
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Invested</Typography>
                      <Typography variant="body2" fontWeight={600}>LKR 300,000</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Expected Return</Typography>
                      <Typography variant="body2" fontWeight={600} color="#2196F3">
                        LKR 75,000
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Sample Sponsorship 2 */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(33, 150, 243, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(33, 150, 243, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Tea Plantation Growth
                    </Typography>
                    <Chip label="Pending" size="small" color="warning" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Tea • 12% Commission • 6 Applications
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: '#2196F3' }}>
                    Reviewing farmer applications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Profitability Analysis */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={BarChartIcon}
              title="Profitability Analysis"
              action={<Chip label="Live" size="small" color="primary" />}
            />
            <CardContent>
              <PlaceholderWidget
                icon="📊"
                title="Investment Performance Metrics"
                description="ROI tracking, harvest forecasts, and commission earnings analysis"
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={Assignment}
              title="Recent Applications"
              action={<Chip label={`${stats.pendingApplications} Pending`} size="small" color="primary" />}
            />
            <CardContent>
              <PlaceholderWidget
                icon="📝"
                title="Farmer & Land Owner Applications"
                description="Review applications for your harvest orders and sponsorship programs"
              />
            </CardContent>
          </Card>
        </div>

        {/* Payment Schedule */}
        <div className="col-12">
          <Card>
            <CardHeaderWithIcon
              icon={Payment}
              title="Upcoming Payment Schedule"
              action={
                <Chip 
                  label={`${stats.upcomingPayments} Payments Due`} 
                  size="small" 
                  color={stats.overduePayments > 0 ? "error" : "primary"}
                />
              }
            />
            <CardContent>
              <PlaceholderWidget
                icon="💳"
                title="Installment Payment Tracker"
                description="Track all payment milestones across your harvest orders and sponsorships"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard;
