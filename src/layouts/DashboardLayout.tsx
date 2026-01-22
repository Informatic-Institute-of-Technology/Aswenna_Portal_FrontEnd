import { useAuth } from '@/Context/useAuth';
import { Mail, Notifications } from '@mui/icons-material';
import { Badge, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerSidebar, InvestorSidebar, LandOwnerSidebar, SuperAdminSidebar } from './sidebars';

interface DashboardLayoutProps {
  children: ReactNode;
}

const drawerWidth = 280;

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const renderSidebar = () => {
    switch (user?.role) {
      case 'farmer':
        return <FarmerSidebar />;
      case 'investor':
        return <InvestorSidebar />;
      case 'landowner':
        return <LandOwnerSidebar />;
      case 'superadmin':
        return <SuperAdminSidebar />;
    }
  };

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'farmer':
        return 'Farmer Dashboard';
      case 'investor':
        return 'Investor Dashboard';
      case 'landowner':
        return 'Land Owner Dashboard';
      case 'superadmin':
        return 'Super Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {renderSidebar()}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3 },
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {getDashboardTitle()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              color="inherit" 
              sx={{ border: '1px solid', borderColor: 'divider' }}
              onClick={() => navigate('/dashboard/inbox')}
              title="Messages"
            >
              <Badge badgeContent={3} color="error">
                <Mail />
              </Badge>
            </IconButton>
            <IconButton color="inherit" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Badge badgeContent={5} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>

        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
