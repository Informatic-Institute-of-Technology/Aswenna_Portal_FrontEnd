import { useAuth } from "@/Context/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { user, sessionId, initializing } = useAuth();

  if (initializing) {
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
