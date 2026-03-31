import type {
  ProjectPaymentRow,
  RentalRow,
  UnifiedRow,
} from "@/types/paymentTypes";
import {
  CheckCircle,
  Download,
  FilterList,
  HourglassTop,
  ReceiptLong,
  Warning,
} from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";
import type { ColumnDef } from "./components";
import {
  GhostButton,
  MetricCard,
  PaymentTable,
  PayNowButton,
  SectionCard,
  StatusBadge,
} from "./components";
import {
  LandownerRentalDialog,
  ProjectPaymentMilestoneDialog,
} from "./PaymentDetailPage";
import { usePaymentData } from "../../../Context/usePaymentData";

function toUnifiedMilestone(r: ProjectPaymentRow): UnifiedRow {
  return {
    id: r.id,
    projectId: r.projectId,
    project: r.project,
    description: r.milestone,
    counterparty: r.farmer,
    counterpartyRole: "Farmer",
    dueDate: r.dueDate,
    settledDate: r.paidDate,
    amount: r.amount,
    status: r.paymentStatus as UnifiedRow["status"],
  };
}

function toUnifiedRental(r: RentalRow): UnifiedRow {
  return {
    id: r.id,
    projectId: r.projectId,
    project: r.project,
    description: `Land Rent \u00b7 ${r.month}`,
    counterparty: r.landowner,
    counterpartyRole: "Landowner",
    dueDate: r.dueDate,
    amount: r.amount,
    status: r.status as UnifiedRow["status"],
  };
}

const ACTIVE_COLS = (
  onPay: (row: UnifiedRow) => void,
  accentColor: string,
): ColumnDef<UnifiedRow>[] => [
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
    header: "Milestone / Installment",
    width: "2fr",
    render: (r) => (
      <span className="text-sm" style={{ color: "var(--neutral-350)" }}>
        {r.description}
      </span>
    ),
  },
  {
    header: "Pay To",
    width: "1.6fr",
    render: (r) => (
      <div>
        <p className="text-sm" style={{ color: "var(--neutral-350)" }}>
          {r.counterparty}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--neutral-700)" }}>
          {r.counterpartyRole}
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
    render: (r) => <PayNowButton onClick={() => onPay(r)} />,
  },
];

const PAID_COLS: ColumnDef<UnifiedRow>[] = [
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
    header: "Milestone / Installment",
    width: "2fr",
    render: (r) => (
      <span className="text-sm" style={{ color: "var(--neutral-350)" }}>
        {r.description}
      </span>
    ),
  },
  {
    header: "Paid To",
    width: "1.6fr",
    render: (r) => (
      <div>
        <p className="text-sm" style={{ color: "var(--neutral-350)" }}>
          {r.counterparty}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--neutral-700)" }}>
          {r.counterpartyRole}
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
    render: () => <StatusBadge label="Paid" color="var(--color-olive)" />,
  },
  {
    header: "Receipt",
    width: "1fr",
    align: "right",
    render: () => (
      <GhostButton
        href="#"
        icon={<ReceiptLong sx={{ fontSize: 13 }} />}
        className="text-xs px-2.5 py-1.5"
      >
        Download
      </GhostButton>
    ),
  },
];

function byDate(a: UnifiedRow, b: UnifiedRow): number {
  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
}

