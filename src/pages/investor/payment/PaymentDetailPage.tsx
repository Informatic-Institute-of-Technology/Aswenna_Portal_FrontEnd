import { comprehensiveProjectsData } from "@/data/json";
import type { PaymentItem, RentalRow } from "@/types/paymentTypes";
import {
  AccountBalanceWallet,
  ArrowForward,
  CalendarToday,
  CheckCircle,
  Download,
  HourglassTop,
  LocationOn,
  OpenInNew,
  Payments,
  ShowChart,
  Tag,
  Upcoming,
} from "@mui/icons-material";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { useMemo, useState } from "react";
import { RingChart } from "./components";
import { PayInstallmentDialog } from "./PayInstallmentPage";

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
}
interface RawRental {
  id: string;
  landArea: string;
  month: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}
interface RawLandownerProject {
  id: string;
  projectId: string;
  projectName: string;
  landownerName: string;
  landownerId?: string;
  location: string;
  startDate: string;
  landRentals?: RawRental[];
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

export interface PaymentDetailProps {
  type: "farmer" | "landowner";
  projectId?: string;
  paymentId?: string;
  liveRentals?: RentalRow[];
  onClose?: () => void;
  onPaymentSuccess?: (paidIds: string[]) => void;
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

export function PaymentDetailContent({
  type,
  projectId,
  paymentId,
  liveRentals,
  onClose,
  onPaymentSuccess,
  isDialog,
}: PaymentDetailProps) {
  const [payOpen, setPayOpen] = useState(false);
  const [payInitialIds, setPayInitialIds] = useState<string[] | undefined>(
    undefined,
  );

  const openPayForItem = (itemId: string) => {
    setPayInitialIds([itemId]);
    setPayOpen(true);
  };
  const openPayForAll = () => {
    setPayInitialIds(undefined);
    setPayOpen(true);
  };
  const isFarmer = type === "farmer";

  const farmerProject = useMemo((): RawFarmerProject | null => {
    if (!isFarmer || !projectId) return null;
    return (
      (comprehensiveProjectsData as RawFarmerProject[]).find(
        (p) => p.id === projectId,
      ) ?? null
    );
  }, [isFarmer, projectId]);

  const milestoneItems = useMemo((): LineItem[] => {
    if (!farmerProject) return [];
    const paymentMap: Record<string, RawProjPmt> = Object.fromEntries(
      farmerProject.payments.map((p) => [p.milestoneId, p]),
    );
    return farmerProject.milestones.map((ms, idx): LineItem => {
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
      const isPrimary =
        pmt?.id === paymentId ||
        (!paymentId &&
          isActive &&
          !farmerProject.milestones.slice(0, idx).some((_, i) => {
            const p2 = paymentMap[farmerProject.milestones[i].id];
            return (
              p2 &&
              (p2.status === "overdue" || p2.status === "pending") &&
              farmerProject.milestones[i].status !== "completed"
            );
          }));
      void isPrimary;
      return {
        id: pmt?.id ?? ms.id,
        title: ms.title,
        subtitle: isCompleted
          ? `Milestone ${idx + 1} · Completed on ${fmtD(ms.completedDate ?? pmt?.paidDate ?? "")}`
          : isActive
            ? `Milestone ${idx + 1} · Due ${fmtD(pmt!.dueDate)}`
            : `Milestone ${idx + 1} · Scheduled ${fmtD(ms.endDate ?? "")}`,
        amount: pmt?.amount ?? ms.payment ?? 0,
        status,
        rawStatus: pmt?.status ?? (isCompleted ? "paid" : "upcoming"),
        dueDate: pmt ? fmtD(pmt.dueDate) : fmtD(ms.endDate ?? ""),
        detail: ms.tasks ? `${ms.tasks.total} tasks` : "See contract",
        showReceiptLink: true,
      };
    });
  }, [farmerProject, paymentId]);

  const landownerProject = useMemo((): RawLandownerProject | null => {
    if (isFarmer || !projectId) return null;
    return (
      (comprehensiveProjectsData as RawLandownerProject[]).find(
        (p) => p.id === projectId,
      ) ?? null
    );
  }, [isFarmer, projectId]);

  const rentalItems = useMemo((): LineItem[] => {
    if (!landownerProject?.landRentals) return [];
    const liveStatusMap: Record<string, string> = {};
    if (liveRentals) {
      liveRentals
        .filter((r) => r.projectId === projectId)
        .forEach((r) => (liveStatusMap[r.id] = r.status));
    }
    return landownerProject.landRentals.map((r): LineItem => {
      const liveStatus = liveStatusMap[r.id] ?? r.status;
      const isPaid = liveStatus === "paid";
      const isOverdue = liveStatus === "overdue";
      const status: LineItem["status"] = isPaid
        ? "paid"
        : liveStatus === "pending" || isOverdue
          ? "pending"
          : "upcoming";
      return {
        id: r.id,
        title: r.month,
        subtitle: isPaid
          ? `Paid on ${fmtD(r.paidDate ?? "")}`
          : isOverdue
            ? `Overdue · Due ${fmtD(r.dueDate)}`
            : `Due ${fmtD(r.dueDate)}`,
        amount: r.amount,
        status,
        rawStatus: liveStatus,
        dueDate: fmtD(r.dueDate),
        detail: r.landArea,
        showReceiptLink: false,
      };
    });
  }, [landownerProject, liveRentals, projectId]);

  const lineItems = isFarmer ? milestoneItems : rentalItems;

  const TOTAL = lineItems.reduce((s, i) => s + i.amount, 0);
  const PAID = lineItems
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);
  const PENDING_AMT = lineItems
    .filter((i) => i.status === "pending")
    .reduce((s, i) => s + i.amount, 0);
  const PCT = TOTAL > 0 ? Math.round((PAID / TOTAL) * 100) : 0;

