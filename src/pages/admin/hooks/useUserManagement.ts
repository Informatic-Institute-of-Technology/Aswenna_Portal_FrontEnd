import { adminService, type ApiUserDetail } from "@/services/admin.service";
import type { GlobalUser } from "@/types/admin.types";
import { useEffect, useState } from "react";
import {
  type ActionType,
  getDistrict,
  mapApiUserToGlobalUser,
  normalizeStatus,
} from "../utils/userManagement.utils";

export interface ConfirmDialogState {
  open: boolean;
  action: ActionType | null;
  user: GlobalUser | null;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<GlobalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusTab, setStatusTab] = useState<number>(0);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [selectedUser, setSelectedUser] = useState<GlobalUser | null>(null);
  const [userDetail, setUserDetail] = useState<ApiUserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTab, setDetailTab] = useState(0);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    action: null,
    user: null,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setError(null);
      setLoading(true);
      const apiUsers = await adminService.getAllUsersPaginated();
      setUsers(apiUsers.map(mapApiUserToGlobalUser));
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsersOnMount = async () => {
      try {
        setError(null);
        const apiUsers = await adminService.getAllUsersPaginated();
        setUsers(apiUsers.map(mapApiUserToGlobalUser));
      } catch {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsersOnMount();
  }, []);

  const getStatusCategory = (
    u: GlobalUser,
  ): "pending" | "inactive" | "active" | "suspended" => {
    const s = (u.apiStatus || "").toUpperCase();
    if (s === "SUSPENDED") return "suspended";
    if (s === "ACTIVE") return "active";
    if (s === "INACTIVE" || s === "REJECTED" || s === "DISABLED")
      return "inactive";
    if (s === "PENDING") return "pending";
    if (u.isVerified) return "active";
    return "pending";
  };

  const baseFiltered = users.filter((user) => {
    const district = getDistrict(user.address);
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.nic &&
        user.nic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const statusCounts = {
    all: baseFiltered.length,
    pending: baseFiltered.filter((u) => getStatusCategory(u) === "pending")
      .length,
    inactive: baseFiltered.filter((u) => getStatusCategory(u) === "inactive")
      .length,
    active: baseFiltered.filter((u) => getStatusCategory(u) === "active")
      .length,
    suspended: baseFiltered.filter((u) => getStatusCategory(u) === "suspended")
      .length,
  };

  const filteredUsers = baseFiltered.filter((user) => {
    if (statusTab === 0) return true;
    const cat = getStatusCategory(user);
    if (statusTab === 1) return cat === "active";
    if (statusTab === 2) return cat === "inactive";
    if (statusTab === 3) return cat === "suspended";
    return true;
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const roleStats = {
    all: users.length,
    farmer: users.filter((u) => u.role === "farmer").length,
    investor: users.filter((u) => u.role === "investor").length,
    landowner: users.filter((u) => u.role === "landowner").length,
    superadmin: users.filter((u) => u.role === "superadmin").length,
  };

  const activeCount = users.filter((u) => u.isVerified).length;
  const activeRate =
    users.length > 0 ? Math.round((activeCount / users.length) * 100) : 0;

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleViewDetails = async (user: GlobalUser) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
    setDetailTab(0);
    setDetailLoading(true);
    setUserDetail(null);
    try {
      const detail = await adminService.getUserById(user.id);
      const normalized = {
        ...detail,
        farmerDetails: detail.farmer ?? detail.farmerDetails,
        investorDetails: detail.investor ?? detail.investorDetails,
        landOwnerDetails: detail.landOwner ?? detail.landOwnerDetails,
      };
      setUserDetail(normalized as ApiUserDetail);
    } catch (err) {
      console.error("Failed to fetch user detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedUser(null);
    setUserDetail(null);
    setDetailTab(0);
  };

  const requestAction = (action: ActionType, user: GlobalUser) => {
    setConfirmDialog({ open: true, action, user });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.action || !confirmDialog.user) return;
    setActionLoading(true);
    setActionError(null);
    const targetUser = confirmDialog.user;
    const action = confirmDialog.action;
    try {
      const newStatus: string =
        action === "approve" || action === "reactivate"
          ? "Active"
          : action === "suspend"
            ? "Suspended"
            : action === "reject"
              ? "Inactive"
              : "PENDING";

      const patched = await adminService.updateUserStatus(
        targetUser.id,
        newStatus,
      );
      const freshStatus = patched?.status ?? patched?.statues ?? newStatus;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id
            ? {
                ...u,
                apiStatus: freshStatus,
                isVerified: Boolean(patched?.emailVerified),
              }
            : u,
        ),
      );

      const normalized = normalizeStatus(freshStatus);
      if (normalized === "Active") setStatusTab(1);
      else if (normalized === "Inactive") setStatusTab(2);
      else if (normalized === "Suspended") setStatusTab(3);
      else setStatusTab(0);

      setConfirmDialog({ open: false, action: null, user: null });
    } catch (err) {
      console.error("Failed to update user status:", err);
      setActionError("Failed to update user status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    refreshUsers: fetchUsers,
    paginatedUsers,
    filteredUsers,
    statusCounts,
    roleStats,
    activeRate,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusTab,
    setStatusTab,
    page,
    rowsPerPage,
    handleChangePage,
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
    requestAction,
    handleConfirmAction,
    getStatusCategory,
  };
};
