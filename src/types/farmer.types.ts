/**
 * Farmer Job Types
 * Defines interfaces for two types of farmer job postings:
 * 1. Harvest Capital Sponsoring - Farmers requesting investment
 * 2. Commission Job - Farmers offering services for hire
 */

export const FarmerJobType = {
  HARVEST_CAPITAL: 'HARVEST_CAPITAL',
  COMMISSION: 'COMMISSION'
} as const;

export type FarmerJobType = typeof FarmerJobType[keyof typeof FarmerJobType];

export const JobStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CLOSED: 'CLOSED'
} as const;

export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

/**
 * Budget breakdown item for harvest capital requests
 */
export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimatedCost: number;
}

/**
 * Payment installment schedule for investment requests
 */
export interface PaymentInstallment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string; // ISO date
  milestone: string; // e.g., "Project Start", "Mid-season", "Harvest"
  status?: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
}

/**
 * Investment Request from Farmer
 * Farmer creates a detailed funding request for cultivation
 * Only ONE investor can invest in each project
 */
export interface InvestmentRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerImage?: string;
  farmerExperience?: number;
  farmerRating?: number;
  
  // Project Details
  projectTitle: string;
  description: string;
  cropType: string;
  cropVariety?: string;
  landSize: number;
  landSizeUnit: 'acres' | 'hectares';
  location: string;
  district: string;
  province: string;
  
  // Cost Breakdown (automatically calculated total)
  costBreakdown: BudgetItem[];
  totalInvestmentRequired: number; // Auto-calculated from costBreakdown
  
  // Investment Terms
  fundingDeadline: string; // Last date to accept funding
  installmentSchedule: PaymentInstallment[]; // 3 to 6 installments
  expectedDuration: number; // in months
  expectedYield: string;
  expectedROI: number; // percentage
  
  // Investor Details (null until accepted)
  investorId?: string;
  investorName?: string;
  investorCommissionRate?: number; // Investor adds this before accepting
  acceptedAt?: string;
  
  // Status
  status: 'open' | 'funded' | 'in-progress' | 'completed' | 'cancelled';
  
  // Additional Details
  farmingMethod: 'organic' | 'conventional' | 'mixed';
  certifications?: string[];
  previousExperience?: string;
  collateral?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Base interface for all farmer job postings
 */
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

/**
 * Harvest Capital Sponsoring Job
 * Farmers request investment capital for cultivation
 */
export interface HarvestCapitalJob extends BaseFarmerJob {
  jobType: typeof FarmerJobType.HARVEST_CAPITAL;
  totalInvestmentRequired: number;
  investmentSecured: number;
  cropType: string;
  landSize: number; // in acres
  landSizeUnit: string;
  expectedDuration: number; // in months
  expectedYield: string;
  expectedROI: number; // percentage
  budgetBreakdown: BudgetItem[];
  farmingMethod: string; // organic, conventional, etc.
  certifications?: string[];
  previousExperience?: string;
  collateral?: string;
}

/**
 * Commission Job
 * Farmers offering their services/expertise for hire
 */
export interface CommissionJob extends BaseFarmerJob {
  jobType: typeof FarmerJobType.COMMISSION;
  serviceType: string; // harvesting, planting, maintenance, etc.
  rate: number;
  rateType: 'HOURLY' | 'DAILY' | 'PROJECT' | 'PER_ACRE';
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
  workRadius: number; // kilometers willing to travel
  minProjectSize?: number;
  maxProjectSize?: number;
}

/**
 * Union type for all farmer jobs
 */
export type FarmerJob = HarvestCapitalJob | CommissionJob;

/**
 * Filter options for farmer job search
 */
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
