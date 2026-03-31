import { useAuth } from "@/Context/useAuth";
import { authService } from "@/services";
import { Navigate, Outlet, useParams } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, loading, sessionId } = useAuth();
  const { sessionId: urlSessionId } = useParams<{ sessionId: string }>();

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

  if (!user || !sessionId) {
    return <Navigate to="/login" replace />;
  }

  if (!urlSessionId || !authService.validateSessionId(urlSessionId)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
