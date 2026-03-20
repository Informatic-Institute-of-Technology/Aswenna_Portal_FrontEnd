import { PersonAdd, Refresh } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import ConfirmActionDialog from "./components/ConfirmActionDialog";
import TableSectionHeader from "./components/TableSectionHeader";
import UserDetailDialog from "./components/UserDetailDialog";
import UserStatCards from "./components/UserStatCards";
import UserTableSection from "./components/UserTableSection";
import { useTableFilter } from "./hooks/useTableFilter";
import { useUserManagement } from "./hooks/useUserManagement";
import { normalizeStatus } from "./utils/userManagement.utils";

const STATUS_TAB_DEFS = [
  {
    label: "All",
    countKey: "all" as const,
    activeColor: "rgba(255,255,255,0.9)",
    chipBg: "var(--surface-light)",
    chipColor: "inherit" as const,
    indicatorColor: "rgba(255,255,255,0.65)",
  },
  {
    label: "Active",
    countKey: "active" as const,
    activeColor: "var(--color-brand-primary)",
    chipBg: "var(--color-brand-muted)",
    chipColor: "var(--color-brand-primary)",
    indicatorColor: "var(--color-brand-primary)",
  },
  {
    label: "Inactive",
    countKey: "inactive" as const,
    activeColor: "var(--color-error)",
    chipBg: "var(--color-overdue-muted)",
    chipColor: "var(--color-error)",
    indicatorColor: "var(--color-error)",
  },
  {
    label: "Suspended",
    countKey: "suspended" as const,
    activeColor: "var(--color-error)",
    chipBg: "var(--color-error-bg)",
    chipColor: "var(--color-error)",
    indicatorColor: "var(--color-error)",
  },
] as const;

const ROWS_PER_PAGE = 10;

