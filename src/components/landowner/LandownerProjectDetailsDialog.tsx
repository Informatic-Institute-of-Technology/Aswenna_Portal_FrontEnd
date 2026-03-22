import { ReceiptLong, WarningAmber } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import type { OfferCardProps } from "../investor";

type MilestonePaymentStatus = "Paid" | "Pending" | "Overdue" | "In Review";

interface MilestonePaymentRow {
  id: string;
  milestoneName: string;
  dueDate: string;
  amount: number;
  paidDate?: string;
  status: MilestonePaymentStatus;
}

interface LandownerProjectDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  project: OfferCardProps | null;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const statusChipColor = (status: MilestonePaymentStatus) => {
  if (status === "Paid") return "success" as const;
  if (status === "Pending") return "warning" as const;
  if (status === "Overdue") return "error" as const;
  return "default" as const;
};

const deriveMilestonePaymentStatus = (
  paymentStatus: string | undefined,
  milestoneStatus: string | undefined,
): MilestonePaymentStatus => {
  const normalizedPayment = (paymentStatus || "").toLowerCase();
  const normalizedMilestone = (milestoneStatus || "").toLowerCase();

  if (normalizedPayment === "paid") return "Paid";
  if (normalizedPayment === "overdue") return "Overdue";
  if (normalizedPayment === "in-review" || normalizedPayment === "in review") {
    return "In Review";
  }
  if (normalizedMilestone === "in-progress" || normalizedMilestone === "delayed") {
    return "In Review";
  }
  return "Pending";
};

const buildMilestonePayments = (project: OfferCardProps | null): MilestonePaymentRow[] => {
  if (!project) return [];

  const milestoneMap = new Map(
    (project.milestones || []).map((milestone) => [milestone.id, milestone]),
  );

  if (project.payments && project.payments.length > 0) {
    return project.payments.map((payment) => {
      const linkedMilestone = milestoneMap.get(payment.milestoneId);
      return {
        id: payment.id,
        milestoneName: linkedMilestone?.title || payment.description || "Milestone Payment",
        dueDate: payment.dueDate,
        amount: payment.amount,
        paidDate: payment.paidDate,
        status: deriveMilestonePaymentStatus(payment.status, linkedMilestone?.status),
      };
    });
  }

  return (project.milestones || []).map((milestone) => ({
    id: milestone.id,
    milestoneName: milestone.title,
    dueDate: milestone.endDate,
    amount: milestone.payment || 0,
    paidDate: milestone.status === "completed" ? milestone.completedDate : undefined,
    status: deriveMilestonePaymentStatus(undefined, milestone.status),
  }));
};

const getActionLabel = (status: MilestonePaymentStatus) => {
  if (status === "Paid") return "View Receipt";
  if (status === "Overdue") return "Request Follow-up";
  return "View Invoice";
};

const LandownerProjectDetailsDialog = ({
  open,
  onClose,
  project,
}: LandownerProjectDetailsDialogProps) => {
  const milestonePayments = useMemo(() => buildMilestonePayments(project), [project]);

  const summary = useMemo(() => {
    const totalProjectValue = milestonePayments.reduce((sum, item) => sum + item.amount, 0);
    const paidSoFar = milestonePayments
      .filter((item) => item.status === "Paid")
      .reduce((sum, item) => sum + item.amount, 0);
    const pendingAmount = milestonePayments
      .filter((item) => item.status === "Pending" || item.status === "In Review")
      .reduce((sum, item) => sum + item.amount, 0);
    const overdueAmount = milestonePayments
      .filter((item) => item.status === "Overdue")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      totalProjectValue,
      paidSoFar,
      pendingAmount,
      overdueAmount,
      progress:
        totalProjectValue > 0
          ? Math.round((paidSoFar / totalProjectValue) * 100)
          : 0,
    };
  }, [milestonePayments]);

  if (!project) return null;

  const isActiveProject = project.status === "active";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(180deg, var(--bg-overlay), var(--bg-elevated))",
          border: "1px solid var(--surface-light)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>{project.projectName}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {project.cropType} • {project.location}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Duration: {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </Typography>
          </Box>

          {isActiveProject && (
            <>
              <Divider />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Milestone Payments
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Track payment status for each milestone in your ongoing project.
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "var(--surface-tint)" }}>
                    <Typography variant="caption" color="text.secondary">Total Project Value</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {formatCurrency(summary.totalProjectValue)}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "var(--surface-tint)" }}>
                    <Typography variant="caption" color="text.secondary">Paid So Far</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "success.main" }}>
                      {formatCurrency(summary.paidSoFar)}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "var(--surface-tint)" }}>
                    <Typography variant="caption" color="text.secondary">Pending Amount</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "warning.main" }}>
                      {formatCurrency(summary.pendingAmount)}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "var(--surface-tint)" }}>
                    <Typography variant="caption" color="text.secondary">Overdue Amount</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "error.main" }}>
                      {formatCurrency(summary.overdueAmount)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                    <Typography variant="caption" color="text.secondary">Payment Completion</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{summary.progress}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={summary.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {milestonePayments.length > 0 ? (
                  <Stack spacing={1.25}>
                    {milestonePayments.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "var(--surface-tint)",
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr auto" },
                          gap: 1.5,
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {item.milestoneName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Due: {formatDate(item.dueDate)}
                            {item.paidDate ? ` • Paid: ${formatDate(item.paidDate)}` : ""}
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {formatCurrency(item.amount)}
                        </Typography>

                        <Box>
                          <Chip
                            label={item.status}
                            color={statusChipColor(item.status)}
                            size="small"
                          />
                        </Box>

                        <Button
                          size="small"
                          variant={item.status === "Paid" ? "outlined" : "contained"}
                          startIcon={item.status === "Overdue" ? <WarningAmber /> : <ReceiptLong />}
                        >
                          {getActionLabel(item.status)}
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No milestone payments found for this project.
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LandownerProjectDetailsDialog;
