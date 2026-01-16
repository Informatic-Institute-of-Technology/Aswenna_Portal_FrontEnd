import DashboardLayout from '@/layouts/DashboardLayout';

const MyLandAdsPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">My Land Ads</h2>
        </div>
        <div className="widget-card-content">
          <p>Create Land Ads detailing location, soil type, and availability.</p>
          <div style={{ marginTop: '2rem' }}>
            <button className="sidebar-logout" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
              + Create New Land Ad
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyLandAdsPage;
