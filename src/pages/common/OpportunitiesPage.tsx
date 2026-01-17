import DashboardLayout from '@/layouts/DashboardLayout';

const OpportunitiesPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">Opportunities</h2>
        </div>
        <div className="widget-card-content">
          <p>Feed of "Looking for an Investor" posts and matched offers.</p>
          <div className="chart-placeholder" style={{ marginTop: '2rem' }}>
            📢 Browse investment opportunities
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OpportunitiesPage;
