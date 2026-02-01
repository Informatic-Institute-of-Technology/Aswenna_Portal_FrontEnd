import { ProtectedRoute, PublicRoute } from '@/components';
import { AuthProvider } from '@/Context/AuthContext';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import AccountPage from './common/AccountPage';
import InboxPage from './common/InboxPage';
import InvestorsPage from './common/InvestorsPage';
import LandOwnersPage from './common/LandOwnersPage';
import MatchMakingPage from './common/MatchMakingPage';
import MyProjectsPage from './common/MyProjectsPage';
import SettingsPage from './common/SettingsPage';
import Dashboard from './Dashboard';
import EmailVerification from './EmailVerification';
import FarmerProfileSetup from './farmer/FarmerProfileSetup';
import MyOffersPage from './investor/MyOffersPage';
import OpportunitiesPage from './investor/OpportunitiesPage';
import RequestsPage from './investor/RequestsPage';
import LandAnalysisPage from './landowner/LandAnalysisPage';
import LandownerProfileSetup from './landowner/LandownerProfileSetup';
import MyLandAdsPage from './landowner/MyLandAdsPage';
import ReceivedRequestsPage from './landowner/ReceivedRequestsPage';
import TenantSearchPage from './landowner/TenantSearchPage';
import Login from './Login';
import RoleSelection from './RoleSelection';
import Signup from './Signup';
// Super Admin Pages
import ActiveProjectsMonitoring from './admin/ActiveProjectsMonitoring';
import GlobalPaymentLedger from './admin/GlobalPaymentLedger';
import GlobalUserManagement from './admin/GlobalUserManagement';
import SystemActivityLog from './admin/SystemActivityLog';

function AppRoutes() {
  usePageTitle();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <EmailVerification />
          </PublicRoute>
        }
      />

      <Route
        path="/role-selection"
        element={
          <PublicRoute>
            <RoleSelection />
          </PublicRoute>
        }
      />

      <Route
        path="/farmer-profile-setup"
        element={
          <PublicRoute>
            <FarmerProfileSetup />
          </PublicRoute>
        }
      />

      <Route
        path="/landowner-profile-setup"
        element={
          <PublicRoute>
            <LandownerProfileSetup />
          </PublicRoute>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/my-projects"
        element={
          <ProtectedRoute>
            <MyProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/investors"
        element={
          <ProtectedRoute>
            <InvestorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/land-owners"
        element={
          <ProtectedRoute>
            <LandOwnersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/match-making"
        element={
          <ProtectedRoute>
            <MatchMakingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/opportunities"
        element={
          <ProtectedRoute>
            <OpportunitiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/inbox"
        element={
          <ProtectedRoute>
            <InboxPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/my-offers"
        element={
          <ProtectedRoute>
            <MyOffersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/land-search"
        element={
          <ProtectedRoute>
            <LandOwnersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/requests"
        element={
          <ProtectedRoute>
            <RequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/roi-analysis"
        element={
          <ProtectedRoute>
            <MatchMakingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profitability"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/my-land-ads"
        element={
          <ProtectedRoute>
            <MyLandAdsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/received-requests"
        element={
          <ProtectedRoute>
            <ReceivedRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tenant-search"
        element={
          <ProtectedRoute>
            <TenantSearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/land-analysis"
        element={
          <ProtectedRoute>
            <LandAnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/income-tracker"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/soil-weather"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tenant-management"
        element={
          <ProtectedRoute>
            <TenantSearchPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/users"
        element={
          <ProtectedRoute>
            <GlobalUserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/payments"
        element={
          <ProtectedRoute>
            <GlobalPaymentLedger />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/projects"
        element={
          <ProtectedRoute>
            <ActiveProjectsMonitoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/activity-log"
        element={
          <ProtectedRoute>
            <SystemActivityLog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/disputes"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
