import DashboardLayout from '@/layouts/DashboardLayout';
import {
    AttachMoney,
    BarChart as BarChartIcon,
    Cloud,
    Home,
    LocationOn,
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Typography,
} from '@mui/material';

const LandOwnerDashboard = () => {
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
                <Home sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Properties Listed
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  8
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
                <LocationOn sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Allocated to Deals
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  5
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
                <AttachMoney sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Monthly Income
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  $8.5K
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Widgets */}
      <div className="row g-3">
        {/* Property Status */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Home />
                  <Typography variant="h6" component="span">
                    Property Status
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
                  🏡 Land Allocation Overview
                </Typography>
                <Typography variant="body2">
                  Properties allocated to deals vs. available land
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Income Tracker */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney />
                  <Typography variant="h6" component="span">
                    Income / Rental Tracker
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
                  💵 Rental & Profit-Share Earnings
                </Typography>
                <Typography variant="body2">
                  Monthly income breakdown by property
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Soil & Weather */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Cloud />
                  <Typography variant="h6" component="span">
                    Soil & Weather Insights
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
                  🌦️ Regional Weather & Soil Status
                </Typography>
                <Typography variant="body2">
                  Soil type, water availability, and weather forecasts
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Land Analysis */}
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChartIcon />
                  <Typography variant="h6" component="span">
                    AI Land Analysis
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
                  🤖 Best Crop Recommendations
                </Typography>
                <Typography variant="body2">
                  AI suggestions for best matching farmers and optimal crops
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LandOwnerDashboard;
