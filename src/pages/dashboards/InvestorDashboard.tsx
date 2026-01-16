import DashboardLayout from '@/layouts/DashboardLayout';
import {
    AttachMoney,
    BarChart as BarChartIcon,
    Description,
    People,
    TrendingUp,
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Typography,
} from '@mui/material';

const InvestorDashboard = () => {
  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <div className="row g-3" style={{ marginBottom: '1.5rem' }}>
        <div className="col-12 col-sm-6 col-md-4">
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(107, 142, 35, 0.2)',
                  color: 'primary.main',
                }}
              >
                <AttachMoney sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Active Investments
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  $125K
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                }}
              >
                <People sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pending Applications
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  18
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(251, 191, 36, 0.2)',
                  color: '#fbbf24',
                }}
              >
                <TrendingUp sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Expected ROI
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  24%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Widgets */}
      <div className="row g-3">
        {/* Profitability Charts */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChartIcon />
                  <Typography variant="h6" component="span">
                    Profitability Charts
                  </Typography>
                </Box>
              }
              action={<Chip label="Live" size="small" color="primary" />}
            />
            <CardContent>
              <Box
                sx={{
                  backgroundColor: 'rgba(107, 142, 35, 0.05)',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 6,
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  📊 Historical Price Charts & Predictions
                </Typography>
                <Typography variant="body2">
                  Upcoming season price forecasts and profitability analysis
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Investment Portfolio */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney />
                  <Typography variant="h6" component="span">
                    Investment Portfolio
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <Box
                sx={{
                  backgroundColor: 'rgba(107, 142, 35, 0.05)',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 6,
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  💰 Total Investment Value Deployed
                </Typography>
                <Typography variant="body2">
                  Portfolio breakdown by crop type and region
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* ROI Analysis */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp />
                  <Typography variant="h6" component="span">
                    ROI & Market Analysis
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <Box
                sx={{
                  backgroundColor: 'rgba(107, 142, 35, 0.05)',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 6,
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  📈 AI-Powered Crop Profitability Forecasts
                </Typography>
                <Typography variant="body2">
                  Risk alerts and market opportunity indicators
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Application Status */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description />
                  <Typography variant="h6" component="span">
                    Recent Applications
                  </Typography>
                </Box>
              }
              action={<Chip label="18 Pending" size="small" color="primary" />}
            />
            <CardContent>
              <Box
                sx={{
                  backgroundColor: 'rgba(107, 142, 35, 0.05)',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 6,
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  📝 Farmers Awaiting Approval
                </Typography>
                <Typography variant="body2">
                  Review and manage investment applications
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard;
