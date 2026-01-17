import DashboardLayout from '@/layouts/DashboardLayout';

const RequestsPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">Requests</h2>
          <span className="widget-card-badge">18 Pending</span>
        </div>
        <div className="widget-card-content">
          <p>View and manage requests from farmers applying to your offers.</p>
          <div className="chart-placeholder" style={{ marginTop: '2rem' }}>
            📋 Application management system
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RequestsPage;
