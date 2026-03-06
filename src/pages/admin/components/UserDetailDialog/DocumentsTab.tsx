import type { ApiUserDetail } from "@/services/admin.service";
import type { GlobalUser } from "@/types/admin.types";
import { CheckCircle, Image as ImageIcon, Pending } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";

interface DocumentsTabProps {
  selectedUser: GlobalUser;
  userDetail: ApiUserDetail | null;
}

interface DocSlotProps {
  label: string;
  url?: string;
  accentColor?: string;
  accentBg?: string;
}

const DocSlot = ({
  label,
  url,
  accentColor = "var(--color-info)",
  accentBg = "var(--color-info-bg)",
}: DocSlotProps) => (
  <Box
    sx={{
      flex: 1,
      aspectRatio: "4/3",
      border: url ? "none" : "2px dashed var(--surface-light)",
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      p: 2,
      bgcolor: "var(--surface-tint)",
      overflow: "hidden",
    }}
  >
    {url ? (
      <Box
        component="img"
        src={url}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 1,
        }}
      />
    ) : (
      <>
        <Box
          sx={{
            bgcolor: accentBg,
            p: 1.25,
            borderRadius: 1.5,
            color: accentColor,
          }}
        >
          <ImageIcon fontSize="small" />
        </Box>
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
        >
          {label}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.7rem" }}
        >
          Not uploaded
        </Typography>
      </>
    )}
  </Box>
);

interface DocSectionProps {
  title: string;
  description: string;
}
const DocSection = ({ title, description }: DocSectionProps) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: "var(--bg-hover)",
      border: "1px solid var(--bg-active)",
      mb: 1.5,
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
      {title}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

