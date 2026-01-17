import DashboardLayout from '@/layouts/DashboardLayout';

const FarmerSearchPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">Farmer Search</h2>
        </div>
        <div className="widget-card-content">
          <p>Search for farmers based on skills, experience, and region.</p>
          <div className="chart-placeholder" style={{ marginTop: '2rem' }}>
            👨‍🌾 Advanced farmer search with filters
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerSearchPage;