  const pendingPayments = useMemo(
    (): PaymentItem[] =>
      lineItems
        .filter((i) => i.status === "pending" && i.id)
        .map((i) => ({
          id: i.id,
          name: isFarmer ? i.title : `Land Rent · ${i.title}`,
          amount: i.amount,
          dueDate: i.dueDate,
          status: (i.rawStatus === "overdue" ? "overdue" : "scheduled") as
            | "overdue"
            | "scheduled",
        })),
    [lineItems, isFarmer],
  );
  const rawProj = isFarmer ? farmerProject : landownerProject;
  const recipientId = isFarmer
    ? farmerProject?.farmerId
    : landownerProject?.landownerId;
  const projName = rawProj?.projectName ?? "—";
  const projId = rawProj ? `#${rawProj.projectId}` : "—";
  const projLoc = rawProj ? `${rawProj.location}, LK` : "—";

  const farmerSubtitle = farmerProject
    ? `Started ${new Date(farmerProject.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "—";
  const cropLabel = farmerProject?.cropType ?? farmerProject?.projectId ?? "";

  const landownerName = (landownerProject as RawLandownerProject | null)
    ?.landownerName;
  const landArea =
    rentalItems[0]?.detail ??
    landownerProject?.landRentals?.[0]?.landArea ??
    "—";

  const titleSuffix = isFarmer
    ? cropLabel
      ? ` — ${cropLabel}`
      : ""
    : " — Land Rental";
  const badgeLabel = isFarmer ? "Active" : "Landowner";
  const progressLabel = isFarmer
    ? "Overall Completion"
    : "Rental Payment Progress";
  const timelineLabel = isFarmer
    ? "Payment Timeline"
    : "Monthly Rental Schedule";
  const summaryLabel = isFarmer
    ? "Payment Progress"
    : "Rental Payment Progress";
  const totalLabel = isFarmer ? "Total Budget" : "Total Rent";
  const helpText = isFarmer
    ? "Questions about invoices or milestones?"
    : "Questions about land rental or invoices?";
  const downloadLabel = isFarmer ? "Contract & Invoice" : "Rental Agreement";
  const accentColor = (raw: string) =>
    raw === "overdue" ? "var(--color-overdue)" : "var(--color-olive)";

  return (
    <>
      <div
        style={{
          background: "var(--bg-surface)",
          fontFamily: "Inter, sans-serif",
          color: "var(--text-primary)",
          minHeight: 500,
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: "1px solid var(--bg-subtle)",
            background: "var(--bg-surface)",
          }}
        >
          <div className="flex items-center gap-3">
            {isDialog && onClose && (
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: "var(--text-secondary)",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                ✕
              </IconButton>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-white text-xl font-bold tracking-tight">
                  {projName}
                  {titleSuffix}
                </h1>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--color-olive-glow-sm)",
                    color: "var(--color-olive)",
                    border: "1px solid var(--color-olive-glow)",
                  }}
                >
                  {badgeLabel}
                </span>
              </div>
              <div
                className="flex flex-wrap items-center gap-4 mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                <span className="flex items-center gap-1 text-xs">
                  <Tag sx={{ fontSize: 13 }} /> {projId}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <LocationOn sx={{ fontSize: 13 }} /> {projLoc}
                </span>
                {isFarmer ? (
                  <span className="flex items-center gap-1 text-xs">
                    <CalendarToday sx={{ fontSize: 13 }} /> {farmerSubtitle}
                  </span>
                ) : (
                  <>
                    <span className="flex items-center gap-1 text-xs">
                      <AccountBalanceWallet sx={{ fontSize: 13 }} />{" "}
                      {landownerName}
                    </span>
                    <span className="text-xs">Land Area: {landArea}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all hover:text-white"
            style={{
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-medium)",
              color: "var(--text-secondary)",
            }}
          >
            <Download sx={{ fontSize: 15 }} /> {downloadLabel}
          </button>
        </div>

        <div
          className="px-6 py-4"
          style={{
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--bg-subtle)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {progressLabel}
            </span>
            <span className="text-xs font-bold text-white">
              {PCT}% · Rs.{PAID.toLocaleString()} of Rs.{TOTAL.toLocaleString()}
            </span>
          </div>
          <div
            className="relative h-2 rounded-full overflow-hidden"
            style={{ background: "var(--bg-subtle)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${PCT}%`,
                background:
                  "linear-gradient(90deg, var(--color-brand-accent) 0%, var(--color-brand-accent) 60%, var(--color-brand-accent) 100%)",
                boxShadow: "0 0 10px var(--color-brand-accent-muted)",
                transition: "width 1s cubic-bezier(.45,0,.55,1)",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div
            className="lg:col-span-8 p-6 md:p-8"
            style={{ borderRight: "1px solid var(--bg-subtle)" }}
          >
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <ShowChart sx={{ color: "var(--color-olive)", fontSize: 20 }} />
                <span className="text-white font-bold text-base">
                  {timelineLabel}
                </span>
              </div>
              {pendingPayments.length > 1 && (
                <button
                  onClick={openPayForAll}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-white transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #6b8e23, #5a7519)",
                    boxShadow: "0 2px 8px rgba(107, 142, 35, 0.4)",
                  }}
                >
                  <Payments sx={{ fontSize: 14 }} />
                  Pay All Pending ({pendingPayments.length})
                </button>
              )}
            </div>

            <div className="relative pl-5">
              <div
                className="absolute left-[20px] top-4 bottom-6 w-px"
                style={{ background: "var(--bg-subtle)" }}
              />

              {lineItems.map((item, idx) => (
                <div key={item.id ?? idx} className="relative pl-10 mb-2">
                  {item.status === "paid" ? (
                    <div
                      className="absolute left-0 top-2.5 w-7 h-7 -translate-x-1/2 rounded-full flex items-center justify-center"
                      style={{
                        background: "#4cbb52",
                        boxShadow: "0 0 6px rgba(76,187,82,0.35)",
                      }}
                    >
                      <CheckCircle sx={{ color: "#0d2e10", fontSize: 14 }} />
                    </div>
                  ) : item.status === "pending" ? (
                    <div
                      className="absolute left-0 top-2.5 w-7 h-7 -translate-x-1/2 rounded-full flex items-center justify-center animate-pulse"
                      style={{
                        background: "var(--bg-surface)",
                        border: `2.5px solid ${accentColor(item.rawStatus)}`,
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: accentColor(item.rawStatus) }}
                      />
                    </div>
                  ) : (
                    <div
                      className="absolute left-0 top-2.5 w-7 h-7 -translate-x-1/2 rounded-full flex items-center justify-center"
                      style={{ background: "var(--bg-subtle)" }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "var(--neutral-600)" }}
                      />
                    </div>
                  )}
                  {item.status === "paid" && (
                    <div
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">
                          {item.title}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--neutral-500)" }}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-bold text-white whitespace-nowrap">
                        Rs.{item.amount.toLocaleString()}
                      </span>
                      <span
                        className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{
                          background: "var(--color-olive-muted)",
                          color: "var(--color-olive)",
                          border: "1px solid var(--color-olive-muted-strong)",
                        }}
                      >
                        <CheckCircle sx={{ fontSize: 10 }} /> Paid
                      </span>
                      <button
                        className="flex items-center gap-0.5 text-xs transition-colors hover:text-white whitespace-nowrap"
                        style={{ color: "var(--neutral-600)" }}
                      >
                        <OpenInNew sx={{ fontSize: 11 }} />
                      </button>
                    </div>
                  )}

                  {item.status === "pending" && (
                    <div
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg relative overflow-hidden"
                      style={{
                        background:
                          item.rawStatus === "overdue"
                            ? "var(--color-overdue-muted)"
                            : "var(--color-pending-muted)",
                        border: `1px solid ${item.rawStatus === "overdue" ? "var(--color-overdue-border)" : "var(--color-pending-border)"}`,
                      }}
                    >
                      <div
                        className="absolute top-0 left-0 w-0.5 h-full"
                        style={{
                          background:
                            item.rawStatus === "overdue"
                              ? "var(--color-overdue)"
                              : "var(--color-pending)",
                        }}
                      />
                      <div className="flex-1 min-w-0 pl-1">
                        <p className="text-white text-xs font-semibold truncate">
                          {item.title}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{
                            color:
                              item.rawStatus === "overdue"
                                ? "var(--color-overdue)"
                                : "var(--color-pending)",
                          }}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                      <span
                        className="text-xs whitespace-nowrap"
                        style={{ color: "var(--neutral-400)" }}
                      >
                        <CalendarToday sx={{ fontSize: 10, mr: 0.3 }} />
                        {item.dueDate}
                      </span>
                      <span className="font-mono text-sm font-bold text-white whitespace-nowrap">
                        Rs.{item.amount.toLocaleString()}
                      </span>
                      <span
                        className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={
                          item.rawStatus === "overdue"
                            ? {
                                background: "var(--color-overdue-muted)",
                                color: "var(--color-overdue)",
                                border: "1px solid var(--color-error-bg)",
                              }
                            : {
                                background: "var(--color-pending-muted)",
                                color: "var(--color-pending)",
                                border: "1px solid var(--color-warning-bg)",
                              }
                        }
                      >
                        <HourglassTop sx={{ fontSize: 10 }} />
                        {item.rawStatus === "overdue" ? "Overdue" : "Pending"}
                      </span>
                      <button
                        onClick={() =>
                          openPayForItem(item.id ?? String(item.title))
                        }
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-[0.97] whitespace-nowrap"
                        style={{
                          background:
                            "linear-gradient(135deg, #6b8e23, #5a7519)",
                          boxShadow: "0 2px 8px rgba(107, 142, 35, 0.4)",
                        }}
                      >
                        <Payments sx={{ fontSize: 13 }} /> Pay
                      </button>
                    </div>
                  )}

                  {item.status === "upcoming" && (
                    <div
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg opacity-50 hover:opacity-75 transition-opacity"
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px dashed var(--bg-subtle)",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: "var(--neutral-400)" }}
                        >
                          {item.title}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--neutral-600)" }}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                      <span
                        className="font-mono text-sm font-semibold whitespace-nowrap"
                        style={{ color: "var(--neutral-500)" }}
                      >
                        Rs.{item.amount.toLocaleString()}
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{
                          background: "var(--bg-surface)",
                          color: "var(--neutral-500)",
                        }}
                      >
                        Upcoming
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div
            className="lg:col-span-4 p-6"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="sticky top-6 flex flex-col gap-5">
              <div>
                <p
                  className="text-xs uppercase tracking-widest font-semibold mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {summaryLabel}
                </p>
                <div className="w-48 h-48 mx-auto">
                  <RingChart
                    pct={PCT}
                    color="var(--color-brand-primary)"
                    centerLabel={`Rs.${PAID.toLocaleString()}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    Icon: AccountBalanceWallet,
                    label: totalLabel,
                    val: `Rs.${TOTAL.toLocaleString()}`,
                    accent: "var(--neutral-400)",
                    bg: "var(--surface-muted)",
                    border: "var(--surface-light)",
                  },
                  {
                    Icon: CheckCircle,
                    label: "Paid",
                    val: `Rs.${PAID.toLocaleString()}`,
                    accent: "var(--color-brand-primary)",
                    bg: "var(--color-brand-muted)",
                    border: "var(--color-brand-muted)",
                  },
                  {
                    Icon: HourglassTop,
                    label: "Pending",
                    val: `Rs.${PENDING_AMT.toLocaleString()}`,
                    accent: "var(--color-brand-accent)",
                    bg: "var(--color-brand-accent-muted)",
                    border: "var(--color-brand-accent-muted)",
                  },
                  {
                    Icon: Upcoming,
                    label: "Remaining",
                    val: `Rs.${(TOTAL - PAID).toLocaleString()}`,
                    accent: "var(--color-info)",
                    bg: "var(--color-info-bg)",
                    border: "var(--color-info-bg)",
                  },
                ].map(({ Icon, label, val, accent, bg, border }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-2 p-3 rounded-xl"
                    style={{ background: bg, border: `1px solid ${border}` }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${accent}22` }}
                    >
                      <Icon sx={{ color: accent, fontSize: 16 }} />
                    </div>
                    <div>
                      <p
                        className="text-xs"
                        style={{ color: "var(--neutral-400)" }}
                      >
                        {label}
                      </p>
                      <p
                        className="font-bold text-sm font-mono leading-tight"
                        style={{ color: accent }}
                      >
                        {val}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="p-4 rounded-xl"
                style={{
                  background: "var(--bg-overlay)",
                  border: "1px solid var(--bg-subtle)",
                }}
              >
                <p className="text-white text-sm font-semibold mb-1">
                  Need Help?
                </p>
                <p
                  className="text-xs mb-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {helpText}
                </p>
                <button
                  className="text-xs font-semibold flex items-center gap-1 transition-colors hover:opacity-80"
                  style={{ color: "var(--color-olive)" }}
                >
                  Contact Support <ArrowForward sx={{ fontSize: 13 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PayInstallmentDialog
        key={payInitialIds?.join(",") ?? "all"}
        open={payOpen}
        onClose={() => setPayOpen(false)}
        onPaymentSuccess={(paidIds) => {
          setPayOpen(false);
          onPaymentSuccess?.(paidIds);
        }}
        payments={pendingPayments}
        initialSelectedIds={payInitialIds}
        recipientId={recipientId}
        recipientName={isFarmer ? undefined : landownerProject?.landownerName}
      />
    </>
  );
}

