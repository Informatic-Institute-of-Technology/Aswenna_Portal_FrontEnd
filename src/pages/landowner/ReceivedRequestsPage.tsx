import DashboardLayout from '@/layouts/DashboardLayout';

const ReceivedRequestsPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">Received Requests</h2>
        </div>
        <div className="widget-card-content">
          <p>Manage inquiries from farmers seeking land or investors needing land.</p>
          <div className="chart-placeholder" style={{ marginTop: '2rem' }}>
            📬 Request management interface
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceivedRequestsPage;
