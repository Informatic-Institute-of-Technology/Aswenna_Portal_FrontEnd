import { comprehensiveProjectsData } from "@/data/json";
import type { PaymentItem } from "@/types/paymentTypes";
import {
  CheckCircle,
  HourglassTop,
  LocationOn,
  Tag,
  Upcoming,
} from "@mui/icons-material";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { useMemo, useState } from "react";
import { RingChart } from "./components";
import { FarmerPaymentInstallmentDialog } from "./FarmerPaymentInstallmentPage";
 
interface RawProjMs {
  id: string;
  title: string;
  status: string;
  completedDate?: string;
  endDate?: string;
  payment?: number;
  tasks?: { total: number };
}
 
interface RawProjPmt {
  id: string;
  milestoneId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: string;
}
 
interface RawFarmerProject {
  id: string;
  projectId: string;
  projectName: string;
  cropType?: string;
  location: string;
  startDate: string;
  farmerId?: string;
  milestones: RawProjMs[];
  payments: RawProjPmt[];
  costBreakdown?: Array<{
    category: string;
    description?: string;
    estimatedCost: number;
  }>;
  investorName?: string;
  investorAmount?: number;
}
 
interface LineItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  status: "paid" | "pending" | "upcoming";
  rawStatus: string;
  dueDate: string;
  detail: string;
  showReceiptLink?: boolean;
}
 
export interface FarmerPaymentDetailProps {
  projectId?: string;
  paymentId?: string;
  onClose?: () => void;
  isDialog?: boolean;
}
 
const fmtD = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
 
