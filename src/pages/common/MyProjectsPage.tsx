const MyProjectsPage = () => {
  return (
    <>
      <div className="widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">My Projects</h2>
        </div>
        <div className="widget-card-content">
          <p>
            Create Farming Opportunity and view the status of your current
            farming plans.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <button
              className="sidebar-logout"
              style={{ width: "auto", padding: "0.75rem 1.5rem" }}
            >
              + Create New Project
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProjectsPage;
