import { ProtectedRoute, PublicRoute } from "@/components";
import { AuthProvider } from "@/Context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));
const EmailVerification = lazy(() => import("./EmailVerification"));
const RoleSelection = lazy(() => import("./RoleSelection"));
const FarmerProfileSetup = lazy(() => import("./farmer/FarmerProfileSetup"));
const LandownerProfileSetup = lazy(
  () => import("./landowner/LandownerProfileSetup"),
);
const InvestorProfileSetup = lazy(
  () => import("./investor/InvestorProfileSetup"),
);
const TermsAndConditions = lazy(() => import("./common/TermsAndConditions"));

const Dashboard = lazy(() => import("./Dashboard"));
const AccountPage = lazy(() => import("./common/AccountPage"));
const InboxPage = lazy(() => import("./common/InboxPage"));
const SettingsPage = lazy(() => import("./common/SettingsPage"));

const MyProjectsPage = lazy(() => import("./common/MyProjectsPage"));
const InvestorsPage = lazy(() => import("./common/InvestorsPage"));
const LandOwnersPage = lazy(() => import("./common/LandOwnersPage"));
const MatchMakingPage = lazy(() => import("./common/MatchMakingPage"));

const MyOffersPage = lazy(() => import("./investor/MyOffersPage"));
const OpportunitiesPage = lazy(() => import("./investor/OpportunitiesPage"));
const RequestsPage = lazy(() => import("./investor/RequestsPage"));
const FinanceLedgerPage = lazy(() => import("./investor/FinanceLedgerPage"));
const PaymentControlCenterPage = lazy(
  () => import("./investor/payment/PaymentControlCenterPage"),
);
const ProjectPaymentMilestonePage = lazy(
  () => import("./investor/payment/ProjectPaymentMilestonePage"),
);
const PayInstallmentPage = lazy(
  () => import("./investor/payment/PayInstallmentPage"),
);

const MyLandAdsPage = lazy(() => import("./landowner/MyLandAdsPage"));
const ReceivedRequestsPage = lazy(
  () => import("./landowner/ReceivedRequestsPage"),
);
const TenantSearchPage = lazy(() => import("./landowner/TenantSearchPage"));
const LandAnalysisPage = lazy(() => import("./landowner/LandAnalysisPage"));

const GlobalUserManagement = lazy(() => import("./admin/GlobalUserManagement"));
const GlobalPaymentLedger = lazy(() => import("./admin/GlobalPaymentLedger"));
const ActiveProjectsMonitoring = lazy(
  () => import("./admin/ActiveProjectsMonitoring"),
);
const SystemActivityLog = lazy(() => import("./admin/SystemActivityLog"));

const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <p>Loading...</p>
  </div>
);

function AppRoutes() {
  usePageTitle();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route
            path="/farmer-profile-setup"
            element={<FarmerProfileSetup />}
          />
          <Route
            path="/landowner-profile-setup"
            element={<LandownerProfileSetup />}
          />
          <Route
            path="/investor-profile-setup"
            element={<InvestorProfileSetup />}
          />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
        </Route>

        <Route path="/:sessionId" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="inbox" element={<InboxPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="settings" element={<SettingsPage />} />

            <Route path="my-projects" element={<MyProjectsPage />} />
            <Route path="investors" element={<InvestorsPage />} />
            <Route path="land-owners" element={<LandOwnersPage />} />
            <Route path="match-making" element={<MatchMakingPage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />

            <Route path="my-offers" element={<MyOffersPage />} />
            <Route path="land-search" element={<LandOwnersPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="roi-analysis" element={<MatchMakingPage />} />
            <Route path="profitability" element={<Dashboard />} />
            <Route path="finance-ledger" element={<FinanceLedgerPage />} />
            <Route
              path="payment-pipeline"
              element={<PaymentControlCenterPage />}
            />
            <Route
              path="payment-control"
              element={<PaymentControlCenterPage />}
            />
            <Route
              path="payment-milestone"
              element={<ProjectPaymentMilestonePage />}
            />
            <Route path="pay-installment" element={<PayInstallmentPage />} />

            <Route path="my-land-ads" element={<MyLandAdsPage />} />
            <Route
              path="received-requests"
              element={<ReceivedRequestsPage />}
            />
            <Route path="tenant-search" element={<TenantSearchPage />} />
            <Route path="land-analysis" element={<LandAnalysisPage />} />
            <Route path="income-tracker" element={<Dashboard />} />
            <Route path="soil-weather" element={<Dashboard />} />
            <Route path="tenant-management" element={<TenantSearchPage />} />

            <Route path="admin/users" element={<GlobalUserManagement />} />
            <Route path="admin/payments" element={<GlobalPaymentLedger />} />
            <Route
              path="admin/projects"
              element={<ActiveProjectsMonitoring />}
            />
            <Route path="admin/activity-log" element={<SystemActivityLog />} />
            <Route path="admin/disputes" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
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
