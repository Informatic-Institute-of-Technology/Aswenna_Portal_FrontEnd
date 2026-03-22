import { useAuth } from "@/Context/useAuth";
import { comprehensiveProjectsData } from "@/data/json";
import type { ProjectPaymentRow, RentalRow } from "@/types/paymentTypes";
import { useCallback, useMemo, useState } from "react";

interface RawProjectPayment {
  id: string;
  milestoneId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
  description: string;
}

interface RawMilestone {
  id: string;
  title: string;
}

interface RawProjectRental {
  id: string;
  landArea: string;
  month: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

interface RawProject {
  id: string;
  investorId: string;
  projectName: string;
  farmerName: string;
  landownerName: string;
  milestones: RawMilestone[];
  payments: RawProjectPayment[];
  landRentals?: RawProjectRental[];
}

const currencyFmt = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  minimumFractionDigits: 2,
});

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function effectiveStatus(
  storedStatus: "paid" | "pending" | "overdue",
  dueDate: string,
  isLocallyPaid: boolean,
): "paid" | "pending" | "overdue" {
  if (isLocallyPaid || storedStatus === "paid") return "paid";
  if (storedStatus === "pending" && new Date(dueDate) < new Date())
    return "overdue";
  return storedStatus;
}

export interface PaymentDataResult {
  overdueRows: ProjectPaymentRow[];
  ongoingRows: ProjectPaymentRow[];
  paidRows: ProjectPaymentRow[];
  rentalRows: RentalRow[];
  markPaid: (id: string) => void;
}

export function usePaymentData(): PaymentDataResult {
  const { user } = useAuth();

  const [localPaidIds, setLocalPaidIds] = useState<Set<string>>(new Set());

  const projects = useMemo(
    () =>
      (comprehensiveProjectsData as RawProject[]).filter(
        (p) => p.investorId === user?._id,
      ),
    [user?._id],
  );

  const allPaymentRows = useMemo((): ProjectPaymentRow[] => {
    return projects.flatMap((proj) => {
      const milestoneTitle = Object.fromEntries(
        proj.milestones.map((m) => [m.id, m.title]),
      );
      return proj.payments.map((pmt): ProjectPaymentRow => {
        const isLocallyPaid = localPaidIds.has(pmt.id);
        return {
          id: pmt.id,
          projectId: proj.id,
          project: proj.projectName,
          farmer: proj.farmerName,
          milestone: milestoneTitle[pmt.milestoneId] ?? pmt.description,
          dueDate: fmtDate(pmt.dueDate),
          paidDate: isLocallyPaid
            ? fmtDate(new Date().toISOString())
            : pmt.paidDate
              ? fmtDate(pmt.paidDate)
              : undefined,
          amount: currencyFmt.format(pmt.amount),
          paymentStatus: effectiveStatus(
            pmt.status,
            pmt.dueDate,
            isLocallyPaid,
          ),
        };
      });
    });
  }, [projects, localPaidIds]);

  const overdueRows = useMemo(
    () => allPaymentRows.filter((r) => r.paymentStatus === "overdue"),
    [allPaymentRows],
  );

  const ongoingRows = useMemo(
    () => allPaymentRows.filter((r) => r.paymentStatus === "pending"),
    [allPaymentRows],
  );

  const paidRows = useMemo(
    () => allPaymentRows.filter((r) => r.paymentStatus === "paid"),
    [allPaymentRows],
  );

  const rentalRows = useMemo((): RentalRow[] => {
    return projects.flatMap((proj) =>
      (proj.landRentals ?? []).map((r): RentalRow => {
        const isLocallyPaid = localPaidIds.has(r.id);
        return {
          id: r.id,
          projectId: proj.id,
          project: proj.projectName,
          landowner: proj.landownerName,
          landArea: r.landArea,
          month: r.month,
          dueDate: fmtDate(r.dueDate),
          amount: currencyFmt.format(r.amount),
          status: effectiveStatus(r.status, r.dueDate, isLocallyPaid),
        };
      }),
    );
  }, [projects, localPaidIds]);

  const markPaid = useCallback((id: string) => {
    setLocalPaidIds((prev) => new Set([...prev, id]));
  }, []);

  return { overdueRows, ongoingRows, paidRows, rentalRows, markPaid };
}
