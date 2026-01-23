import { useAuth } from '@/Context/useAuth';
import FarmerDashboard from './dashboards/FarmerDashboard';
import InvestorDashboard from './dashboards/InvestorDashboard';
import LandOwnerDashboard from './dashboards/LandOwnerDashboard';
import SuperAdminDashboard from './dashboards/SuperAdminDashboardNew';

const Dashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'investor':
      return <InvestorDashboard />;
    case 'landowner':
      return <LandOwnerDashboard />;
    case 'superadmin':
      return <SuperAdminDashboard />;
  }
};

export default Dashboard;
