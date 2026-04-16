import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/login": "Login",
  "/dashboard": "Dashboard",
  "/dashboard/my-projects": "My Projects",
  "/dashboard/investors": "Investors",
  "/dashboard/land-owners": "Land Owners",
  "/dashboard/match-making": "Match Making",
  "/dashboard/opportunities": "Opportunities",
  "/dashboard/inbox": "Inbox",
  "/dashboard/account": "Account",
  "/dashboard/settings": "Settings",
  "/dashboard/my-offers": "My Offers",
  "/dashboard/requests": "Requests",
  "/dashboard/smart-match-making": "Smart Match Making",
  "/dashboard/roi-analysis": "Smart Match Making",
  "/dashboard/profitability": "Smart Match Making",
  "/dashboard/my-land-ads": "My Land Ads",
  "/dashboard/land-search": "Land Search",
  "/dashboard/received-requests": "Received Requests",
  "/dashboard/tenant-search": "Tenant Search",
  "/dashboard/land-analysis": "Land Analysis",
  "/dashboard/income-tracker": "Income Tracker",
  "/dashboard/soil-weather": "Soil & Weather",
  "/dashboard/tenant-management": "Tenant Management",
  "/dashboard/admin/users": "User Management",
  "/dashboard/admin/payments": "Payment Ledger",
  "/dashboard/admin/projects": "Projects Monitoring",
  "/dashboard/admin/activity-log": "Activity Log",
  "/dashboard/admin/disputes": "Disputes",
};

export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = pageTitles[location.pathname] || "Portal";
    document.title = `Aswenna - ${pageTitle}`;
  }, [location]);
};
