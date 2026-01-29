import {
    CardHeaderWithIcon,
    PlaceholderWidget,
    StatCard,
} from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    AttachMoney,
    BarChart as BarChartIcon,
    Cloud,
    Home,
    LocationOn,
} from '@mui/icons-material';
import { Card, CardContent, Chip } from '@mui/material';

const LandOwnerDashboard = () => {
  return (
    <DashboardLayout>
      <div className="row g-3" style={{ marginBottom: '1.5rem' }}>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={Home}
            iconBgColor="rgba(107, 142, 35, 0.2)"
            iconColor="primary.main"
            label="Properties Listed"
            value={8}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={LocationOn}
            iconBgColor="rgba(59, 130, 246, 0.2)"
            iconColor="#3b82f6"
            label="Allocated to Deals"
            value={5}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={AttachMoney}
            iconBgColor="rgba(251, 191, 36, 0.2)"
            iconColor="#fbbf24"
            label="Monthly Income"
            value="$8.5K"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon icon={Home} title="Property Status" />
            <CardContent>
              <PlaceholderWidget
                icon="🏡"
                title="Land Allocation Overview"
                description="Properties allocated to deals vs. available land"
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon icon={AttachMoney} title="Income / Rental Tracker" />
            <CardContent>
              <PlaceholderWidget
                icon="💵"
                title="Rental & Profit-Share Earnings"
                description="Monthly income breakdown by property"
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={Cloud}
              title="Soil & Weather Insights"
              action={<Chip label="Live" size="small" color="primary" />}
            />
            <CardContent>
              <PlaceholderWidget
                icon="🌦️"
                title="Regional Weather & Soil Status"
                description="Soil type, water availability, and weather forecasts"
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon icon={BarChartIcon} title="AI Land Analysis" />
            <CardContent>
              <PlaceholderWidget
                icon="🤖"
                title="Best Crop Recommendations"
                description="AI suggestions for best matching farmers and optimal crops"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LandOwnerDashboard;
