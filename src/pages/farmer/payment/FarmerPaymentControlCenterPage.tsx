import type { FarmerPaymentRow } from "@/types/paymentTypes";
import {
  CheckCircle,
  HourglassTop,
  ReceiptLong,
  TrendingUp,
  Warning,
} from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";
import type { ColumnDef } from "./components/index.ts";
import {
  GhostButton,
  MetricCard,
  PaymentTable,
  PayNowButton,
  SectionCard,
  StatusBadge,
} from "./components/index.ts";
import { useFarmerPaymentData } from "../../../Context/useFarmerPaymentData.ts";
import { FarmerPaymentDetailDialog } from "./FarmerPaymentDetailPage.tsx";
 
interface UnifiedPaymentRow {
  id: string;
  projectId: string;
  project: string;
  description: string;
  counterparty: string;
  dueDate: string;
  settledDate?: string;
  amount: string;
  status: "paid" | "pending" | "overdue" | "upcoming";
}
 
function toUnifiedPayment(r: FarmerPaymentRow): UnifiedPaymentRow {
  return {
    id: r.id,
    projectId: r.projectId,
    project: r.project,
    description: r.milestone,
    counterparty: r.farmer,
    dueDate: r.dueDate,
    settledDate: r.paidDate,
    amount: r.amount,
    status:
      r.paymentStatus === "overdue"
        ? "overdue"
        : r.paymentStatus === "pending"
          ? "pending"
          : "paid",
  };
}
 
const ACTIVE_COLS = (
  onTrack: (row: UnifiedPaymentRow) => void,
  accentColor: string,
): ColumnDef<UnifiedPaymentRow>[] => [
  {
    header: "Project",
    width: "2fr",
    render: (r) => (
      <div>
        <p className="text-white text-sm font-semibold leading-tight">
          {r.project}
        </p>
      </div>
    ),
  },
  {
    header: "Milestone",
    width: "2fr",
    render: (r) => (
      <span className="text-sm" style={{ color: "var(--neutral-350)" }}>
        {r.description}
      </span>
    ),
  },
  {
    header: "From Investor",
    width: "1.6fr",
    render: (r) => (
      <div>
        <p className="text-sm" style={{ color: "var(--neutral-350)" }}>
          {r.counterparty}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--neutral-700)" }}>
          Investor
        </p>
      </div>
    ),
  },
  {
    header: "Due Date",
    width: "1.2fr",
    render: (r) => (
      <span className="text-sm font-semibold" style={{ color: accentColor }}>
        {r.dueDate}
      </span>
    ),
  },
  {
    header: "Amount",
    width: "1.2fr",
    align: "right",
    render: (r) => (
      <span className="font-mono text-sm font-bold text-white">{r.amount}</span>
    ),
  },
  {
    header: "Status",
    width: "1fr",
    align: "center",
    render: (r) =>
      r.status === "overdue" ? (
        <StatusBadge label="Overdue" color="var(--color-overdue)" />
      ) : (
        <StatusBadge label="Pending" color="var(--color-pending)" />
      ),
  },
  {
    header: "Action",
    width: "1fr",
    align: "right",
    render: (r) => <PayNowButton onClick={() => onTrack(r)} label="Track" />,
  },
];
 
const PAID_COLS: ColumnDef<UnifiedPaymentRow>[] = [
  {
    header: "Project",
    width: "2fr",
    render: (r) => (
      <div>
        <p className="text-white text-sm font-semibold leading-tight">
          {r.project}
        </p>
      </div>
    ),
  },
  {
    header: "Milestone",
    width: "2fr",
    render: (r) => (
      <span className="text-sm" style={{ color: "var(--neutral-350)" }}>
        {r.description}
      </span>
    ),
  },
  {
    header: "Paid By",
    width: "1.6fr",
    render: (r) => (
      <div>
        <p className="text-sm" style={{ color: "var(--neutral-350)" }}>
          {r.counterparty}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--neutral-700)" }}>
          Investor
        </p>
      </div>
    ),
  },
  {
    header: "Paid Date",
    width: "1.2fr",
    render: (r) => (
      <span className="text-sm" style={{ color: "var(--neutral-350)" }}>
        {r.settledDate ?? "---"}
      </span>
    ),
  },
  {
    header: "Amount",
    width: "1.2fr",
    align: "right",
    render: (r) => (
      <span
        className="font-mono text-sm font-bold"
        style={{ color: "var(--color-olive)" }}
      >
        {r.amount}
      </span>
    ),
  },
  {
    header: "Status",
    width: "1fr",
    align: "center",
    render: () => <StatusBadge label="Received" color="var(--color-olive)" />,
  },
  {
    header: "Receipt",
    width: "1fr",
    align: "right",
    render: () => (
      <GhostButton
        icon={<ReceiptLong sx={{ fontSize: 13 }} />}
        className="text-xs px-2.5 py-1.5"
      >
        Download
      </GhostButton>
    ),
  },
];
 