function bySettled(a: UnifiedRow, b: UnifiedRow): number {
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

export default function PaymentControlCenterPage() {
  const { overdueRows, ongoingRows, paidRows, rentalRows, markPaid } =
    usePaymentData();
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<UnifiedRow | null>(null);
  const [rentalOpen, setRentalOpen] = useState(false);
  const [rentalProjectId, setRentalProjectId] = useState<string | undefined>();

  const openPayDialog = useCallback((row: UnifiedRow) => {
    if (row.counterpartyRole === "Landowner") {
      setRentalProjectId(row.projectId);
      setRentalOpen(true);
    } else {
      setPendingRow(row);
      setMilestoneOpen(true);
    }
  }, []);

  const closeDialog = useCallback(() => {
    setMilestoneOpen(false);
    setPendingRow(null);
  }, []);

  const handlePaymentSuccess = useCallback(
    (paidIds: string[]) => {
      paidIds.forEach((id) => markPaid(id));
      setMilestoneOpen(false);
      setPendingRow(null);
    },
    [markPaid],
  );

  const allOverdue = useMemo<UnifiedRow[]>(
    () =>
      [
        ...overdueRows.map(toUnifiedMilestone),
        ...rentalRows
          .filter((r) => r.status === "overdue")
          .map(toUnifiedRental),
      ].sort(byDate),
    [overdueRows, rentalRows],
  );
  const allPending = useMemo<UnifiedRow[]>(
    () =>
      [
        ...ongoingRows.map(toUnifiedMilestone),
        ...rentalRows
          .filter((r) => r.status === "pending")
          .map(toUnifiedRental),
      ].sort(byDate),
    [ongoingRows, rentalRows],
  );
  const allPaid = useMemo<UnifiedRow[]>(
    () =>
      [
        ...paidRows.map(toUnifiedMilestone),
        ...rentalRows.filter((r) => r.status === "paid").map(toUnifiedRental),
      ].sort(bySettled),
    [paidRows, rentalRows],
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
        label: "PAID",
        val: fmtK(sumAmt(allPaid)),
      },
    ],
    [allOverdue, allPending, allPaid],
  );

  const METRICS = useMemo(
    () => [
      {
        label: "Overdue Payments",
        value: fmtK(sumAmt(allOverdue)),
        change: `${allOverdue.length} payment${allOverdue.length !== 1 ? "s" : ""} overdue`,
        color: "var(--color-overdue)",
        icon: Warning,
        progress: Math.min(100, (allOverdue.length / 5) * 100),
      },
      {
        label: "Pending Payments",
        value: fmtK(sumAmt(allPending)),
        change: `${allPending.length} payment${allPending.length !== 1 ? "s" : ""} pending`,
        color: "var(--color-pending)",
        icon: HourglassTop,
        progress: Math.min(100, (allPending.length / 8) * 100),
      },
      {
        label: "Paid Payments",
        value: fmtK(sumAmt(allPaid)),
        change: `${allPaid.length} payment${allPaid.length !== 1 ? "s" : ""} completed`,
        color: "var(--color-olive)",
        icon: CheckCircle,
        progress: Math.min(100, (allPaid.length / 10) * 100),
      },
    ],
    [allOverdue, allPending, allPaid],
  );

  const STATUS_PILLS = useMemo(
    () => [
      { label: "Overdue", cnt: allOverdue.length, bg: "var(--color-overdue)" },
      { label: "Pending", cnt: allPending.length, bg: "var(--color-pending)" },
      { label: "Paid", cnt: allPaid.length, bg: "var(--color-olive)" },
    ],
    [allOverdue, allPending, allPaid],
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
            Payments
          </span>
          <span style={{ color: "var(--neutral-700)" }}>/</span>
          <span style={{ color: "var(--color-olive)" }} className="font-medium">
            Payment Pipeline
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
                Payment Pipeline
              </h2>
            </div>
            <p
              className="text-sm pl-8"
              style={{ color: "var(--text-secondary)" }}
            >
              All outgoing payments milestone disbursements and landowner rental
              fees.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-4 pl-8">
              {STATUS_PILLS.map(({ label, cnt, bg }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full cursor-pointer select-none"
                  style={{
                    background: bg,
                    border: `1px solid ${bg}`,
                    color: "var(--text-primary)",
                  }}
                >
                  {label}
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "var(--surface-light)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {cnt}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <GhostButton icon={<FilterList sx={{ fontSize: 16 }} />}>
              Filter
            </GhostButton>
            <GhostButton icon={<Download sx={{ fontSize: 16 }} />}>
              Export Report
            </GhostButton>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 p-5">
          {METRICS.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>

        <div className="flex flex-col gap-5 px-5 pb-6">
          <SectionCard
            icon={
              <Warning sx={{ color: "var(--color-overdue)", fontSize: 18 }} />
            }
            title="Overdue Payments"
            subtitle="Immediate action required"
            accentColor="#ef4444"
            count={allOverdue.length}
          >
            <div className="flex flex-col">
              {allOverdue.length === 0 ? (
                <p
                  className="px-5 py-6 text-sm text-center"
                  style={{ color: "var(--neutral-600)" }}
                >
                  No overdue payments
                </p>
              ) : (
                <PaymentTable<UnifiedRow>
                  accentColor="#ef4444"
                  rows={allOverdue}
                  rowKey={(r) => r.id}
                  columns={ACTIVE_COLS(openPayDialog, "var(--color-overdue)")}
                  pageSize={5}
                />
              )}
            </div>
          </SectionCard>

          <SectionCard
            icon={
              <HourglassTop
                sx={{ color: "var(--color-pending)", fontSize: 18 }}
              />
            }
            title="Pending Payments"
            subtitle="Awaiting confirmation before release"
            accentColor="#f59e0b"
            count={allPending.length}
          >
            <div className="flex flex-col">
              {allPending.length === 0 ? (
                <p
                  className="px-5 py-6 text-sm text-center"
                  style={{ color: "var(--neutral-600)" }}
                >
                  No pending payments
                </p>
              ) : (
                <PaymentTable<UnifiedRow>
                  accentColor="#f59e0b"
                  rows={allPending}
                  rowKey={(r) => r.id}
                  columns={ACTIVE_COLS(openPayDialog, "var(--neutral-350)")}
                  pageSize={5}
                />
              )}
            </div>
          </SectionCard>

          <SectionCard
            icon={
              <CheckCircle sx={{ color: "var(--color-olive)", fontSize: 18 }} />
            }
            title="Paid Payments"
            subtitle="Completed disbursements and settled fees"
            accentColor="#6b8e23"
            count={allPaid.length}
          >
            <div className="flex flex-col">
              {allPaid.length === 0 ? (
                <p
                  className="px-5 py-6 text-sm text-center"
                  style={{ color: "var(--neutral-600)" }}
                >
                  No paid records
                </p>
              ) : (
                <PaymentTable<UnifiedRow>
                  accentColor="#6b8e23"
                  rows={allPaid}
                  rowKey={(r) => r.id}
                  columns={PAID_COLS}
                  pageSize={5}
                />
              )}
            </div>
          </SectionCard>
        </div>

        <div
          className="mt-auto flex flex-wrap items-center gap-6 px-6 py-3 text-xs"
          style={{
            borderTop: "1px solid var(--bg-subtle)",
            background: "var(--bg-surface)",
            color: "var(--text-secondary)",
          }}
        >
          {footerStats.map(({ dot, glow, label, val }, i) => (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className="w-px h-3 hidden sm:block"
                  style={{ background: "var(--border-medium)" }}
                />
              )}
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: dot, boxShadow: `0 0 6px ${glow}` }}
              />
              <span className="font-medium tracking-wide">
                {label}: <span className="text-white">{val}</span>
              </span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5 opacity-50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#85a446]" />
            <span>System: Stable</span>
          </div>
        </div>
      </div>

      <ProjectPaymentMilestoneDialog
        open={milestoneOpen}
        onClose={closeDialog}
        onPaymentSuccess={handlePaymentSuccess}
        projectId={pendingRow?.projectId}
        paymentId={pendingRow?.id}
      />

      <LandownerRentalDialog
        open={rentalOpen}
        onClose={() => setRentalOpen(false)}
        onPaymentSuccess={(paidIds: string[]) => {
          paidIds.forEach((id) => markPaid(id));
          setRentalOpen(false);
        }}
        projectId={rentalProjectId}
        liveRentals={rentalRows}
      />
    </>
  );
}
