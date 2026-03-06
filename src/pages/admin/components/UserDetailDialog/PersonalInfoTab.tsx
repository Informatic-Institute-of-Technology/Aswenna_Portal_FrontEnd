import type { ApiUserDetail } from "@/services/admin.service";
import type { GlobalUser } from "@/types/admin.types";
import {
  Badge as BadgeIcon,
  Cake,
  CalendarMonth,
  CheckCircle,
  Email,
  Home,
  LocationOn,
  PhoneAndroid,
  Wc,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import InfoRow from "../InfoRow";
import { formatJoinDate } from "../../utils/userManagement.utils";

interface PersonalInfoTabProps {
  selectedUser: GlobalUser;
  userDetail: ApiUserDetail | null;
}

interface FieldPairProps {
  label1: string;
  value1: string;
  label2: string;
  value2: string;
  icon?: React.ReactNode;
}

const FieldPair = ({
  label1,
  value1,
  label2,
  value2,
  icon,
}: FieldPairProps) => (
  <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
    {[
      { label: label1, value: value1 },
      { label: label2, value: value2 },
    ].map((f) => (
      <Box
        key={f.label}
        sx={{
          flex: 1,
          p: 1.5,
          borderRadius: 2,
          bgcolor: "var(--bg-hover)",
          border: "1px solid var(--bg-active)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Box sx={{ color: "var(--text-on-dark)", display: "flex" }}>
            {icon || <LocationOn sx={{ fontSize: 18 }} />}
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              letterSpacing: 0.7,
              fontSize: "0.68rem",
            }}
          >
            {f.label}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, pl: 3.5 }}>
          {f.value}
        </Typography>
      </Box>
    ))}
  </Box>
);

const PersonalInfoTab = ({
  selectedUser,
  userDetail,
}: PersonalInfoTabProps) => {
  const isRoleUser =
    selectedUser.role === "investor" ||
    selectedUser.role === "farmer" ||
    selectedUser.role === "landowner";

  return (
    <Box sx={{ p: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 1.5,
          borderRadius: 2,
          bgcolor: "var(--bg-hover)",
          border: "1px solid var(--surface-light)",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CheckCircle sx={{ color: "var(--text-secondary)", fontSize: 16 }} />
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}
          >
            Email Verified
          </Typography>
        </Box>
        {selectedUser.verificationStatus.phone === "verified" && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CheckCircle
              sx={{ color: "var(--color-brand-primary)", fontSize: 16 }}
            />
            <Typography
              variant="caption"
              sx={{ color: "var(--color-brand-primary)", fontWeight: 600 }}
            >
              Phone Verified
            </Typography>
          </Box>
        )}
      </Box>

      <InfoRow
        icon={<Email sx={{ fontSize: 18 }} />}
        label="EMAIL ADDRESS"
        value={selectedUser.email}
      />
      <InfoRow
        icon={<PhoneAndroid sx={{ fontSize: 18 }} />}
        label="PHONE NUMBER"
        value={
          userDetail?.phoneNumber ||
          userDetail?.personalInfo?.phoneNumber ||
          selectedUser.phoneNumber ||
          "N/A"
        }
      />
      <InfoRow
        icon={<BadgeIcon sx={{ fontSize: 18 }} />}
        label="NIC NUMBER"
        value={
          userDetail?.personalInfo?.nicNumber ||
          userDetail?.nic ||
          selectedUser.nic ||
          "N/A"
        }
      />

      <FieldPair
        label1="GENDER"
        value1={userDetail?.personalInfo?.gender || "N/A"}
        label2="AGE"
        value2={
          userDetail?.personalInfo?.age
            ? `${userDetail.personalInfo.age} years`
            : "N/A"
        }
        icon={<Wc sx={{ fontSize: 18 }} />}
      />

      <InfoRow
        icon={<Cake sx={{ fontSize: 18 }} />}
        label="BIRTHDAY"
        value={
          userDetail?.personalInfo?.birthday
            ? new Date(userDetail.personalInfo.birthday).toLocaleDateString(
                "en-GB",
                { day: "numeric", month: "long", year: "numeric" },
              )
            : "N/A"
        }
      />
      <InfoRow
        icon={<Home sx={{ fontSize: 18 }} />}
        label="ADDRESS"
        value={
          userDetail?.personalInfo?.address ||
          userDetail?.address ||
          selectedUser.address ||
          "N/A"
        }
      />

      {!isRoleUser && (
        <FieldPair
          label1="CITY"
          value1={userDetail?.personalInfo?.city || "N/A"}
          label2="DISTRICT"
          value2={userDetail?.personalInfo?.district || "N/A"}
        />
      )}

      <FieldPair
        label1="PROVINCE"
        value1={userDetail?.personalInfo?.province || "N/A"}
        label2="POSTAL CODE"
        value2={userDetail?.personalInfo?.postalCode || "N/A"}
      />

      {!isRoleUser && (
        <FieldPair
          label1="DS DIVISION"
          value1={userDetail?.personalInfo?.dsDivision || "N/A"}
          label2="GN DIVISION"
          value2={userDetail?.personalInfo?.gnDivision || "N/A"}
        />
      )}

      <InfoRow
        icon={<CalendarMonth sx={{ fontSize: 18 }} />}
        label="REGISTERED"
        value={formatJoinDate(selectedUser.registrationDate)}
      />
    </Box>
  );
};

export default PersonalInfoTab;
