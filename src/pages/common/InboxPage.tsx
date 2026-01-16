import DashboardLayout from '@/layouts/DashboardLayout';
import { Mail, Send } from 'lucide-react';

const InboxPage = () => {
  return (
    <DashboardLayout>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">
            <Mail size={24} />
            Inbox
          </h2>
          <span className="widget-card-badge">3 New</span>
        </div>
        <div className="widget-card-content">
          <p>Real-time chat with investors, farmers, and land owners.</p>
          <div className="chart-placeholder" style={{ marginTop: '2rem' }}>
            <Send size={48} style={{ marginBottom: '1rem' }} />
            <p>💬 Chat and messaging interface</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InboxPage;
