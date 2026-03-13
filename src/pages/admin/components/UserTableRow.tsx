import type { GlobalUser } from "@/types/admin.types";
import {
  Block,
  CheckCircle,
  DeleteForever,
  Email,
  Pending,
  PersonOff,
  PhoneAndroid,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import type { FilterColKey } from "../hooks/useTableFilter";
import type { ActionType } from "../utils/userManagement.utils";
import {
  formatJoinDate,
  getAvatarColor,
  getDistrict,
  getInitials,
  getRoleBgColor,
  getRoleColor,
  normalizeStatus,
  statusColor,
} from "../utils/userManagement.utils";

interface UserTableRowProps {
  user: GlobalUser;
  onViewDetails: (user: GlobalUser) => void;
  onRequestAction: (action: ActionType, user: GlobalUser) => void;
  onCellMenuOpen?: (
    e: React.MouseEvent<HTMLElement>,
    col: FilterColKey,
    value: string,
  ) => void;
}

const UserTableRow = ({
  user,
  onViewDetails,
  onRequestAction,
  onCellMenuOpen,
}: UserTableRowProps) => {
  const isSuspended = (user.apiStatus || "").toUpperCase() === "SUSPENDED";
  const district = getDistrict(user.address);
  const initials = getInitials(user.fullName);
  const avatarBg = getAvatarColor(user.fullName);
  const roleColor = getRoleColor(user.role);
  const roleBg = getRoleBgColor(user.role);
  const currentStatus = normalizeStatus(user.apiStatus);
  const statusCol = statusColor[currentStatus];

  const handleStatusChange = (next: string) => {
    if (next === currentStatus) return;
    let action: ActionType;
    if (next === "Active") action = isSuspended ? "reactivate" : "approve";
    else if (next === "Suspended") action = "suspend";
    else if (next === "Inactive") action = "reject";
    else if (next === "Pending") action = "set_pending";
    else return;
    onRequestAction(action, user);
  };

  return (
    <TableRow
      hover
      sx={{
        "&:last-child td": { border: 0 },
        "& td": {
          borderBottom: "1px solid var(--surface-light)",
          py: 1.5,
        },
      }}
    >
      <TableCell
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button,a,[role='button']"))
            return;
          onCellMenuOpen?.(e, "user", `${user.fullName} ${user.email}`);
        }}
        sx={{ cursor: onCellMenuOpen ? "context-menu" : "default" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={user.avatar || undefined}
            sx={{
              width: 40,
              height: 40,
              bgcolor: avatarBg,
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ lineHeight: 1.3 }}
            >
              {user.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell
        onClick={(e) => onCellMenuOpen?.(e, "role", user.role)}
        sx={{ cursor: onCellMenuOpen ? "context-menu" : "default" }}
      >
        <Chip
          label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          size="small"
          sx={{
            bgcolor: roleBg,
            color: roleColor,
            fontWeight: 600,
            borderRadius: 1.5,
            fontSize: "0.75rem",
            height: 24,
          }}
        />
      </TableCell>

      <TableCell
        onClick={(e) => onCellMenuOpen?.(e, "status", currentStatus)}
        sx={{ cursor: onCellMenuOpen ? "context-menu" : "default" }}
      >
        <Chip
          label={currentStatus}
          size="small"
          sx={{
            bgcolor: `${statusCol}22`,
            color: statusCol,
            fontWeight: 600,
            borderRadius: 1.5,
            fontSize: "0.75rem",
            height: 24,
          }}
        />
      </TableCell>

      <TableCell
        onClick={(e) => onCellMenuOpen?.(e, "nic", user.nic || "")}
        sx={{ cursor: onCellMenuOpen ? "context-menu" : "default" }}
      >
        <Typography
          variant="body2"
          sx={{ fontFamily: "monospace", letterSpacing: 0.5 }}
        >
          {user.nic || "N/A"}
        </Typography>
      </TableCell>

      <TableCell
        onClick={(e) => onCellMenuOpen?.(e, "district", district)}
        sx={{ cursor: onCellMenuOpen ? "context-menu" : "default" }}
      >
        <Typography variant="body2">{district}</Typography>
      </TableCell>

      <TableCell>
        <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
          <Tooltip title={`Email: ${user.verificationStatus.email}`}>
            <Email
              fontSize="small"
              sx={{
                color:
                  user.verificationStatus.email === "verified"
                    ? "var(--color-brand-primary)"
                    : "text.disabled",
                fontSize: 18,
              }}
            />
          </Tooltip>
          <Tooltip title={`Phone: ${user.verificationStatus.phone}`}>
            <PhoneAndroid
              fontSize="small"
              sx={{
                color:
                  user.verificationStatus.phone === "verified"
                    ? "var(--color-brand-primary)"
                    : "text.disabled",
                fontSize: 18,
              }}
            />
          </Tooltip>
        </Box>
      </TableCell>

      <TableCell
        onClick={(e) =>
          onCellMenuOpen?.(e, "joined", user.registrationDate || "")
        }
        sx={{ cursor: onCellMenuOpen ? "context-menu" : "default" }}
      >
        <Typography variant="body2" color="text.secondary">
          {formatJoinDate(user.registrationDate)}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility sx={{ fontSize: "14px !important" }} />}
            onClick={() => onViewDetails(user)}
            sx={{
              borderColor: "var(--color-info-blue-border)",
              color: "var(--color-info-blue)",
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.75rem",
              py: 0.4,
              px: 1.25,
              minWidth: 0,
              "&:hover": {
                borderColor: "var(--color-info-blue)",
                bgcolor: "var(--color-info-blue-muted)",
                color: "var(--color-light-blue)",
              },
            }}
          >
            Review
          </Button>

          <Select
            size="small"
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            renderValue={(v) => (
              <Typography
                sx={{
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  color: statusCol,
                  lineHeight: 1,
                }}
              >
                {v as string}
              </Typography>
            )}
            sx={{
              height: 28,
              minWidth: 110,
              borderRadius: 1.5,
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: `${statusCol}55`,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: `${statusCol}99`,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: statusCol,
              },
              ".MuiSvgIcon-root": { color: statusCol, fontSize: 18 },
              ".MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                py: "0 !important",
                pr: "28px !important",
                pl: "10px !important",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "var(--bg-elevated)",
                  border: "1px solid var(--color-olive-muted-strong)",
                  borderRadius: 2,
                  minWidth: 150,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.55)",
                  mt: 0.5,
                },
              },
            }}
          >
            {(["Pending", "Active", "Inactive", "Suspended"] as const).map(
              (s) => (
                <MenuItem
                  key={s}
                  value={s}
                  disabled={s === currentStatus}
                  sx={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: statusColor[s],
                    gap: 1,
                    opacity: s === currentStatus ? 0.4 : 1,
                    "&:hover": { bgcolor: `${statusColor[s]}18` },
                    "&.Mui-selected": { bgcolor: `${statusColor[s]}12` },
                  }}
                >
                  {s === "Pending" && <Pending sx={{ fontSize: 15 }} />}
                  {s === "Active" && <CheckCircle sx={{ fontSize: 15 }} />}
                  {s === "Inactive" && <PersonOff sx={{ fontSize: 15 }} />}
                  {s === "Suspended" && <Block sx={{ fontSize: 15 }} />}
                  {s}
                </MenuItem>
              ),
            )}
          </Select>
          {user.role !== "superadmin" && (
            <Tooltip title="Delete User">
              <IconButton
                size="small"
                onClick={() => onRequestAction("delete", user)}
                sx={{
                  color: "#ef4444",
                  border: "1px solid #ef444455",
                  borderRadius: 1.5,
                  p: 0.5,
                  "&:hover": {
                    bgcolor: "#ef444418",
                    borderColor: "#ef4444",
                  },
                }}
              >
                <DeleteForever sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
