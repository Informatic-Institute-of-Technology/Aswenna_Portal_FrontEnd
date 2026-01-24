// Project Management Types for Farmer Portal

export type ProjectStatus = 'active' | 'completed' | 'cancelled' | 'draft';
export type EngagementModel = 'harvest-based' | 'commission-based';
export type ProjectPhase = 'planning' | 'preparation' | 'cultivation' | 'harvest' | 'post-harvest';

// Bill of Quantities (BOQ) for Harvest Based Projects
export interface BOQItem {
  id: string;
  section: string; // e.g., "Land Preparation", "Seeds & Planting", "Fertilizers"
  description: string;
  quantity: number;
  unit: string; // e.g., "acres", "kg", "hours"
  unitCost: number;
  totalCost: number; // quantity * unitCost
}

export interface BOQSection {
  name: string;
  items: BOQItem[];
  sectionTotal: number;
}

// Harvest Based Project Details
export interface HarvestBasedDetails {
  boqItems: BOQItem[];
  totalProjectCost: number;
  investorSharePercentage: number;
  farmerSharePercentage: number;
  estimatedYield: number;
  yieldUnit: string;
  estimatedRevenue: number;
}

// Commission Based Project Details
export interface CommissionBasedDetails {
  serviceDescription: string;
  commissionType: 'fixed' | 'percentage';
  commissionAmount?: number; // For fixed commission
  commissionPercentage?: number; // For percentage-based
  estimatedEarnings: number;
  portfolioDocuments?: string[]; // URLs to uploaded documents
}

// Main Project Interface
export interface Project {
  id: string;
  title: string;
  description: string;
  engagementModel: EngagementModel;
  status: ProjectStatus;
  currentPhase?: ProjectPhase;
  progressPercentage: number;
  
  // Location
  location: string;
  landSize: number;
  landUnit: string; // "acres", "hectares"
  
  // Dates
  createdAt: Date;
  startDate?: Date;
  expectedEndDate?: Date;
  actualEndDate?: Date;
  
  // Model-specific details
  harvestBasedDetails?: HarvestBasedDetails;
  commissionBasedDetails?: CommissionBasedDetails;
  
  // Participants
  investorId?: string;
  investorName?: string;
  
  // Financial tracking
  totalInvestment?: number;
  actualSpent?: number;
  revenue?: number;
  profit?: number;
}

// Form state for project creation wizard
export interface JobCreationState {
  step: number;
  engagementModel?: EngagementModel;
  
  // Basic Info (Step 1)
  title: string;
  description: string;
  location: string;
  landSize: number;
  landUnit: string;
  startDate: string;
  expectedEndDate: string;
  
  // Harvest Based (Step 2a)
  boqItems: BOQItem[];
  investorSharePercentage: number;
  estimatedYield: number;
  yieldUnit: string;
  estimatedRevenue: number;
  
  // Commission Based (Step 2b)
  serviceDescription: string;
  commissionType: 'fixed' | 'percentage';
  commissionAmount: number;
  commissionPercentage: number;
  estimatedEarnings: number;
  portfolioFiles: File[];
}
