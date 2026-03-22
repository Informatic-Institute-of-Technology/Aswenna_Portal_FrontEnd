import { config } from "@/core/config";
import type { ApiUser } from "@/services/admin.service";
import type { GlobalUser } from "@/types/admin.types";

export type ActionType =
  | "approve"
  | "reject"
  | "suspend"
  | "reactivate"
  | "set_pending"
  | "delete";

export const roleIdToRole = (
  role: string | { _id: string; name: string },
): GlobalUser["role"] => {
  if (typeof role === "object") {
    const name = role.name.toLowerCase();
    if (name === "landowner") return "landowner";
    if (name === "farmer") return "farmer";
    if (name === "investor") return "investor";
    if (name === "superadmin") return "superadmin";
    return roleIdToRole(role._id);
  }
  const roleMapping: { [key: string]: GlobalUser["role"] } = {
    "696e40fda4f896e9f40c8b93": "farmer",
    "696e6163b558abe269548099": "investor",
    "696e616db558abe26954809c": "landowner",
    "696f008a3e12fb6fd9ed945b": "superadmin",
  };
  return roleMapping[role] || "farmer";
};

export const mapApiUserToGlobalUser = (user: ApiUser): GlobalUser => {
  const fullName =
    user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const isVerified = Boolean(user.emailVerified);
  const phoneVerified = Boolean(user.phoneNumberVerified);
  const trustScore = isVerified ? 85 : 65;

  return {
    id: user._id,
    fullName: fullName || "Unknown User",
    email: user.email,
    phoneNumber: user.phoneNumber,
    nic: user.nic || user.personalInfo?.nicNumber,
    role: roleIdToRole(user.role),
    registrationDate: user.createdAt,
    lastLogin: user.updatedAt || user.createdAt,
    isVerified,
    isActive: true,
    apiStatus:
      user.status || user.statues || (isVerified ? "Active" : "Pending"),
    address:
      user.address ||
      user.personalInfo?.district ||
      user.personalInfo?.city ||
      user.personalInfo?.address,
    avatar: (() => {
      const pic = user.personalInfo?.profilePicture;
      if (!pic) return undefined;
      if (typeof pic === "string") return pic;
      const p = pic as { url?: string; filename?: string };
      if (p.url) return p.url;
      if (p.filename) return `${config.storage.baseUrl}/${p.filename}`;
      return undefined;
    })(),
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTransactions: 0,
    verificationStatus: {
      identity: "pending",
      email: isVerified ? "verified" : "pending",
      phone: phoneVerified ? "verified" : "pending",
    },
    documents: [],
    overduePayments: 0,
    disputesInvolved: 0,
    trustScore,
  };
};

export const getRoleColor = (role: string) => {
  switch (role) {
    case "farmer":
      return "var(--color-brand-primary)";
    case "investor":
      return "var(--color-info-blue)";
    case "landowner":
      return "var(--color-amber)";
    case "superadmin":
      return "var(--color-purple)";
    default:
      return "var(--neutral-500)";
  }
};

export const getRoleBgColor = (role: string) => {
  switch (role) {
    case "farmer":
      return "var(--color-brand-muted)";
    case "investor":
      return "var(--color-info-blue-muted)";
    case "landowner":
      return "var(--color-amber-muted)";
    case "superadmin":
      return "rgba(168, 85, 247, 0.15)";
    default:
      return "rgba(107, 114, 128, 0.15)";
  }
};

export const getDistrict = (address?: string): string => {
  if (!address || address.trim() === "") return "N/A";
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (parts.length === 0) return "N/A";
  return parts[parts.length - 1] || parts[0] || "N/A";
};

export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const getAvatarColor = (name: string) => {
  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#14b8a6",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const normalizeStatus = (
  s?: string,
): "Pending" | "Active" | "Inactive" | "Suspended" => {
  const up = (s || "").toUpperCase();
  if (up === "ACTIVE") return "Active";
  if (up === "SUSPENDED") return "Suspended";
  if (up === "INACTIVE" || up === "REJECTED" || up === "DISABLED")
    return "Inactive";
  return "Pending";
};

export const statusColor: Record<string, string> = {
  Pending: "#f59e0b",
  Active: "#22c55e",
  Inactive: "#ef4444",
  Suspended: "#f97316",
};

export const statusBgColor: Record<string, string> = {
  Pending: "var(--color-amber-muted)",
  Active: "var(--color-brand-muted)",
  Inactive: "var(--color-overdue-muted)",
  Suspended: "var(--color-orange-muted)",
};

export const statusTextColor: Record<string, string> = {
  Pending: "var(--color-pending)",
  Active: "var(--color-brand-primary)",
  Inactive: "var(--color-error)",
  Suspended: "var(--color-orange)",
};

export const formatJoinDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
