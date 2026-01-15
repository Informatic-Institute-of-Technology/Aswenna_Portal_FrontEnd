import { useAuth } from '@/Context/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6b8e6f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
        
        <div style={{ backgroundColor: '#f5f5f5', padding: '2rem', borderRadius: '8px' }}>
          <h2>Welcome, {user?.name || user?.email}!</h2>
          <p style={{ marginTop: '1rem' }}>
            You have successfully logged in to the Aswenna Portal.
          </p>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            This is a placeholder dashboard. Add your application features here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
