import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import CreateAdPopup from "../../components/landowner/CreateAdPopup";

const MyLandAdsPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>
      {/* PAGE CARD */}
      <div className="widget-card">
        <div
          className="widget-card-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="widget-card-title">My Land Ads</h2>

          <button
            className="sidebar-logout"
            onClick={() => setOpen(true)}
            style={{
              backgroundColor: "#497b30",
              color: "#fff",
              borderRadius: "8px",
              padding: "10px 22px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            + Create New Land Ad
          </button>
        </div>

        <div className="widget-card-content">
          <p>
            Create Land Ads detailing location, soil type, and availability.
          </p>
        </div>
      </div>
      <CreateAdPopup open={open} onClose={() => setOpen(false)} />
    </DashboardLayout>
  );
};

export default MyLandAdsPage;
