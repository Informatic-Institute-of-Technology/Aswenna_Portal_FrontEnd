import DashboardLayout from '@/layouts/DashboardLayout';

const MyOffersPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">My Offers</h2>
        </div>
        <div className="widget-card-content">
          <p>Create Investment Offers including crop interest, budget, and profit-sharing models.</p>
          <div style={{ marginTop: '2rem' }}>
            <button className="sidebar-logout" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
              + Create New Offer
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyOffersPage;
