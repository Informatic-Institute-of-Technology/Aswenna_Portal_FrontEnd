import { useAuth } from '@/Context/useAuth';
import FarmerDashboard from './dashboards/FarmerDashboard';
import InvestorDashboard from './dashboards/InvestorDashboard';
import LandOwnerDashboard from './dashboards/LandOwnerDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'investor':
      return <InvestorDashboard />;
    case 'landowner':
      return <LandOwnerDashboard />;
    default:
      return <FarmerDashboard />;
  }
};

export default Dashboard;
