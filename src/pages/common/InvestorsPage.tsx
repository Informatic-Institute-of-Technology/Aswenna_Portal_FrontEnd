import DashboardLayout from '@/layouts/DashboardLayout';

const InvestorsPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">Investors</h2>
        </div>
        <div className="widget-card-content">
          <p>Search and view investment offers created by investors.</p>
          <div className="chart-placeholder" style={{ marginTop: '2rem' }}>
            🔍 Searchable list of investors and their offers
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestorsPage;
