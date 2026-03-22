import type { ApiUserDetail } from "@/services/admin.service";
import type { GlobalUser } from "@/types/admin.types";
import {
  Badge as BadgeIcon,
  CalendarMonth,
  CheckCircle,
  Close,
  Home,
  PhoneAndroid,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  formatJoinDate,
  getAvatarColor,
  getInitials,
} from "../../utils/userManagement.utils";
import DocumentsTab from "./DocumentsTab";
import PersonalInfoTab from "./PersonalInfoTab";
import RoleDetailsTab from "./RoleDetailsTab";

interface UserDetailDialogProps {
  open: boolean;
  selectedUser: GlobalUser | null;
  userDetail: ApiUserDetail | null;
  detailLoading: boolean;
  detailTab: number;
  onTabChange: (tab: number) => void;
  onClose: () => void;
}

const UserDetailDialog = ({
  open,
  selectedUser,
  userDetail,
  detailLoading,
  detailTab,
  onTabChange,
  onClose,
}: UserDetailDialogProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="md"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 3,
        bgcolor: "var(--bg-overlay)",
        border: "1px solid var(--border-medium)",
        overflow: "hidden",
        height: "88vh",
        maxHeight: 840,
      },
    }}
  >
    {selectedUser && (
      <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            background:
              "linear-gradient(160deg, #0d0d0d 0%, #1a1a1a 55%, #111111 100%)",
            display: "flex",
            flexDirection: "column",
            p: 3,
            position: "relative",
            overflow: "hidden",
            borderRight: "1px solid var(--bg-active)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 240,
              height: 240,
              borderRadius: "50%",
              bgcolor: "var(--surface-tint)",
              top: -90,
              right: -90,
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 150,
              height: 150,
              borderRadius: "50%",
              bgcolor: "var(--surface-tint)",
              bottom: 160,
              left: -65,
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2.5,
              mt: 1,
              position: "relative",
            }}
          >
            {(() => {
              const pp = userDetail?.personalInfo?.profilePicture;
              const picUrl =
                typeof pp === "object" && pp !== null
                  ? (pp as { url?: string }).url
                  : typeof pp === "string"
                    ? pp
                    : undefined;
              return (
                <Avatar
                  src={picUrl || undefined}
                  sx={{
                    width: 88,
                    height: 88,
                    bgcolor: getAvatarColor(selectedUser.fullName),
                    fontWeight: 700,
                    fontSize: "1.6rem",
                    border: "3px solid rgba(255,255,255,0.2)",
                    boxShadow:
                      "0 8px 28px rgba(0,0,0,0.6), 0 0 0 6px rgba(255,255,255,0.06)",
                  }}
                >
                  {getInitials(selectedUser.fullName)}
                </Avatar>
              );
            })()}
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 700,
                mt: 1.5,
                textAlign: "center",
                lineHeight: 1.25,
              }}
            >
              {selectedUser.fullName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.5)",
                mt: 0.25,
                fontSize: "0.72rem",
                textAlign: "center",
                wordBreak: "break-all",
              }}
            >
              {selectedUser.email}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 0.75,
                mt: 1.25,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Chip
                label={
                  selectedUser.role.charAt(0).toUpperCase() +
                  selectedUser.role.slice(1)
                }
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  fontWeight: 600,
                  height: 22,
                  fontSize: "0.72rem",
                }}
              />
              <Chip
                label={
                  userDetail?.status?.toUpperCase() !== "ACTIVE" &&
                  userDetail?.statues !== "ACTIVE"
                    ? "Pending"
                    : userDetail?.status ||
                      (selectedUser.isVerified ? "Active" : "Pending")
                }
                size="small"
                sx={{
                  bgcolor:
                    userDetail?.status?.toUpperCase() !== "ACTIVE" &&
                    userDetail?.statues !== "ACTIVE"
                      ? "var(--color-amber-muted)"
                      : "var(--color-brand-muted)",
                  color:
                    userDetail?.status?.toUpperCase() !== "ACTIVE" &&
                    userDetail?.statues !== "ACTIVE"
                      ? "var(--color-amber)"
                      : "var(--color-brand-primary)",
                  fontWeight: 600,
                  height: 22,
                  fontSize: "0.72rem",
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 2 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
              flex: 1,
            }}
          >
            {[
              {
                icon: <PhoneAndroid sx={{ fontSize: 15 }} />,
                label: "PHONE",
                value: selectedUser.phoneNumber || "N/A",
              },
              {
                icon: <BadgeIcon sx={{ fontSize: 15 }} />,
                label: "NIC NUMBER",
                value:
                  userDetail?.personalInfo?.nicNumber ||
                  userDetail?.nic ||
                  selectedUser.nic ||
                  "N/A",
              },
              {
                icon: <CalendarMonth sx={{ fontSize: 15 }} />,
                label: "REGISTERED",
                value: formatJoinDate(selectedUser.registrationDate),
              },
              ...(selectedUser.address
                ? [
                    {
                      icon: <Home sx={{ fontSize: 15 }} />,
                      label: "ADDRESS",
                      value: selectedUser.address,
                    },
                  ]
                : []),
            ].map((row) => (
              <Box
                key={row.label}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}
              >
                <Box
                  sx={{
                    color: "var(--text-on-dark)",
                    display: "flex",
                    mt: 0.15,
                  }}
                >
                  {row.icon}
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "var(--text-on-dark)",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      letterSpacing: 0.7,
                    }}
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {row.value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            sx={{ mt: 2, pt: 2, borderTop: "1px solid var(--surface-light)" }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "var(--text-on-dark)",
                fontWeight: 700,
                letterSpacing: 0.9,
                fontSize: "0.65rem",
              }}
            >
              VERIFICATION
            </Typography>
            <Box
              sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.6 }}
            >
              {(["email", "phone"] as const).map((field) => {
                const verified =
                  selectedUser.verificationStatus[field] === "verified";
                return (
                  <Box
                    key={field}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Typography>
                    <Chip
                      icon={
                        <CheckCircle
                          sx={{
                            fontSize: "14px !important",
                            color: verified
                              ? "var(--color-brand-primary)"
                              : "var(--text-tertiary)",
                          }}
                        />
                      }
                      label={verified ? "Verified" : "Pending"}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.67rem",
                        fontWeight: 600,
                        bgcolor: verified
                          ? "var(--color-brand-muted)"
                          : "var(--bg-active)",
                        color: verified
                          ? "var(--color-brand-primary)"
                          : "var(--text-tertiary)",
                        "& .MuiChip-icon": { ml: 0.5 },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "var(--bg-overlay)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 2,
              color: "rgba(255,255,255,0.5)",
              "&:hover": { color: "white" },
            }}
          >
            <Close fontSize="small" />
          </IconButton>

          <Box
            sx={{
              px: 3,
              pt: 2.5,
              pb: 0,
              borderBottom: "1px solid var(--surface-light)",
              flexShrink: 0,
            }}
          >
            <Tabs
              value={detailTab}
              onChange={(_e, v) => onTabChange(v)}
              sx={{
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.85rem",
                  minWidth: 0,
                  px: 0,
                  mr: 3.5,
                  textTransform: "none",
                  fontWeight: 500,
                  pb: 1.5,
                },
                "& .Mui-selected": {
                  color: "white !important",
                  fontWeight: 700,
                },
                "& .MuiTabs-indicator": {
                  bgcolor: "rgba(255,255,255,0.85)",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                minHeight: 44,
              }}
            >
              <Tab label="Personal Info" />
              <Tab
                label={
                  selectedUser.role === "farmer"
                    ? "Farmer Details"
                    : selectedUser.role === "investor"
                      ? "Investor Details"
                      : selectedUser.role === "landowner"
                        ? "Landowner Details"
                        : "Role Details"
                }
              />
              <Tab label="Documents" />
            </Tabs>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {detailLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={32} />
              </Box>
            )}

            {!detailLoading && (
              <>
                {detailTab === 0 && (
                  <PersonalInfoTab
                    selectedUser={selectedUser}
                    userDetail={userDetail}
                  />
                )}
                {detailTab === 1 && (
                  <RoleDetailsTab
                    selectedUser={selectedUser}
                    userDetail={userDetail}
                  />
                )}
                {detailTab === 2 && (
                  <DocumentsTab
                    selectedUser={selectedUser}
                    userDetail={userDetail}
                  />
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    )}
  </Dialog>
);

export default UserDetailDialog;