function byDate(a: UnifiedPaymentRow, b: UnifiedPaymentRow): number {
  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
}
 
function bySettled(a: UnifiedPaymentRow, b: UnifiedPaymentRow): number {
  return (
    new Date(b.settledDate ?? b.dueDate).getTime() -
    new Date(a.settledDate ?? a.dueDate).getTime()
  );
}
 
function sumAmt(rows: { amount: string }[]): number {
  return rows.reduce(
    (s, r) => s + parseFloat(r.amount.replace(/[^\d.]/g, "")),
    0,
  );
}
 
function fmtK(n: number): string {
  return `Rs.${n.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
 
export default function FarmerPaymentControlCenterPage() {
  const { overdueRows, ongoingRows, paidRows, investmentRows } =
    useFarmerPaymentData();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailProjectId, setDetailProjectId] = useState<string | null>(null);
 
  const openDetail = useCallback((projectId: string) => {
    setDetailProjectId(projectId);
    setDetailOpen(true);
  }, []);
 
  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailProjectId(null);
  }, []);
 
  const allOverdue = useMemo<UnifiedPaymentRow[]>(
    () => [...overdueRows.map(toUnifiedPayment)].sort(byDate),
    [overdueRows],
  );
 
  const allPending = useMemo<UnifiedPaymentRow[]>(
    () => [...ongoingRows.map(toUnifiedPayment)].sort(byDate),
    [ongoingRows],
  );
 
  const allPaid = useMemo<UnifiedPaymentRow[]>(
    () =>
      [
        ...paidRows.map(toUnifiedPayment),
        ...investmentRows.map(toUnifiedPayment),
      ].sort(bySettled),
    [paidRows, investmentRows],
  );
 
  const footerStats = useMemo(
    () => [
      {
        dot: "var(--color-overdue)",
        glow: "var(--color-overdue-border)",
        label: "OVERDUE",
        val: fmtK(sumAmt(allOverdue)),
      },
      {
        dot: "var(--color-pending)",
        glow: "var(--color-pending-border)",
        label: "PENDING",
        val: fmtK(sumAmt(allPending)),
      },
      {
        dot: "var(--color-olive)",
        glow: "var(--color-olive-glow)",
        label: "RECEIVED",
        val: fmtK(sumAmt(allPaid)),
      },
    ],
    [allOverdue, allPending, allPaid],
  );
 
  const METRICS = useMemo(
    () => [
      {
        label: "Overdue Repayments",
        value: fmtK(sumAmt(allOverdue)),
        change: `${allOverdue.length} obligation${allOverdue.length !== 1 ? "s" : ""} overdue`,
        color: "var(--color-overdue)",
        icon: Warning,
        progress: Math.min(100, (allOverdue.length / 5) * 100),
      },
      {
        label: "Pending Repayments",
        value: fmtK(sumAmt(allPending)),
        change: `${allPending.length} obligation${allPending.length !== 1 ? "s" : ""} pending`,
        color: "var(--color-pending)",
        icon: HourglassTop,
        progress: Math.min(100, (allPending.length / 8) * 100),
      },
      {
        label: "Received Investments",
        value: fmtK(sumAmt(allPaid)),
        change: `${allPaid.length} investment${allPaid.length !== 1 ? "s" : ""} received`,
        color: "var(--color-olive)",
        icon: CheckCircle,
        progress: Math.min(100, (allPaid.length / 10) * 100),
      },
      {
        label: "Active Projects",
        value: investmentRows.length.toString(),
        change: "projects with investments",
        color: "var(--color-success)",
        icon: TrendingUp,
        progress: 75,
      },
    ],
    [allOverdue, allPending, allPaid, investmentRows],
  );
 
  return (
    <>
      <div
        className="flex flex-col"
        style={{
          minHeight: "100vh",
          background: "var(--bg-surface)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          className="flex items-center gap-1.5 px-6 pt-4 pb-1 text-xs select-none"
          style={{ color: "var(--neutral-500)" }}
        >
          <span
            className="hover:text-white cursor-pointer transition-colors"
            style={{ color: "var(--neutral-400)" }}
          >
            Dashboard
          </span>
          <span style={{ color: "var(--neutral-700)" }}>/</span>
          <span
            className="hover:text-white cursor-pointer transition-colors"
            style={{ color: "var(--neutral-400)" }}
          >
            Finances
          </span>
          <span style={{ color: "var(--neutral-700)" }}>/</span>
          <span style={{ color: "var(--color-olive)" }} className="font-medium">
            Payment Hub
          </span>
        </div>
 
        <div
          className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-6 py-6"
          style={{ borderBottom: "1px solid var(--bg-subtle)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ReceiptLong sx={{ color: "var(--color-olive)", fontSize: 22 }} />
              <h2 className="text-white text-2xl font-bold tracking-tight">
                Payment Hub
              </h2>
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Track investment receipts and repayment obligations
            </p>
          </div>
        </div>
 
        <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map((m) => (
              <MetricCard
                key={m.label}
                label={m.label}
                value={m.value}
                change={m.change}
                color={m.color}
                icon={m.icon}
                progress={m.progress}
              />
            ))}
          </div>
 
          {allOverdue.length > 0 && (
            <SectionCard
              icon={<Warning sx={{ color: "var(--color-overdue)" }} />}
              title="Overdue Repayments"
              subtitle={`${allOverdue.length} obligation${allOverdue.length !== 1 ? "s" : ""} require immediate attention`}
              accentColor="var(--color-overdue)"
              count={allOverdue.length}
            >
              <PaymentTable
                columns={ACTIVE_COLS(
                  (row) => openDetail(row.projectId),
                  "var(--color-overdue)",
                )}
                rows={allOverdue}
                rowKey={(r) => r.id}
                accentColor="var(--color-overdue)"
              />
            </SectionCard>
          )}
 
          {allPending.length > 0 && (
            <SectionCard
              icon={<HourglassTop sx={{ color: "var(--color-pending)" }} />}
              title="Pending Repayments"
              subtitle={`${allPending.length} obligation${allPending.length !== 1 ? "s" : ""} scheduled`}
              accentColor="var(--color-pending)"
              count={allPending.length}
            >
              <PaymentTable
                columns={ACTIVE_COLS(
                  (row) => openDetail(row.projectId),
                  "var(--color-pending)",
                )}
                rows={allPending}
                rowKey={(r) => r.id}
                accentColor="var(--color-pending)"
              />
            </SectionCard>
          )}
 
          {allPaid.length > 0 && (
            <SectionCard
              icon={<CheckCircle sx={{ color: "var(--color-olive)" }} />}
              title="Received Investments & Completed Repayments"
              subtitle={`${allPaid.length} transaction${allPaid.length !== 1 ? "s" : ""} settled`}
              accentColor="var(--color-olive)"
              count={allPaid.length}
            >
              <PaymentTable
                columns={PAID_COLS}
                rows={allPaid}
                rowKey={(r) => r.id}
                accentColor="var(--color-olive)"
              />
            </SectionCard>
          )}
        </div>
 
        <div
          className="flex items-center justify-between gap-4 px-6 py-4 flex-wrap"
          style={{ borderTop: "1px solid var(--bg-subtle)" }}
        >
          {footerStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3"
              style={{ flex: "1 1 auto", minWidth: 150 }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: stat.dot,
                  boxShadow: `0 0 8px ${stat.glow}`,
                }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-bold"
                  style={{ color: "var(--neutral-500)" }}
                >
                  {stat.label}
                </p>
                <p className="text-sm font-bold text-white font-mono">
                  {stat.val}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {detailOpen && detailProjectId && (
        <FarmerPaymentDetailDialog
          projectId={detailProjectId}
          onClose={closeDetail}
          open={true}
        />
      )}
    </>
  );
}