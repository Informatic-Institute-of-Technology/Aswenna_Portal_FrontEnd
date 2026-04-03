export const FarmerJobType = {
  HARVEST_CAPITAL: "HARVEST_CAPITAL",
  COMMISSION: "COMMISSION",
} as const;

export type FarmerJobType = (typeof FarmerJobType)[keyof typeof FarmerJobType];

export const JobStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

export interface CostBreakdownItem {
  category: string;
  description: string;
  estimatedCost: number;
}

export interface MilestoneBreakdownItem {
  milestone: string;
  description: string;
  estimatedAmount: number;
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimatedCost: number;
}

export interface PaymentInstallment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  milestone: string;
  status?: "pending" | "paid" | "overdue";
  paidDate?: string;
}

export interface InvestmentRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerImage?: string;
  coverImageUrl?: string;
  farmerExperience?: number;
  farmerRating?: number;

  offerType?: "harvest" | "commission";

  projectTitle: string;
  description: string;
  cropType: string;
  cropIcon?: string;
  cropVariety?: string;
  landSize?: number;
  landSizeUnit?: "acres" | "hectares";
  location: string;
  preferredRegions?: string[];
  district?: string;
  province?: string;

  costBreakdown?: CostBreakdownItem[];
  milestoneBreakdown?: MilestoneBreakdownItem[];
  totalInvestmentRequired: number;

  fundingDeadline: string;
  installmentSchedule?: PaymentInstallment[];
  expectedDuration?: number;
  expectedYield?: string;
  expectedROI: number;

  commissionPercentage?: number;
  investmentAmount?: number;
  numberOfInstallments?: number;
  expectedLandArea?: number;

  investorId?: string;
  investorName?: string;
  investorCommissionRate?: number;
  acceptedAt?: string;

  status:
    | "open"
    | "funded"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "draft";

  farmingMethod?: "organic" | "conventional" | "mixed";
  certifications?: string[];
  previousExperience?: string;
  collateral?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface BaseFarmerJob {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerImage?: string;
  title: string;
  description: string;
  location: string;
  district: string;
  province: string;
  createdAt: string;
  updatedAt: string;
  status: JobStatus;
  jobType: FarmerJobType;
  tags: string[];
}

export interface HarvestCapitalJob extends BaseFarmerJob {
  jobType: typeof FarmerJobType.HARVEST_CAPITAL;
  totalInvestmentRequired: number;
  investmentSecured: number;
  cropType: string;
  landSize: number;
  landSizeUnit: string;
  expectedDuration: number;
  expectedYield: string;
  expectedROI: number;
  budgetBreakdown: BudgetItem[];
  farmingMethod: string;
  certifications?: string[];
  previousExperience?: string;
  collateral?: string;
}

export interface CommissionJob extends BaseFarmerJob {
  jobType: typeof FarmerJobType.COMMISSION;
  serviceType: string;
  rate: number;
  rateType: "HOURLY" | "DAILY" | "PROJECT" | "PER_ACRE";
  availability: string;
  skills: string[];
  yearsOfExperience: number;
  equipmentAvailable?: string[];
  teamSize?: number;
  previousProjects?: {
    projectName: string;
    client: string;
    description: string;
    completedDate: string;
  }[];
  workRadius: number;
  minProjectSize?: number;
  maxProjectSize?: number;
}

export type FarmerJob = HarvestCapitalJob | CommissionJob;

export interface FarmerJobFilters {
  jobType?: FarmerJobType;
  status?: JobStatus;
  location?: string;
  district?: string;
  province?: string;
  cropType?: string;
  minBudget?: number;
  maxBudget?: number;
  skills?: string[];
  searchQuery?: string;
}
