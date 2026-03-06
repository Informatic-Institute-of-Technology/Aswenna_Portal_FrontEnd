import type { ApiUserDetail } from "@/services/admin.service";
import type { GlobalUser } from "@/types/admin.types";
import {
  Agriculture,
  Badge as BadgeIcon,
  DirectionsBike,
  Home,
  Landscape,
  LocationOn,
  PhoneAndroid,
  School,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import InfoRow from "../InfoRow";

interface RoleDetailsTabProps {
  selectedUser: GlobalUser;
  userDetail: ApiUserDetail | null;
}

interface FieldItem {
  label: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
}

interface FieldPairBoxProps {
  items: [FieldItem, FieldItem];
}

const FieldPairBox = ({ items }: FieldPairBoxProps) => (
  <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
    {items.map((item) => (
      <Box
        key={item.label}
        sx={{
          flex: 1,
          p: 1.5,
          borderRadius: 2,
          bgcolor: "var(--bg-hover)",
          border: "1px solid var(--bg-active)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Box
            sx={{
              color: item.color || "var(--text-on-dark)",
              display: "flex",
            }}
          >
            {item.icon || <LocationOn sx={{ fontSize: 18 }} />}
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
            {item.label}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, pl: 3.5 }}>
          {item.value}
        </Typography>
      </Box>
    ))}
  </Box>
);

const RoleDetailsTab = ({ selectedUser, userDetail }: RoleDetailsTabProps) => (
  <Box sx={{ p: 2.5 }}>
    {selectedUser.role === "farmer" && (
      <>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "var(--color-brand-muted)",
            border: "1px solid var(--color-brand-border)",
            mb: 2.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "var(--color-brand-primary)",
              fontWeight: 700,
              letterSpacing: 0.8,
              fontSize: "0.7rem",
            }}
          >
            FARMER PROFILE
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "white", fontWeight: 700, mt: 0.5 }}
          >
            Govijana Seva ID:{" "}
            {userDetail?.farmerDetails?.govijanaSevaId || "N/A"}
          </Typography>
        </Box>

        <FieldPairBox
          items={[
            {
              label: "DS DIVISION",
              value: userDetail?.farmerDetails?.dsDivision || "N/A",
            },
            {
              label: "GN DIVISION",
              value: userDetail?.farmerDetails?.gnDivision || "N/A",
            },
          ]}
        />

        <InfoRow
          icon={
            <Agriculture
              sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
            />
          }
          label="CROP TYPES"
          value={
            userDetail?.farmingInfo?.selectedCrops?.length
              ? userDetail.farmingInfo.selectedCrops.join(", ")
              : userDetail?.farmerDetails?.crop || "N/A"
          }
        />
        <InfoRow
          icon={
            <School
              sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
            />
          }
          label="EXPERIENCE"
          value={userDetail?.farmerDetails?.experience || "N/A"}
        />
        <InfoRow
          icon={
            <LocationOn
              sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
            />
          }
          label="ACTIVE REGIONS"
          value={userDetail?.farmerDetails?.regions || "N/A"}
        />
        <InfoRow
          icon={
            <DirectionsBike
              sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
            />
          }
          label="SPECIFIC NEEDS"
          value={userDetail?.farmerDetails?.specificNeeds || "N/A"}
        />
      </>
    )}

    {selectedUser.role === "investor" && (
      <>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "var(--color-info-blue-muted)",
            border: "1px solid var(--color-info-blue-border)",
            mb: 2.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "var(--color-light-blue)",
              fontWeight: 700,
              letterSpacing: 0.8,
              fontSize: "0.7rem",
            }}
          >
            ORGANISATION PROFILE
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "white", fontWeight: 700, mt: 0.5 }}
          >
            {userDetail?.investorDetails?.organizationName || "N/A"}
          </Typography>
          {userDetail?.investorDetails?.registrationNo && (
            <Typography
              variant="caption"
              sx={{
                color: "var(--color-light-blue)",
                mt: 0.5,
                display: "block",
              }}
            >
              Reg. No: {userDetail.investorDetails.registrationNo}
            </Typography>
          )}
        </Box>

        <FieldPairBox
          items={[
            {
              label: "DS DIVISION",
              value: userDetail?.investorDetails?.dsDivision || "N/A",
            },
            {
              label: "GN DIVISION",
              value: userDetail?.investorDetails?.gnDivision || "N/A",
            },
          ]}
        />

        <InfoRow
          icon={<Home sx={{ fontSize: 18 }} />}
          label="COMPANY ADDRESS"
          value={userDetail?.investorDetails?.companyAddress || "N/A"}
        />
        <InfoRow
          icon={<PhoneAndroid sx={{ fontSize: 18 }} />}
          label="ORG. PHONE"
          value={userDetail?.investorDetails?.organizationPhoneNumber || "N/A"}
        />
        <InfoRow
          icon={<BadgeIcon sx={{ fontSize: 18 }} />}
          label="REGISTRATION NO."
          value={userDetail?.investorDetails?.registrationNo || "N/A"}
        />
        <InfoRow
          icon={<Agriculture sx={{ fontSize: 18 }} />}
          label="CROP FOCUS"
          value={userDetail?.investorDetails?.cropFocus || "N/A"}
        />
      </>
    )}

    {selectedUser.role === "landowner" && (
      <>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "var(--color-amber-muted)",
            border: "1px solid var(--color-pending-border)",
            mb: 2.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "var(--color-amber)",
              fontWeight: 700,
              letterSpacing: 0.8,
              fontSize: "0.7rem",
            }}
          >
            LAND RECORD
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "white", fontWeight: 700, mt: 0.5 }}
          >
            {[
              userDetail?.landOwnerDetails?.landAddress?.size
                ? `${userDetail.landOwnerDetails.landAddress.size} hectares`
                : null,
              userDetail?.landOwnerDetails?.landAddress?.soilType || null,
            ]
              .filter(Boolean)
              .join(" · ") || "N/A"}
          </Typography>
        </Box>

        <FieldPairBox
          items={[
            {
              label: "DS DIVISION",
              value: userDetail?.landOwnerDetails?.dsDivision || "N/A",
              color: "var(--color-amber)",
            },
            {
              label: "GN DIVISION",
              value: userDetail?.landOwnerDetails?.gnDivision || "N/A",
              color: "var(--color-amber)",
            },
          ]}
        />

        <InfoRow
          icon={<Home sx={{ fontSize: 18 }} />}
          label="LAND ADDRESS"
          value={userDetail?.landOwnerDetails?.landAddress?.street || "N/A"}
        />

        <FieldPairBox
          items={[
            {
              label: "PROVINCE",
              value:
                userDetail?.landOwnerDetails?.landAddress?.province || "N/A",
              color: "var(--color-amber)",
            },
            {
              label: "POSTAL CODE",
              value:
                userDetail?.landOwnerDetails?.landAddress?.postalCode || "N/A",
              color: "var(--color-amber)",
            },
          ]}
        />

        <FieldPairBox
          items={[
            {
              label: "LAND SIZE",
              value: userDetail?.landOwnerDetails?.landAddress?.size
                ? `${userDetail.landOwnerDetails.landAddress.size} hectares`
                : "N/A",
              color: "var(--color-amber)",
              icon: <Landscape sx={{ fontSize: 18 }} />,
            },
            {
              label: "SOIL TYPE",
              value:
                userDetail?.landOwnerDetails?.landAddress?.soilType || "N/A",
              color: "var(--color-amber)",
              icon: <Agriculture sx={{ fontSize: 18 }} />,
            },
          ]}
        />

        <InfoRow
          icon={<BadgeIcon sx={{ fontSize: 18 }} />}
          label="RENTAL EXPECTATION"
          value={
            userDetail?.landOwnerDetails?.landAddress?.rentalExpectation
              ? `Rs. ${Number(userDetail.landOwnerDetails.landAddress.rentalExpectation).toLocaleString()} per month`
              : "N/A"
          }
        />

        {userDetail?.landOwnerDetails?.location && (
          <InfoRow
            icon={<LocationOn sx={{ fontSize: 18 }} />}
            label="GPS COORDINATES"
            value={`Lat: ${userDetail.landOwnerDetails.location.latitude.toFixed(4)}  Lng: ${userDetail.landOwnerDetails.location.longitude.toFixed(4)}`}
          />
        )}
      </>
    )}

    {!userDetail && (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", py: 4 }}
      >
        No role details available
      </Typography>
    )}
  </Box>
);

export default RoleDetailsTab;
