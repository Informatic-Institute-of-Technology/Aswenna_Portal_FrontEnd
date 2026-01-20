import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationComplete = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    // Auto-hide notification after 5 seconds
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #1c1d21 0%, #1c1d21 40%, #2d3a1f 70%, #3d4f28 100%)",
        padding: "2rem",
      }}
    >
      {/* Success Icon */}
      <div
        style={{
          width: "80px",
          height: "80px",
          background: "linear-gradient(135deg, #5a7a3a 0%, #4a6a2a 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
          animation: "scaleIn 0.5s ease-out",
          boxShadow: "0 4px 20px rgba(107, 142, 35, 0.3)",
        }}
      >
        <Check size={40} color="#fff" strokeWidth={3} />
      </div>

      {/* Success Message */}
      <h1
        style={{
          fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
          fontSize: "2.5rem",
          color: "#fff",
          marginBottom: "2.5rem",
          textAlign: "center",
        }}
      >
        <span style={{ fontWeight: 400, color: "#6b8e23" }}>Registration </span>
        <span style={{ fontWeight: 700 }}>complete!</span>
      </h1>

      {/* Login Button */}
      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "1rem 4rem",
          fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
          fontSize: "1rem",
          fontWeight: 600,
          color: "#fff",
          background: "#6b8e23",
          border: "none",
          borderRadius: "25px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#5a7519";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(107, 142, 35, 0.4)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#6b8e23";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Login
      </button>

      {/* Right Bottom Notification */}
      {showNotification && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "#1e1e1e",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            border: "1px solid #3a3a3a",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            maxWidth: "350px",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                background: "#6b8e23",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              <Check size={14} color="#fff" strokeWidth={3} />
            </div>
            <div>
              <p
                style={{
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                }}
              >
                Your account has been successfully created.
              </p>
              <p
                style={{
                  color: "#b0b0b0",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                }}
              >
                You can now log in and start exploring Aswenna Portal.
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              style={{
                background: "none",
                border: "none",
                color: "#666",
                cursor: "pointer",
                padding: "0",
                fontSize: "1.25rem",
                lineHeight: 1,
                marginLeft: "0.5rem",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default RegistrationComplete;
