import { CardHeaderWithIcon, PlaceholderWidget, StatCard } from "@/components";
import {
  AttachMoney,
  BarChart as BarChartIcon,
  Description,
  People,
  TrendingUp,
} from "@mui/icons-material";
import { Card, CardContent, Chip } from "@mui/material";

const InvestorDashboard = () => {
  return (
    <>
      <div className="row g-3" style={{ marginBottom: "1.5rem" }}>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={AttachMoney}
            iconBgColor="var(--color-olive-muted-strong)"
            iconColor="primary.main"
            label="Active Investments"
            value="$125K"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={People}
            iconBgColor="var(--color-info-blue-muted)"
            iconColor="var(--color-info-blue)"
            label="Pending Applications"
            value={18}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            icon={TrendingUp}
            iconBgColor="var(--color-amber-muted)"
            iconColor="var(--color-amber)"
            label="Expected ROI"
            value="24%"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={BarChartIcon}
              title="Profitability Charts"
              action={<Chip label="Live" size="small" color="primary" />}
            />
            <CardContent>
              <PlaceholderWidget
                icon="📊"
                title="Historical Price Charts & Predictions"
                description="Upcoming season price forecasts and profitability analysis"
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={AttachMoney}
              title="Investment Portfolio"
            />
            <CardContent>
              <PlaceholderWidget
                icon="💰"
                title="Total Investment Value Deployed"
                description="Portfolio breakdown by crop type and region"
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={TrendingUp}
              title="ROI & Market Analysis"
            />
            <CardContent>
              <PlaceholderWidget
                icon="📈"
                title="AI-Powered Crop Profitability Forecasts"
                description="Risk alerts and market opportunity indicators"
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card>
            <CardHeaderWithIcon
              icon={Description}
              title="Recent Applications"
              action={<Chip label="18 Pending" size="small" color="primary" />}
            />
            <CardContent>
              <PlaceholderWidget
                icon="📝"
                title="Farmers Awaiting Approval"
                description="Review and manage investment applications"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default InvestorDashboard;