export function PaymentDetailDialog({
  open,
  onClose,
  onPaymentSuccess,
  type,
  projectId,
  paymentId,
  liveRentals,
}: {
  open: boolean;
  onClose: () => void;
  onPaymentSuccess?: (paidIds: string[]) => void;
  type: "farmer" | "landowner";
  projectId?: string;
  paymentId?: string;
  liveRentals?: RentalRow[];
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "transparent",
          boxShadow: "0 24px 80px var(--overlay-xl)",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid var(--border-medium)",
          maxHeight: "92vh",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--border-medium)",
            borderRadius: 3,
          },
        }}
      >
        <PaymentDetailContent
          type={type}
          onClose={onClose}
          onPaymentSuccess={onPaymentSuccess}
          isDialog
          projectId={projectId}
          paymentId={paymentId}
          liveRentals={liveRentals}
        />
      </DialogContent>
    </Dialog>
  );
}

export function ProjectPaymentMilestoneContent(props: {
  onClose?: () => void;
  onPaymentSuccess?: (paidIds: string[]) => void;
  isDialog?: boolean;
  projectId?: string;
  paymentId?: string;
}) {
  return <PaymentDetailContent type="farmer" {...props} />;
}

export function ProjectPaymentMilestoneDialog(props: {
  open: boolean;
  onClose: () => void;
  onPaymentSuccess?: (paidIds: string[]) => void;
  projectId?: string;
  paymentId?: string;
}) {
  return <PaymentDetailDialog type="farmer" {...props} />;
}

export function LandownerRentalContent(props: {
  onClose?: () => void;
  onPaymentSuccess?: (paidIds: string[]) => void;
  isDialog?: boolean;
  projectId?: string;
  liveRentals?: RentalRow[];
}) {
  return <PaymentDetailContent type="landowner" {...props} />;
}

export function LandownerRentalDialog(props: {
  open: boolean;
  onClose: () => void;
  onPaymentSuccess?: (paidIds: string[]) => void;
  projectId?: string;
  liveRentals?: RentalRow[];
}) {
  return <PaymentDetailDialog type="landowner" {...props} />;
}

export default function PaymentDetailPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-surface)" }}>
      <PaymentDetailContent type="farmer" />
    </div>
  );
}
