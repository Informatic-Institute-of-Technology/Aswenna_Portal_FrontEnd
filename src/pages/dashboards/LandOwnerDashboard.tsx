import { CardHeaderWithIcon, PlaceholderWidget, StatCard } from "@/components";
import {
  AttachMoney,
  BarChart as BarChartIcon,
  CheckCircle,
  Cloud,
  Home,
  PlusOne,
} from "@mui/icons-material";
import { Card, CardContent, Chip } from "@mui/material";

const LandOwnerDashboard = () => {
  return (
    <>
      <div className="row g-3" style={{ marginBottom: "1.5rem" }}>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={CheckCircle}
            iconBgColor="var(--color-olive-muted-strong)"
            iconColor="primary.main"
            label="Completed Projects"
            value={10}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={PlusOne}
            iconBgColor="var(--color-info-blue-muted)"
            iconColor="var(--color-info-blue)"
            label="New requests"
            value={5}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={AttachMoney}
            iconBgColor="var(--color-amber-muted)"
            iconColor="var(--color-amber)"
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
            <CardHeaderWithIcon
              icon={AttachMoney}
              title="Income / Rental Tracker"
            />
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
    </>
  );
};

export default LandOwnerDashboard;