export function FarmerPaymentDetailContent({
  projectId,
  paymentId,
}: FarmerPaymentDetailProps) {
  const [payOpen, setPayOpen] = useState(false);
  const [payInitialIds, setPayInitialIds] = useState<string[] | undefined>(
    undefined,
  );
 
  const openPayForItem = (itemId: string) => {
    setPayInitialIds([itemId]);
    setPayOpen(true);
  };
 
  const project = useMemo((): RawFarmerProject | null => {
    if (!projectId) return null;
    return (
      (comprehensiveProjectsData as RawFarmerProject[]).find(
        (p) => p.id === projectId,
      ) ?? null
    );
  }, [projectId]);
 
  const repaymentItems = useMemo((): LineItem[] => {
    if (!project) return [];
    const paymentMap: Record<string, RawProjPmt> = Object.fromEntries(
      project.payments.map((p) => [p.milestoneId, p]),
    );
    return project.milestones.map((ms, idx): LineItem => {
      const pmt = paymentMap[ms.id];
      const isCompleted = ms.status === "completed" || pmt?.status === "paid";
      const isActive =
        !isCompleted &&
        pmt != null &&
        (pmt.status === "overdue" || pmt.status === "pending");
      const status: LineItem["status"] = isCompleted
        ? "paid"
        : isActive
          ? "pending"
          : "upcoming";
 
      return {
        id: pmt?.id ?? ms.id,
        title: ms.title,
        subtitle: isCompleted
          ? `Repayment ${idx + 1} · Completed on ${fmtD(ms.completedDate ?? pmt?.paidDate ?? "")}`
          : isActive
            ? `Repayment ${idx + 1} · Due ${fmtD(pmt!.dueDate)}`
            : `Repayment ${idx + 1} · Scheduled ${fmtD(ms.endDate ?? "")}`,
        amount: pmt?.amount ?? ms.payment ?? 0,
        status,
        rawStatus: pmt?.status ?? (isCompleted ? "paid" : "upcoming"),
        dueDate: pmt ? fmtD(pmt.dueDate) : fmtD(ms.endDate ?? ""),
        detail: ms.tasks ? `${ms.tasks.total} tasks` : "See harvest plan",
        showReceiptLink: true,
      };
    });
  }, [project]);
 
  const TOTAL = repaymentItems.reduce((s, i) => s + i.amount, 0);
  const PAID = repaymentItems
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);
  const PENDING_AMT = repaymentItems
    .filter((i) => i.status === "pending")
    .reduce((s, i) => s + i.amount, 0);
  const PCT = TOTAL > 0 ? Math.round((PAID / TOTAL) * 100) : 0;
 
  const pendingPayments = useMemo(
    (): PaymentItem[] =>
      repaymentItems
        .filter((i) => i.status === "pending" && i.id)
        .map((i) => ({
          id: i.id,
          name: i.title,
          amount: i.amount,
          dueDate: i.dueDate,
          status: (i.rawStatus === "overdue" ? "overdue" : "scheduled") as
            | "overdue"
            | "scheduled",
        })),
    [repaymentItems],
  );
 
  const projName = project?.projectName ?? "—";
  const projId = project ? `#${project.projectId}` : "—";
  const projLoc = project ? `${project.location}, LK` : "—";
  const investorName = project?.investorName ?? "Investor";
  const investmentAmount = project?.investorAmount ?? 0;
  const cropLabel = project?.cropType ?? project?.projectId ?? "";
  const totalExpenses = (project?.costBreakdown ?? []).reduce(
    (s, cb) => s + cb.estimatedCost,
    0,
  );
 
  const titleSuffix = cropLabel ? ` — ${cropLabel}` : "";
  const badgeLabel = "Active Investment";
  const progressLabel = "Repayment Progress";
  const timelineLabel = "Repayment Timeline";
  const totalLabel = "Total Repayment Amount";
  const helpText = "Questions about investment or repayment schedule?";
  const accentColor = (raw: string) =>
    raw === "overdue" ? "var(--color-overdue)" : "var(--color-olive)";
 
  const currencyFmt = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  });
 
  return (
    <>
      <div style={{ background: "var(--bg-surface)", fontFamily: "Inter" }}>
        <div
          className="space-y-6 p-8"
          style={{ maxWidth: "1000px", margin: "0 auto" }}
        >
          <div
            className="rounded-xl p-6 space-y-6"
            style={{
              border: "1px solid var(--bg-subtle)",
              background: "var(--bg-elevated)",
            }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h2
                  className="text-2xl font-bold tracking-tight flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {projName}
                  {titleSuffix}
                </h2>
                <div
                  className="flex items-center gap-2 flex-wrap text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="px-2.5 py-1 rounded-full"
                    style={{
                      background: "var(--color-olive)20",
                      color: "var(--color-olive)",
                    }}
                  >
                    {badgeLabel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag sx={{ fontSize: 14 }} />
                    {projId}
                  </span>
                  <span className="flex items-center gap-1">
                    <LocationOn sx={{ fontSize: 14 }} />
                    {projLoc}
                  </span>
                </div>
              </div>
            </div>
 
            <div className="grid grid-cols-3 gap-4">
              <div
                className="rounded-lg p-4"
                style={{ background: "var(--bg-surface)" }}
              >
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Investor
                </p>
                <p className="text-lg font-bold mt-2">{investorName}</p>
              </div>
              <div
                className="rounded-lg p-4"
                style={{ background: "var(--bg-surface)" }}
              >
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Investment Received
                </p>
                <p
                  className="text-lg font-bold mt-2"
                  style={{ color: "var(--color-olive)" }}
                >
                  {currencyFmt.format(investmentAmount)}
                </p>
              </div>
              <div
                className="rounded-lg p-4"
                style={{ background: "var(--bg-surface)" }}
              >
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Total Expenses
                </p>
                <p className="text-lg font-bold mt-2">
                  {currencyFmt.format(totalExpenses)}
                </p>
              </div>
            </div>
 
            <div
              className="grid grid-cols-2 gap-6 pt-4"
              style={{ borderTop: "1px solid var(--bg-subtle)" }}
            >
              <div className="space-y-3">
                <p className="text-sm font-bold">{progressLabel}</p>
                <div style={{ height: 200 }}>
                  <RingChart
                    pct={PCT}
                    color="var(--color-olive)"
                    centerLabel={`${PCT}%`}
                  />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>Paid</span>
                    <span className="font-semibold">
                      {currencyFmt.format(PAID)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Pending
                    </span>
                    <span className="font-semibold">
                      {currencyFmt.format(PENDING_AMT)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>
                      {totalLabel}
                    </span>
                    <span className="font-semibold">
                      {currencyFmt.format(TOTAL)}
                    </span>
                  </div>
                </div>
              </div>
 
              <div className="space-y-3">
                <p className="text-sm font-bold">{timelineLabel}</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {repaymentItems.map((item, idx) => {
                    const isPrimary =
                      item.id === paymentId ||
                      (!paymentId &&
                        item.status === "pending" &&
                        !repaymentItems
                          .slice(0, idx)
                          .some((i) => i.status === "pending"));
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          isPrimary ? "ring-2" : ""
                        }`}
                        style={{
                          background: "var(--bg-surface)",
                          borderLeft: `3px solid ${
                            item.rawStatus === "overdue"
                              ? "var(--color-overdue)"
                              : item.status === "paid"
                                ? "var(--color-olive)"
                                : "var(--color-pending)"
                          }`,
                          outline: isPrimary
                            ? `2px solid ${accentColor(item.rawStatus)}`
                            : "none",
                        }}
                        onClick={() => openPayForItem(item.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-bold">{item.title}</p>
                            <p
                              className="text-xs mt-1"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {item.subtitle}
                            </p>
                          </div>
                          {item.status === "paid" ? (
                            <CheckCircle
                              sx={{
                                fontSize: 16,
                                color: "var(--color-olive)",
                              }}
                            />
                          ) : item.rawStatus === "overdue" ? (
                            <HourglassTop
                              sx={{
                                fontSize: 16,
                                color: "var(--color-overdue)",
                              }}
                            />
                          ) : (
                            <Upcoming
                              sx={{
                                fontSize: 16,
                                color: "var(--color-pending)",
                              }}
                            />
                          )}
                        </div>
                        <div
                          className="flex items-center justify-between mt-2 pt-2"
                          style={{ borderTop: "1px solid var(--bg-overlay)" }}
                        >
                          <span
                            className="text-xs font-semibold"
                            style={{ color: accentColor(item.rawStatus) }}
                          >
                            {item.dueDate}
                          </span>
                          <span className="font-mono font-bold text-xs">
                            {currencyFmt.format(item.amount)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
 
            <div
              className="pt-4"
              style={{ borderTop: "1px solid var(--bg-subtle)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {helpText}
              </p>
            </div>
          </div>
        </div>
      </div>
 
      {payOpen && (
        <FarmerPaymentInstallmentDialog
          open={payOpen}
          paymentItems={pendingPayments}
          projectName={projName}
          initialIds={payInitialIds}
          onClose={() => setPayOpen(false)}
          onSuccess={() => setPayOpen(false)}
        />
      )}
    </>
  );
}
 
export const FarmerPaymentDetailDialog = (
  props: FarmerPaymentDetailProps & { open?: boolean },
) => {
  if (!props.open) return null;
 
  return (
    <Dialog
      open={true}
      onClose={props.onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: { background: "var(--bg-surface)" },
      }}
    >
      <DialogContent
        style={{
          padding: 0,
          color: "var(--text-primary)",
        }}
      >
        {props.onClose && (
          <IconButton
            onClick={props.onClose}
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 10,
              color: "var(--text-secondary)",
            }}
          >
            ✕
          </IconButton>
        )}
        <FarmerPaymentDetailContent {...props} />
      </DialogContent>
    </Dialog>
  );
};
 
export const FarmerPaymentDetailPage = (props: FarmerPaymentDetailProps) => {
  return <FarmerPaymentDetailContent {...props} />;
};