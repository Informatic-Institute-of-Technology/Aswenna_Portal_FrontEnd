import { comprehensiveProjectsData } from "@/data/json";
import type { FarmerPaymentRow, PaymentStatus } from "@/types/paymentTypes";
import { useCallback, useMemo, useState } from "react";

interface RawMilestone {
  id: string;
  title: string;
  status: string;
  completedDate?: string;
  endDate?: string;
  payment?: number;
}

interface RawPayment {
  id: string;
  milestoneId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
}

interface RawFarmerProject {
  id: string;
  projectId: string;
  projectName: string;
  cropType?: string;
  location: string;
  startDate: string;
  farmerId?: string;
  milestones?: RawMilestone[];
  payments?: RawPayment[];
  costBreakdown?: Array<{
    category: string;
    description?: string;
    estimatedCost: number;
  }>;
  investorName?: string;
  investorAmount?: number;
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
  });
}

export const useFarmerPaymentData = () => {
  const [paidPaymentIds, setPaidPaymentIds] = useState<Set<string>>(new Set());

  const projects = useMemo((): RawFarmerProject[] => {
    return comprehensiveProjectsData as RawFarmerProject[];
  }, []);

  const allPaymentRows = useMemo((): FarmerPaymentRow[] => {
    return projects.flatMap((proj) => {
      const paymentMap: Record<string, RawPayment> = {};
      (proj.payments ?? []).forEach((p) => {
        paymentMap[p.milestoneId] = p;
      });

      return (proj.milestones ?? []).map((milestone): FarmerPaymentRow => {
        const payment = paymentMap[milestone.id];
        const isCompleted = milestone.status === "completed";
        const isPending =
          payment &&
          (payment.status === "pending" || payment.status === "overdue");

        const effectiveStatus: PaymentStatus = paidPaymentIds.has(
          payment?.id ?? "",
        )
          ? "paid"
          : isPending
            ? (payment.status as PaymentStatus)
            : isCompleted
              ? "paid"
              : "pending";

        return {
          id: payment?.id ?? milestone.id,
          projectId: proj.id,
          project: proj.projectName,
          milestone: milestone.title,
          farmer: proj.investorName ?? "Investor",
          dueDate: fmtDate(payment?.dueDate ?? milestone.endDate ?? ""),
          amount: currencyFmt.format(payment?.amount ?? milestone.payment ?? 0),
          paymentStatus: effectiveStatus,
          paidDate: payment?.paidDate ? fmtDate(payment.paidDate) : undefined,
        };
      });
    });
  }, [projects, paidPaymentIds]);

  const overdueRows = useMemo(
    () => allPaymentRows.filter((r) => r.paymentStatus === "overdue"),
    [allPaymentRows],
  );

  const ongoingRows = useMemo(
    () => allPaymentRows.filter((r) => r.paymentStatus === "pending"),
    [allPaymentRows],
  );

  const paidRows = useMemo(
    () =>
      allPaymentRows.filter(
        (r) => r.paymentStatus === "paid" || paidPaymentIds.has(r.id),
      ),
    [allPaymentRows, paidPaymentIds],
  );

  const investmentRows = useMemo(
    (): FarmerPaymentRow[] =>
      projects.map((proj): FarmerPaymentRow => {
        const totalInvested = proj.investorAmount ?? 0;

        return {
          id: `INV-${proj.id}`,
          projectId: proj.id,
          project: proj.projectName,
          milestone: `Investment Received - ${proj.investorName ?? "Investor"}`,
          farmer: proj.investorName ?? "Investor",
          dueDate: fmtDate(proj.startDate),
          amount: currencyFmt.format(totalInvested),
          paymentStatus: "paid",
          paidDate: fmtDate(proj.startDate),
        };
      }),
    [projects],
  );

  const markPaid = useCallback((paymentId: string) => {
    setPaidPaymentIds((prev) => new Set([...prev, paymentId]));
  }, []);

  return {
    allPaymentRows,
    overdueRows,
    ongoingRows,
    paidRows,
    investmentRows,
    projects,
    markPaid,
  };
};
 