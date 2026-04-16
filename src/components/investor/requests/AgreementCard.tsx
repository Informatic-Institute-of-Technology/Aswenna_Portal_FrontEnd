import {
  Agriculture,
  AttachMoney,
  CalendarToday,
  CheckCircleOutline,
  Description,
  FileUpload,
  Handshake,
  Landscape,
  LocationOn,
  TrendingUp,
  Verified,
  Warning,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

export interface AgreementCardData {
  id: string;
  projectId?: string;
  investorId?: string;
  counterpartyId?: string;
  landownerProjectId?: string;
  investorEmail?: string;
  counterpartyEmail?: string;
  counterpartyPhone?: string;
  partyType: "farmer" | "landowner";
  investorName?: string;
  farmerPartyName?: string;
  landownerPartyName?: string;
  partyName: string;
  partyAvatar: string | null;
  partyInitials: string;
  partyRole: string;
  isVerified?: boolean;
  projectTitle: string;
  cropType: string;
  location: string;
  offerType: "direct-harvest" | "sponsorship";
  totalBudget?: number;
  currency?: string;
  expectedROI?: number;
  expiresAt?: string;
  submittedAt: string;
  startDate?: string;
  expectedCompletionDate?: string;

  milestoneBreakdown?: {
    title: string;
    estimatedAmount: number;
    paymentOverDueDate: string;
    startDate: string;
    endDate: string;
  }[];

  agreementStatus: "awaiting-signature" | "under-review" | "ready-to-sign";

  progressPercent: number;
  progressLabel: string;
  totalMilestones?: number;
  completedMilestones?: number;
  pendingMilestones?: number;
  disbursedAmount?: number;
  remainingBalance?: number;

  onUploadAgreement: (card?: AgreementCardData) => void;
  onViewDetails: () => void;
  isSelected?: boolean;
  highlighted?: boolean;
}

const STATUS_CONFIG = {
  "awaiting-signature": {
    text: "#FBBF24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.3)",
    label: "Awaiting Signature",
    Icon: Warning,
  },
  "under-review": {
    text: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.3)",
    label: "Under Review",
    Icon: Description,
  },
  "ready-to-sign": {
    text: "#34D399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
    label: "Ready to Sign",
    Icon: CheckCircleOutline,
  },
};

const formatCurrency = (amount: number, currency = "LKR") => {
  if (amount >= 1_000_000)
    return `${currency} ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${currency} ${(amount / 1_000).toFixed(0)}K`;
  return `${currency} ${amount.toLocaleString()}`;
};

const ACCENT = "#aed95c";
const ACCENT_DIM = "rgba(174,217,92,0.1)";
const ACCENT_BORDER = "rgba(174,217,92,0.25)";