const DocumentsTab = ({ selectedUser, userDetail }: DocumentsTabProps) => {
  const nicFrontUrl =
    userDetail?.personalInfo?.nicFrontImage?.url ||
    (userDetail?.landOwnerDetails as { nicImages?: Array<{ url?: string }> })
      ?.nicImages?.[0]?.url ||
    (userDetail?.farmerDetails as { nicImages?: Array<{ url?: string }> })
      ?.nicImages?.[0]?.url ||
    (userDetail?.investorDetails as { nicImages?: Array<{ url?: string }> })
      ?.nicImages?.[0]?.url ||
    userDetail?.documents?.nicFiles?.[0]?.fileData ||
    userDetail?.documents?.nicFiles?.[0]?.url;

  const nicBackUrl =
    userDetail?.personalInfo?.nicBackImage?.url ||
    (userDetail?.landOwnerDetails as { nicImages?: Array<{ url?: string }> })
      ?.nicImages?.[1]?.url ||
    (userDetail?.farmerDetails as { nicImages?: Array<{ url?: string }> })
      ?.nicImages?.[1]?.url ||
    (userDetail?.investorDetails as { nicImages?: Array<{ url?: string }> })
      ?.nicImages?.[1]?.url ||
    userDetail?.documents?.nicFiles?.[1]?.fileData ||
    userDetail?.documents?.nicFiles?.[1]?.url;

  const lo = userDetail?.landOwnerDetails as
    | {
        landAddress?: {
          bimsaviyaCertificate?: { url?: string };
          landImages?: Array<{ url?: string }>;
        };
      }
    | undefined;
  const bimsaviyaUrl = lo?.landAddress?.bimsaviyaCertificate?.url;
  const landImgUrl = lo?.landAddress?.landImages?.[0]?.url;

  const fd = (userDetail?.farmer || userDetail?.farmerDetails) as
    | {
        GovijanaSevaPassbookImage?: { url?: string };
        govijanaSevaPassbook?: { url?: string };
        gnCertificateImage?: { url?: string };
        gnCertificate?: { url?: string };
      }
    | undefined;
  const passbookUrl =
    fd?.GovijanaSevaPassbookImage?.url || fd?.govijanaSevaPassbook?.url;
  const gnCertUrl = fd?.gnCertificateImage?.url || fd?.gnCertificate?.url;

  const inv = userDetail?.investorDetails as
    | {
        businessRegistration?: { url?: string };
      }
    | undefined;
  const bizRegUrl = inv?.businessRegistration?.url;

  const verificationItems = [
    { label: "Email Address", status: selectedUser.verificationStatus.email },
    { label: "Phone Number", status: selectedUser.verificationStatus.phone },
    { label: "NIC Front", status: nicFrontUrl ? "verified" : "pending" },
    { label: "NIC Back", status: nicBackUrl ? "verified" : "pending" },
  ];

  return (
    <Box sx={{ p: 2.5 }}>
      <DocSection
        title="NIC Documents"
        description="Upload clear scans of both sides of the National Identity Card."
      />
      <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
        <DocSlot
          label="NIC Front Side"
          url={nicFrontUrl}
          accentColor="var(--color-info)"
          accentBg="var(--color-info-bg)"
        />
        <DocSlot
          label="NIC Back Side"
          url={nicBackUrl}
          accentColor="var(--color-info)"
          accentBg="var(--color-info-bg)"
        />
      </Box>

      {selectedUser.role === "landowner" && (
        <>
          <DocSection
            title="Bimsaviya Certificate"
            description="Land ownership certificate issued by the Survey Department."
          />
          <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
            <DocSlot
              label="Bimsaviya Certificate"
              url={bimsaviyaUrl}
              accentColor="var(--color-amber)"
              accentBg="var(--color-amber-muted)"
            />
          </Box>
          {landImgUrl && (
            <>
              <DocSection
                title="Land Images"
                description="Photos of the land provided by the landowner."
              />
              <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
                <Box
                  sx={{
                    flex: 1,
                    aspectRatio: "4/3",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "var(--surface-tint)",
                    border: "1px solid var(--bg-active)",
                  }}
                >
                  <Box
                    component="img"
                    src={landImgUrl}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </Box>
            </>
          )}
        </>
      )}

      {selectedUser.role === "farmer" && (
        <>
          <DocSection
            title="Govijana Seva Passbook"
            description="Govijana Seva registration passbook from the Department of Agriculture."
          />
          <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
            <DocSlot
              label="Passbook Image"
              url={passbookUrl}
              accentColor="var(--color-brand-primary)"
              accentBg="var(--color-brand-muted)"
            />
          </Box>
          <DocSection
            title="Grama Niladhari Certificate"
            description="Certificate issued by the Grama Niladhari confirming farming activity."
          />
          <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
            <DocSlot
              label="GN Certificate"
              url={gnCertUrl}
              accentColor="var(--color-amber)"
              accentBg="var(--color-amber-muted)"
            />
          </Box>
        </>
      )}

      {selectedUser.role === "investor" && bizRegUrl && (
        <>
          <DocSection
            title="Business Registration"
            description="Business registration certificate for the investor's organization."
          />
          <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
            <Box
              sx={{
                flex: 1,
                aspectRatio: "4/3",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "var(--surface-tint)",
                border: "1px solid var(--bg-active)",
              }}
            >
              <Box
                component="img"
                src={bizRegUrl}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Box>
        </>
      )}

      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>
        Verification Status
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {verificationItems.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1.25,
              borderRadius: 2,
              bgcolor: "var(--bg-hover)",
              border:
                item.status === "verified"
                  ? "1px solid var(--color-brand-border)"
                  : "1px solid var(--bg-active)",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {item.label}
            </Typography>
            <Chip
              icon={
                item.status === "verified" ? (
                  <CheckCircle sx={{ fontSize: "14px !important" }} />
                ) : (
                  <Pending sx={{ fontSize: "14px !important" }} />
                )
              }
              label={item.status === "verified" ? "Verified" : "Pending"}
              size="small"
              sx={{
                bgcolor:
                  item.status === "verified"
                    ? "var(--color-brand-muted)"
                    : "var(--bg-active)",
                color:
                  item.status === "verified"
                    ? "var(--color-brand-primary)"
                    : "text.secondary",
                fontWeight: 600,
                height: 24,
                fontSize: "0.72rem",
                "& .MuiChip-icon": {
                  color:
                    item.status === "verified"
                      ? "var(--color-brand-primary)"
                      : "text.secondary",
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DocumentsTab;
