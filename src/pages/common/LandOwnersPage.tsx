import DashboardLayout from '@/layouts/DashboardLayout';

const LandOwnersPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">Land Owners</h2>
        </div>
        <div className="widget-card-content">
          <p>Search land listings and request access or partnership.</p>
          <div className="chart-placeholder" style={{ marginTop: '2rem' }}>
            🏞️ Browse available land with filters
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LandOwnersPage;
