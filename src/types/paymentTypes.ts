export type InstallmentStatus = "overdue" | "scheduled" | "upcoming";
export type PaymentMethod = "card" | "wallet";
export type PaymentStatus = "paid" | "pending" | "overdue";

export interface ProjectPaymentRow {
  id: string;
  projectId: string;
  project: string;
  farmer: string;
  milestone: string;
  dueDate: string;
  paidDate?: string;
  amount: string;
  paymentStatus: PaymentStatus;
}

export interface RentalRow {
  id: string;
  projectId: string;
  project: string;
  landowner: string;
  landArea: string;
  month: string;
  dueDate: string;
  amount: string;
  status: PaymentStatus;
}

export interface PaymentItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: "overdue" | "scheduled";
}

export interface UnifiedRow {
  id: string;
  projectId: string;
  project: string;
  description: string;
  counterparty: string;
  counterpartyRole: "Farmer" | "Landowner";
  dueDate: string;
  settledDate?: string;
  amount: string;
  status: PaymentStatus;
}
