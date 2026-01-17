import DashboardLayout from '@/layouts/DashboardLayout';
import { User } from 'lucide-react';

const AccountPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">
            <User size={24} />
            Account Settings
          </h2>
        </div>
        <div className="widget-card-content">
          <p>Manage your profile and account information.</p>
          <div className="chart-placeholder" style={{ marginTop: '2rem' }}>
            👤 Profile management interface
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountPage;
