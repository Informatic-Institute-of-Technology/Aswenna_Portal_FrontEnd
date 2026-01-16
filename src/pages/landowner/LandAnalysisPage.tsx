import DashboardLayout from '@/layouts/DashboardLayout';

const LandAnalysisPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">Land Analysis</h2>
        </div>
        <div className="widget-card-content">
          <p>AI tools suggesting best matching farmers for specific land and best crop recommendations.</p>
          <div className="chart-placeholder" style={{ marginTop: '2rem' }}>
            🤖 AI-powered land analysis and recommendations
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LandAnalysisPage;
