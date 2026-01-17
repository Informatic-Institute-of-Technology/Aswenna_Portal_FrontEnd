import DashboardLayout from '@/layouts/DashboardLayout';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">
            <Settings size={24} />
            Settings
          </h2>
        </div>
        <div className="widget-card-content">
          <p>Configure application preferences and settings.</p>
          <div className="chart-placeholder" style={{ marginTop: '2rem' }}>
            ⚙️ Application settings and preferences
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