const GlobalUserManagement = () => {
  const {
    users,
    loading,
    error,
    filteredUsers,
    statusCounts,
    roleStats,
    activeRate,
    searchQuery,
    setSearchQuery,
    statusTab,
    setStatusTab,
    selectedUser,
    userDetail,
    detailLoading,
    detailTab,
    setDetailTab,
    detailDialogOpen,
    handleViewDetails,
    handleCloseDialog,
    confirmDialog,
    setConfirmDialog,
    actionLoading,
    actionError,
    deleteSuccess,
    setDeleteSuccess,
    requestAction,
    handleConfirmAction,
    refreshUsers,
  } = useUserManagement();

  const pendingFilter = useTableFilter();
  const mainFilter = useTableFilter();

  const [pendingPage, setPendingPage] = React.useState(0);
  const [mainPage, setMainPage] = React.useState(0);

  React.useEffect(
    () => setPendingPage(0),
    [pendingFilter.columnFilters, pendingFilter.sortConfig],
  );
  React.useEffect(
    () => setMainPage(0),
    [mainFilter.columnFilters, mainFilter.sortConfig, statusTab, searchQuery],
  );

  const [pendingSearch, setPendingSearch] = React.useState("");

  const allPendingBase = users
    .filter((u) => normalizeStatus(u.apiStatus) === "Pending")
    .filter((u) =>
      pendingSearch
        ? `${u.fullName} ${u.email}`
            .toLowerCase()
            .includes(pendingSearch.toLowerCase())
        : true,
    );
  const displayedPending = pendingFilter.apply(allPendingBase);
  const paginatedPending = displayedPending.slice(
    pendingPage * ROWS_PER_PAGE,
    (pendingPage + 1) * ROWS_PER_PAGE,
  );

  const displayedMain = mainFilter.apply(filteredUsers);
  const paginatedMain = displayedMain.slice(
    mainPage * ROWS_PER_PAGE,
    (mainPage + 1) * ROWS_PER_PAGE,
  );

  const currentTabDef = STATUS_TAB_DEFS[statusTab];

  const mainEmptyMessage =
    statusTab === 1
      ? "No active users found"
      : statusTab === 2
        ? "No inactive users found"
        : statusTab === 3
          ? "No suspended users found"
          : "No users found matching your criteria";

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              User Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {users.length} registered users across all roles
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Tooltip title="Refresh all data">
              <IconButton
                onClick={refreshUsers}
                disabled={loading}
                size="small"
                sx={{
                  color: "var(--color-olive)",
                  border: "1px solid var(--color-olive-muted-strong)",
                  borderRadius: 2,
                  p: 1,
                  "&:hover": { bgcolor: "var(--color-olive-muted)" },
                }}
              >
                <Refresh
                  sx={{
                    fontSize: 18,
                    animation: loading ? "spin 0.8s linear infinite" : "none",
                    "@keyframes spin": {
                      from: { transform: "rotate(0deg)" },
                      to: { transform: "rotate(360deg)" },
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{
                background:
                  "linear-gradient(135deg, var(--color-olive-dark) 0%, var(--color-olive) 100%)",
                borderRadius: 2,
                px: 2.5,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 14px var(--color-olive-glow)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, var(--color-olive-dark) 0%, var(--color-olive-hover) 100%)",
                },
              }}
            >
              Add User
            </Button>
          </Box>
        </Box>

        <UserStatCards roleStats={roleStats} activeRate={activeRate} />

        {allPendingBase.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <TableSectionHeader
              title="Pending Approvals"
              subtitle="Users awaiting admin review and activation"
              accentGradient="linear-gradient(180deg, var(--color-amber), var(--color-amber-muted))"
              accentColor="var(--color-amber)"
              borderColor="var(--color-pending-border)"
              searchValue={pendingSearch}
              searchPlaceholder="Search pending users…"
              onSearchChange={setPendingSearch}
              filterPaneOpen={pendingFilter.filterPaneOpen}
              filterCount={pendingFilter.activeFilterCount}
              onFilterToggle={() => pendingFilter.setFilterPaneOpen((v) => !v)}
            />
            <UserTableSection
              filter={pendingFilter}
              displayedUsers={displayedPending}
              paginatedUsers={paginatedPending}
              page={pendingPage}
              onPageChange={setPendingPage}
              onViewDetails={handleViewDetails}
              onRequestAction={requestAction}
              accentColor="var(--color-amber)"
              headerColor="rgba(245,158,11,0.6)"
              borderColor="var(--color-pending-border)"
              headerBg="var(--color-pending-muted)"
              emptyMessage="No pending users match the current filters"
              sx={{ mb: 4 }}
            />
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <TableSectionHeader
            title="User Directory"
            subtitle="Manage and monitor all registered platform users"
            accentGradient="linear-gradient(180deg, var(--color-olive), var(--color-olive-dark))"
            accentColor="var(--color-olive)"
            borderColor="var(--color-olive-muted-strong)"
            searchValue={searchQuery}
            searchPlaceholder="Search users by name or email…"
            onSearchChange={setSearchQuery}
            filterPaneOpen={mainFilter.filterPaneOpen}
            filterCount={mainFilter.activeFilterCount}
            onFilterToggle={() => mainFilter.setFilterPaneOpen((v) => !v)}
          />
          <UserTableSection
            filter={mainFilter}
            displayedUsers={displayedMain}
            paginatedUsers={paginatedMain}
            page={mainPage}
            onPageChange={setMainPage}
            onViewDetails={handleViewDetails}
            onRequestAction={requestAction}
            accentColor="var(--color-olive)"
            headerColor="rgba(255,255,255,0.45)"
            borderColor="var(--surface-light)"
            headerBg="transparent"
            emptyMessage={mainEmptyMessage}
            loading={loading}
            error={error}
          >
            <Box
              sx={{
                px: 3,
                pt: 2,
                pb: 0,
                borderBottom: "1px solid var(--color-olive-muted)",
              }}
            >
              <Tabs
                value={statusTab}
                onChange={(_e, v: number) => setStatusTab(v)}
                sx={{
                  minHeight: 44,
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    minWidth: 0,
                    px: 0,
                    mr: 4,
                    pb: 1.5,
                    color: "rgba(255,255,255,0.45)",
                  },
                  "& .Mui-selected": { fontWeight: 700 },
                  "& .MuiTabs-indicator": {
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                    bgcolor: currentTabDef.indicatorColor,
                  },
                }}
              >
                {STATUS_TAB_DEFS.map((tab, idx) => (
                  <Tab
                    key={tab.label}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        {tab.label}
                        <Chip
                          label={statusCounts[tab.countKey]}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            bgcolor: tab.chipBg,
                            color: tab.chipColor,
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      "&.Mui-selected": {
                        color: STATUS_TAB_DEFS[idx].activeColor,
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          </UserTableSection>
        </Box>
      </Box>

      <ConfirmActionDialog
        open={confirmDialog.open}
        action={confirmDialog.action}
        user={confirmDialog.user}
        loading={actionLoading}
        errorMessage={actionError}
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setConfirmDialog({ open: false, action: null, user: null })
        }
      />

      <UserDetailDialog
        open={detailDialogOpen}
        selectedUser={selectedUser}
        userDetail={userDetail}
        detailLoading={detailLoading}
        detailTab={detailTab}
        onTabChange={setDetailTab}
        onClose={handleCloseDialog}
      />

      <Snackbar
        open={deleteSuccess}
        autoHideDuration={4000}
        onClose={() => setDeleteSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={() => setDeleteSuccess(false)}
          severity="error"
          variant="filled"
          elevation={6}
          sx={{
            width: "100%",
            minWidth: "300px",
            fontSize: "0.95rem",
            "& .MuiAlert-message": { padding: "8px 0" },
          }}
        >
          User Deleted Successfully
        </Alert>
      </Snackbar>
    </>
  );
};

export default GlobalUserManagement;
