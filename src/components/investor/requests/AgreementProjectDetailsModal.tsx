import {
  AccessTime,
  AttachMoney,
  Close,
  LocationOn,
  Person,
  Timeline,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { AgreementCardData } from "./AgreementCard";

interface AgreementProjectDetailsModalProps {
  open: boolean;
  onClose: () => void;
  agreement: AgreementCardData | null;
}

const fmtLKR = (amount?: number) => {
  if (!amount || amount <= 0) return "LKR 0";
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const AgreementProjectDetailsModal = ({
  open,
  onClose,
  agreement,
}: AgreementProjectDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const derived = useMemo(() => {
    const totalBudget = agreement?.totalBudget ?? 0;
    const progress = agreement?.progressPercent ?? 0;
    const disbursed =
      agreement?.disbursedAmount ?? Math.round(totalBudget * (progress / 100));
    const remaining =
      agreement?.remainingBalance ?? Math.max(totalBudget - disbursed, 0);

    const totalMilestones = agreement?.totalMilestones ?? 8;
    const completedMilestones =
      agreement?.completedMilestones ??
      Math.min(totalMilestones, Math.max(0, Math.round((progress / 100) * totalMilestones)));
    const pendingMilestones =
      agreement?.pendingMilestones ?? Math.max(totalMilestones - completedMilestones, 0);

    return {
      totalBudget,
      disbursed,
      remaining,
      totalMilestones,
      completedMilestones,
      pendingMilestones,
    };
  }, [agreement]);

  if (!agreement) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          background: "#09090B",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 3,
          minHeight: "72vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography sx={{ color: "#f1f5f9", fontWeight: 800, fontSize: "1.8rem" }}>
            {agreement.projectTitle}
          </Typography>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 0.8 }}>
            <Typography sx={{ color: "#71717A", fontWeight: 700 }}>
              {agreement.projectId ?? agreement.id}
            </Typography>
            <Chip
              label="PENDING"
              size="small"
              sx={{
                height: 22,
                bgcolor: "rgba(251,191,36,0.15)",
                color: "#fbbf24",
                border: "1px solid rgba(251,191,36,0.35)",
                fontWeight: 800,
              }}
            />
            <Typography sx={{ color: "#A1A1AA", fontWeight: 600 }}>
              • {agreement.startDate ?? agreement.submittedAt}
            </Typography>
          </Stack>
        </Box>

        <IconButton onClick={onClose} sx={{ color: "#d4d4d8" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            px: 3,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            "& .MuiTab-root": {
              textTransform: "none",
              color: "#71717A",
              fontWeight: 700,
              minHeight: 48,
            },
            "& .Mui-selected": { color: "#f1f5f9 !important" },
            "& .MuiTabs-indicator": { background: "#aed95c" },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Milestones & Progress" />
          <Tab label="Payments & Finance" />
          <Tab label="Team Members" />
        </Tabs>

        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              background: "linear-gradient(135deg, rgba(133,164,70,0.16) 0%, rgba(174,217,92,0.06) 100%)",
              border: "1px solid rgba(174,217,92,0.2)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.3 }}>
              <Box>
                <Typography sx={{ color: "#A1A1AA", fontWeight: 700, fontSize: "0.95rem" }}>
                  OVERALL PROJECT PROGRESS
                </Typography>
                <Typography sx={{ color: "#F4F4F5", fontWeight: 900, fontSize: "2rem", lineHeight: 1 }}>
                  {agreement.progressPercent}% Complete
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ color: "#A1A1AA", fontWeight: 700, fontSize: "0.85rem" }}>
                  Expected Completion
                </Typography>
                <Typography sx={{ color: "#F4F4F5", fontWeight: 800 }}>
                  {agreement.expectedCompletionDate ?? agreement.expiresAt ?? "TBD"}
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={agreement.progressPercent}
              sx={{
                height: 12,
                borderRadius: 99,
                bgcolor: "rgba(255,255,255,0.08)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 99,
                  bgcolor: "#85a446",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                background: "#111113",
                border: "1px solid rgba(255,255,255,0.07)",
                minHeight: 220,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <AttachMoney sx={{ color: "#f1f5f9" }} />
                <Typography sx={{ color: "#f1f5f9", fontWeight: 800, fontSize: "1.35rem" }}>
                  Financial Summary
                </Typography>
              </Stack>

              <Stack spacing={1.4}>
                <Box>
                  <Typography sx={{ color: "#71717A", fontWeight: 700, fontSize: "0.8rem" }}>TOTAL INVESTMENT</Typography>
                  <Typography sx={{ color: "#F4F4F5", fontWeight: 800, fontSize: "1.9rem" }}>
                    {fmtLKR(derived.totalBudget)}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "#71717A", fontWeight: 700, fontSize: "0.8rem" }}>DISBURSED AMOUNT</Typography>
                  <Typography sx={{ color: "#85a446", fontWeight: 800, fontSize: "1.35rem" }}>
                    {fmtLKR(derived.disbursed)}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "#71717A", fontWeight: 700, fontSize: "0.8rem" }}>REMAINING BALANCE</Typography>
                  <Typography sx={{ color: "#fbbf24", fontWeight: 800, fontSize: "1.35rem" }}>
                    {fmtLKR(derived.remaining)}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ color: "#71717A", fontWeight: 700, fontSize: "0.8rem" }}>EXPECTED ROI</Typography>
                  <Typography sx={{ color: "#85a446", fontWeight: 800, fontSize: "1.5rem" }}>
                    {agreement.expectedROI ? `${agreement.expectedROI}%` : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                background: "#111113",
                border: "1px solid rgba(255,255,255,0.07)",
                minHeight: 220,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Timeline sx={{ color: "#f1f5f9" }} />
                <Typography sx={{ color: "#f1f5f9", fontWeight: 800, fontSize: "1.35rem" }}>
                  Milestone Status
                </Typography>
              </Stack>

              <Typography sx={{ color: "#71717A", fontWeight: 700, fontSize: "0.8rem" }}>TOTAL MILESTONES</Typography>
              <Typography sx={{ color: "#F4F4F5", fontWeight: 800, fontSize: "1.9rem", mb: 1.4 }}>
                {derived.totalMilestones}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1.4,
                  mb: 1.5,
                }}
              >
                <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: "rgba(133,164,70,0.12)", border: "1px solid rgba(133,164,70,0.22)" }}>
                  <Typography sx={{ color: "#85a446", fontWeight: 700, fontSize: "0.78rem" }}>COMPLETED</Typography>
                  <Typography sx={{ color: "#85a446", fontWeight: 900, fontSize: "2rem", lineHeight: 1 }}>
                    {derived.completedMilestones}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.22)" }}>
                  <Typography sx={{ color: "#fbbf24", fontWeight: 700, fontSize: "0.78rem" }}>PENDING</Typography>
                  <Typography sx={{ color: "#fbbf24", fontWeight: 900, fontSize: "2rem", lineHeight: 1 }}>
                    {derived.pendingMilestones}
                  </Typography>
                </Box>
              </Box>

              <Typography sx={{ color: "#71717A", fontWeight: 700, fontSize: "0.8rem" }}>COMPLETION RATE</Typography>
              <LinearProgress
                variant="determinate"
                value={agreement.progressPercent}
                sx={{
                  mt: 0.6,
                  height: 8,
                  borderRadius: 99,
                  bgcolor: "rgba(255,255,255,0.08)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 99,
                    bgcolor: "#85a446",
                  },
                }}
              />
              <Typography sx={{ color: "#F4F4F5", fontWeight: 700, fontSize: "0.9rem", mt: 0.6 }}>
                {agreement.progressPercent}% Complete
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2.2,
              borderRadius: 2.5,
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Typography sx={{ color: "#f1f5f9", fontWeight: 800, fontSize: "1.1rem", mb: 1.5 }}>
              Linked Parties (View Only)
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 1.2,
              }}
            >
              {[
                { role: "Investor", name: agreement.investorName ?? "Current Investor", color: "#60a5fa" },
                { role: "Farmer", name: agreement.farmerPartyName ?? "Not Assigned", color: "#85a446" },
                { role: "Landowner", name: agreement.landownerPartyName ?? "Not Assigned", color: "#fbbf24" },
              ].map((p) => (
                <Box
                  key={p.role}
                  sx={{
                    p: 1.5,
                    borderRadius: 1.8,
                    border: "1px solid rgba(255,255,255,0.09)",
                    bgcolor: "rgba(255,255,255,0.02)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Avatar sx={{ width: 34, height: 34, bgcolor: "#27272A", color: p.color, fontWeight: 800 }}>
                    {p.role[0]}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: p.color, fontWeight: 800, fontSize: "0.75rem" }}>
                      {p.role}
                    </Typography>
                    <Typography noWrap sx={{ color: "#F4F4F5", fontWeight: 700, fontSize: "0.88rem" }}>
                      {p.name}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.06)" }} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOn sx={{ color: "#71717A", fontSize: 17 }} />
                <Typography sx={{ color: "#A1A1AA", fontWeight: 600 }}>
                  {agreement.location}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTime sx={{ color: "#71717A", fontSize: 17 }} />
                <Typography sx={{ color: "#A1A1AA", fontWeight: 600 }}>
                  {agreement.submittedAt}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Person sx={{ color: "#71717A", fontSize: 17 }} />
                <Typography sx={{ color: "#A1A1AA", fontWeight: 600 }}>
                  {agreement.partyRole}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementProjectDetailsModal;
