import { useAuth } from "@/Context/useAuth";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Layout route guard — renders nested <Outlet /> for unauthenticated users,
 * redirects authenticated users to their session-scoped dashboard.
 */
const PublicRoute = () => {
  const { user, sessionId, loading } = useAuth();

  if (loading) {
    return (
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
  }

  if (user && sessionId) {
    return <Navigate to={`/${sessionId}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