const AgreementCard = (cardData: AgreementCardData) => {
  const {
    partyType,
    partyName,
    partyAvatar,
    partyInitials,
    partyRole,
    isVerified,
    projectTitle,
    cropType,
    location,
    offerType,
    totalBudget,
    currency = "LKR",
    expectedROI,
    expiresAt,
    submittedAt,
    agreementStatus,
    onUploadAgreement,
    onViewDetails,
    isSelected = false,
  } = cardData;

  const statusCfg = STATUS_CONFIG[agreementStatus];
  const StatusIcon = statusCfg.Icon;
  const isFarmer = partyType === "farmer";

  const showBudget = typeof totalBudget === "number" && totalBudget > 0;
  const showROI = typeof expectedROI === "number" && expectedROI > 0;
  const showFinancials = showBudget || showROI || !!expiresAt;

  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: isSelected
          ? "linear-gradient(145deg, rgba(174,217,92,0.06) 0%, #111113 100%)"
          : "#111113",
        border: "1px solid",
        borderColor: isSelected
          ? "rgba(174,217,92,0.35)"
          : "rgba(255,255,255,0.07)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        "&:hover": {
          borderColor: "rgba(255,255,255,0.14)",
          transform: "translateY(-2px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
        },
        position: "relative",
      }}
      onClick={onViewDetails}
    >
      
      <Box
        sx={{
          height: 3,
          background:
            "linear-gradient(90deg, #85a446 0%, #aed95c 55%, transparent 100%)",
        }}
      />

      
      <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            {partyAvatar ? (
              <Avatar src={partyAvatar} sx={{ width: 46, height: 46 }} />
            ) : (
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  background:
                    "linear-gradient(135deg, #1e3a14 0%, #2d5a1e 100%)",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: ACCENT,
                  border: `1.5px solid ${ACCENT_BORDER}`,
                }}
              >
                {partyInitials}
              </Avatar>
            )}
            
            <Box
              sx={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: ACCENT_DIM,
                border: `1.5px solid ${ACCENT_BORDER}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isFarmer ? (
                <Agriculture sx={{ fontSize: 10, color: ACCENT }} />
              ) : (
                <Landscape sx={{ fontSize: 10, color: ACCENT }} />
              )}
            </Box>
          </Box>

          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.2 }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 800,
                  color: "#F4F4F5",
                  fontSize: "0.9rem",
                  lineHeight: 1.2,
                }}
                noWrap
              >
                {partyName}
              </Typography>
              {isVerified && (
                <Tooltip title="Verified">
                  <Verified
                    sx={{ fontSize: 14, color: "#85a446", flexShrink: 0 }}
                  />
                </Tooltip>
              )}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: ACCENT,
                fontWeight: 700,
                fontSize: "0.68rem",
                letterSpacing: 0.5,
              }}
            >
              {partyRole}
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: 0.3 }}
            >
              <LocationOn sx={{ fontSize: 11, color: "#52525B" }} />
              <Typography
                variant="caption"
                sx={{ color: "#71717A", fontSize: "0.68rem", fontWeight: 500 }}
                noWrap
              >
                {location}
              </Typography>
            </Box>
          </Box>

          
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.25,
              py: 0.55,
              borderRadius: 2,
              background: statusCfg.bg,
              border: `1px solid ${statusCfg.border}`,
              flexShrink: 0,
            }}
          >
            <StatusIcon sx={{ fontSize: 12, color: statusCfg.text }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: statusCfg.text,
                fontSize: "0.63rem",
                whiteSpace: "nowrap",
              }}
            >
              {statusCfg.label}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mx: 2.5 }} />

      
      <Box sx={{ px: 2.5, py: 1.5 }}>
        
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "#E4E4E7",
              fontSize: "0.82rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "65%",
            }}
          >
            {projectTitle}
          </Typography>
          <Chip
            label={
              offerType === "direct-harvest" ? "Direct Harvest" : "Sponsorship"
            }
            size="small"
            sx={{
              height: 20,
              fontSize: "0.61rem",
              fontWeight: 700,
              background:
                offerType === "direct-harvest"
                  ? "rgba(52,211,153,0.1)"
                  : "rgba(192,132,252,0.1)",
              color: offerType === "direct-harvest" ? "#34D399" : "#c084fc",
              border: `1px solid ${
                offerType === "direct-harvest"
                  ? "rgba(52,211,153,0.25)"
                  : "rgba(192,132,252,0.25)"
              }`,
            }}
          />
        </Box>

        
        <Stack
          direction="row"
          spacing={0.75}
          flexWrap="wrap"
          sx={{ mb: showFinancials ? 1.25 : 0 }}
        >
          <Chip
            icon={<Agriculture sx={{ fontSize: 11 }} />}
            label={cropType}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.66rem",
              fontWeight: 700,
              background: ACCENT_DIM,
              color: ACCENT,
              border: `1px solid ${ACCENT_BORDER}`,
              "& .MuiChip-icon": { ml: 0.75, color: `${ACCENT} !important` },
            }}
          />
          <Chip
            icon={<Handshake sx={{ fontSize: 10 }} />}
            label={`Investor-${isFarmer ? "Farmer" : "Landowner"} Agreement`}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.66rem",
              fontWeight: 600,
              background: "rgba(255,255,255,0.05)",
              color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.08)",
              "& .MuiChip-icon": { ml: 0.75, color: "#94a3b8 !important" },
            }}
          />
        </Stack>

        
        {showFinancials && (
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              p: 1.25,
              borderRadius: 2,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {showBudget && (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <AttachMoney sx={{ fontSize: 16, color: "#34D399" }} />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#71717A",
                      fontSize: "0.6rem",
                      fontWeight: 500,
                      display: "block",
                    }}
                  >
                    Budget
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#34D399",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                    }}
                  >
                    {formatCurrency(totalBudget!, currency)}
                  </Typography>
                </Box>
              </Box>
            )}
            {showROI && (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <TrendingUp sx={{ fontSize: 16, color: "#c084fc" }} />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#71717A",
                      fontSize: "0.6rem",
                      fontWeight: 500,
                      display: "block",
                    }}
                  >
                    Expected ROI
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#c084fc",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                    }}
                  >
                    {expectedROI}%
                  </Typography>
                </Box>
              </Box>
            )}
            {expiresAt && (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <CalendarToday sx={{ fontSize: 14, color: "#fb923c" }} />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#71717A",
                      fontSize: "0.6rem",
                      fontWeight: 500,
                      display: "block",
                    }}
                  >
                    Expires
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#fb923c",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {expiresAt}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mx: 2.5 }} />

      
      <Box
        sx={{
          px: 2.5,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "#52525B", fontSize: "0.65rem", fontWeight: 500 }}
        >
          {submittedAt}
        </Typography>

        <Stack direction="row" spacing={0.75}>
          <Button
            size="small"
            variant="contained"
            startIcon={<FileUpload sx={{ fontSize: 13 }} />}
            onClick={(e) => {
              e.stopPropagation();
              onUploadAgreement(cardData);
            }}
            sx={{
              fontSize: "0.68rem",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: 1.5,
              py: 0.4,
              px: 1.5,
              minWidth: 0,
              background: "linear-gradient(135deg, #85a446 0%, #aed95c 100%)",
              color: "#fff",
              boxShadow: "0 3px 12px rgba(133,164,70,0.35)",
              "&:hover": {
                boxShadow: "0 5px 18px rgba(133,164,70,0.45)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Upload
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AgreementCard;
