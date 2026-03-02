import type { User } from "@/Context/createAuthContext";
import { useAuth } from "@/Context/useAuth";
import { userService } from "@/services/user.service";
import type {
  InstallmentStatus,
  PaymentItem,
  PaymentMethod,
} from "@/types/paymentTypes";
import {
  AccountBalanceWallet,
  ArrowBack,
  ArrowForward,
  TaskAlt,
} from "@mui/icons-material";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { StatusBadge } from "./components";

const STATUS_COLORS: Record<InstallmentStatus, string> = {
  overdue: "var(--color-overdue)",
  scheduled: "var(--color-pending)",
  upcoming: "var(--neutral-600)555",
};

export function PayInstallmentContent({
  onClose,
  onPaymentSuccess,
  isDialog,
  payments,
  initialSelectedIds,
  recipientId,
  recipientName,
}: {
  onClose?: () => void;
  onPaymentSuccess?: (paidIds: string[]) => void;
  isDialog?: boolean;
  payments?: PaymentItem[];
  initialSelectedIds?: string[];
  recipientId?: string;
  recipientName?: string;
}) {
  const installments: {
    id: string;
    name: string;
    dueDate: string;
    status: InstallmentStatus;
    amount: number;
    selectable: boolean;
  }[] = (payments ?? []).map((p) => ({ ...p, selectable: true }));

  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedIds ??
      installments.filter((i) => i.selectable).map((i) => i.id),
  );
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const { user: authUser } = useAuth();
  const [recipientUser, setRecipientUser] = useState<User | null>(null);

  useEffect(() => {
    if (!recipientId) return;
    userService
      .getUserProfile(recipientId)
      .then(setRecipientUser)
      .catch(() => setRecipientUser(null));
  }, [recipientId]);

  const toggle = (id: string) =>
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  const toggleAll = () => {
    const ids = installments.filter((i) => i.selectable).map((i) => i.id);
    setSelectedIds(selectedIds.length === ids.length ? [] : ids);
  };

  const selected = installments.filter((i) => selectedIds.includes(i.id));
  const subtotal = selected.reduce((s, i) => s + i.amount, 0);
  const bankFee = 25;
  const platformCharge = parseFloat((subtotal * 0.0025).toFixed(2));
  const total = subtotal + bankFee + platformCharge;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
    }, 1600);
  };

  const METHODS: {
    key: PaymentMethod;
    logo: React.ReactNode;
    label: string;
  }[] = [
    {
      key: "card",
      logo: (
        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center justify-center w-10 h-7 rounded"
            style={{ background: "#1a1f71" }}
          >
            <span
              style={{
                color: "#fff",
                fontStyle: "italic",
                fontWeight: 900,
                fontSize: 12,
                letterSpacing: 0.5,
              }}
            >
              VISA
            </span>
          </div>
          <div
            className="flex items-center justify-center w-10 h-7 rounded"
            style={{ background: "#252525" }}
          >
            <div style={{ position: "relative", width: 28, height: 18 }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#eb001b",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 10,
                  top: 0,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#f79e1b",
                  opacity: 0.92,
                }}
              />
            </div>
          </div>
        </div>
      ),
      label: "Visa / Mastercard",
    },
    {
      key: "wallet",
      logo: (
        <div className="flex items-center justify-center w-12 h-8">
          <AccountBalanceWallet
            sx={{ color: "var(--color-olive)", fontSize: 26 }}
          />
        </div>
      ),
      label: "Aswenna Wallet",
    },
  ];

  if (done) {
    return (
      <div
        className="flex flex-col items-center gap-6 py-16 px-8"
        style={{
          background: "var(--bg-surface)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "var(--color-olive-glow-sm)",
            border: "1px solid var(--color-olive-glow)",
          }}
        >
          <TaskAlt sx={{ color: "var(--color-olive)", fontSize: 44 }} />
        </div>
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-2">
            Payment Confirmed
          </h2>
          <p style={{ color: "var(--text-secondary)" }} className="text-sm">
            Transaction of{" "}
            <span className="text-white font-semibold">
              Rs.{total.toLocaleString()}
            </span>{" "}
            processed successfully.
          </p>
        </div>
        <button
          onClick={() => {
            const paidIds = selected.map((i) => i.id);
            setDone(false);
            setSelectedIds(
              installments.filter((i) => i.selectable).map((i) => i.id),
            );
            onPaymentSuccess?.(paidIds);
            onClose?.();
          }}
          className="px-8 py-3 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(135deg,var(--color-olive),var(--color-olive-light))",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row w-full"
      style={{
        background: "var(--bg-surface)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="flex-1 p-8 md:p-10 flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            {isDialog && onClose && (
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: "var(--text-secondary)",
                  p: 0.5,
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                <ArrowBack sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            <h1 className="text-white text-2xl font-bold tracking-tight">
              Payment Execution
            </h1>
          </div>
          <p
            className="text-sm pl-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Review your installments and complete the transaction securely.
          </p>
        </div>

        <div style={{ height: 1, background: "var(--border-medium)" }} />

        <div>
          <h3
            className="text-white font-semibold text-sm mb-3 uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}
          >
            Select Installments
          </h3>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border-medium)" }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  style={{
                    background: "var(--bg-elevated)",
                    borderBottom: "1px solid var(--border-medium)",
                  }}
                >
                  <th className="px-4 py-2.5 w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length ===
                        installments.filter((i) => i.selectable).length
                      }
                      onChange={toggleAll}
                      className="h-4 w-4 rounded"
                      style={{ accentColor: "var(--color-olive)" }}
                    />
                  </th>
                  {["Installment", "Due Date", "Status", "Amount"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider ${i === 3 ? "text-right" : ""}`}
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {installments.map((inst, idx) => {
                  return (
                    <tr
                      key={inst.id}
                      onClick={() => inst.selectable && toggle(inst.id)}
                      style={{
                        borderTop:
                          idx > 0 ? "1px solid var(--bg-subtle)" : undefined,
                        background: selectedIds.includes(inst.id)
                          ? "var(--color-olive-muted)"
                          : "transparent",
                        cursor: inst.selectable ? "pointer" : "not-allowed",
                        opacity: inst.selectable ? 1 : 0.5,
                        transition: "background 0.15s",
                      }}
                      className="hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(inst.id)}
                          disabled={!inst.selectable}
                          onChange={() => {}}
                          className="h-4 w-4 rounded"
                          style={{ accentColor: "var(--color-olive)" }}
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-white text-sm font-medium">
                          {inst.name}
                        </span>
                      </td>
                      <td
                        className="px-4 py-2.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {inst.dueDate}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge
                          label={
                            inst.status.charAt(0).toUpperCase() +
                            inst.status.slice(1)
                          }
                          color={STATUS_COLORS[inst.status]}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-right text-white text-sm font-semibold font-mono">
                        Rs.{inst.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="rounded-xl p-4"
          style={{
            border: "1px solid var(--border-medium)",
            background: "var(--bg-elevated)",
          }}
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Paying From
              </p>
              <p className="text-white text-sm font-semibold">
                {authUser?.fullName ||
                  [authUser?.firstName, authUser?.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                  "—"}
              </p>
              {authUser?.email && (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {authUser.email}
                </p>
              )}
              {authUser?.phoneNumber && (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {authUser.phoneNumber}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center pt-4">
              <ArrowForward
                sx={{ color: "var(--color-olive)", fontSize: 20 }}
              />
            </div>

            <div className="flex-1 text-right">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Paying To
              </p>
              <p className="text-white text-sm font-semibold">
                {recipientUser?.fullName ||
                  [recipientUser?.firstName, recipientUser?.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                  recipientName ||
                  "—"}
              </p>
              {recipientUser?.email && (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {recipientUser.email}
                </p>
              )}
              {recipientUser?.phoneNumber && (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {recipientUser.phoneNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full md:w-[380px] p-8 md:p-10 flex flex-col justify-between"
        style={{
          background: "var(--bg-surface)",
          borderLeft: "1px solid var(--border-medium)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div className="flex flex-col gap-5">
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Payment Method
            </h3>
            <div className="flex flex-col gap-1.5">
              {METHODS.map(({ key, logo, label }) => {
                const active = method === key;
                return (
                  <button
                    key={key}
                    onClick={() => setMethod(key)}
                    className="relative flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all"
                    style={{
                      background: active
                        ? "var(--color-olive-muted)"
                        : "var(--bg-elevated)",
                      border: `1px solid ${active ? "var(--color-olive)" : "var(--border-medium)"}`,
                      boxShadow: active
                        ? "0 0 0 1px var(--color-olive)"
                        : "none",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <div className="shrink-0">{logo}</div>
                    <div className="flex-1 min-w-0">
                      <span className="text-white text-sm font-semibold block">
                        {label}
                      </span>
                    </div>
                    <div
                      className="shrink-0 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors"
                      style={{
                        borderColor: active
                          ? "var(--color-olive)"
                          : "var(--border-medium)",
                      }}
                    >
                      {active && (
                        <div className="w-2 h-2 rounded-full bg-[var(--color-olive)]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--border-medium)" }} />

          <h3 className="text-white font-bold text-base">Payment Summary</h3>

          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-medium)",
            }}
          >
            {[
              {
                label: "Subtotal",
                val: `Rs.${subtotal.toLocaleString()}`,
                cls: "text-white",
              },
              {
                label: "Bank Charges Fee",
                val: `Rs.${bankFee.toFixed(2)}`,
                cls: "text-white",
              },
              {
                label: "Platform Service (0.25%)",
                val: `Rs.${platformCharge.toFixed(2)}`,
                cls: "text-white",
              },
            ].map(({ label, val, cls }) => (
              <div
                key={label}
                className="flex justify-between items-center text-sm"
              >
                <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span className={`font-medium ${cls}`}>{val}</span>
              </div>
            ))}
            <div
              style={{
                height: 1,
                background: "var(--border-medium)",
                margin: "4px 0",
              }}
            />
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold text-sm">Total</span>
              <span className="text-white font-extrabold text-xl font-mono">
                Rs.{total.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {selected.length} of{" "}
            {installments.filter((i) => i.selectable).length} installments
            selected
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <button
            onClick={handlePay}
            disabled={selected.length === 0 || processing}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, var(--color-olive), var(--color-olive-light))",
              boxShadow: "0 4px 14px var(--color-olive-glow)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {processing ? (
              <>
                <CircularProgress
                  size={14}
                  sx={{ color: "var(--text-primary)" }}
                />{" "}
                Processing…
              </>
            ) : (
              <>
                <span>Confirm & Pay</span>
                <ArrowForward sx={{ fontSize: 16 }} />
              </>
            )}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-medium rounded-xl transition-colors hover:text-white"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PayInstallmentDialog({
  open,
  onClose,
  onPaymentSuccess,
  payments,
  initialSelectedIds,
  recipientId,
  recipientName,
}: {
  open: boolean;
  onClose: () => void;
  onPaymentSuccess?: (paidIds: string[]) => void;
  payments?: PaymentItem[];
  initialSelectedIds?: string[];
  recipientId?: string;
  recipientName?: string;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "transparent",
          boxShadow: "0 24px 64px var(--overlay-xl)",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid var(--border-medium)",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <PayInstallmentContent
          key={initialSelectedIds?.join(",") ?? "all"}
          onClose={onClose}
          onPaymentSuccess={onPaymentSuccess}
          isDialog
          payments={payments}
          initialSelectedIds={initialSelectedIds}
          recipientId={recipientId}
          recipientName={recipientName}
        />
      </DialogContent>
    </Dialog>
  );
}

export default function PayInstallmentPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--bg-surface)" }}
    >
      <div
        className="w-full max-w-[1024px] rounded-2xl overflow-hidden shadow-2xl"
        style={{ border: "1px solid var(--border-medium)" }}
      >
        <PayInstallmentContent />
      </div>
    </div>
  );
}
