// Investor Types and Interfaces

export type OfferType = 'direct-harvest' | 'sponsorship';
export type OfferStatus = 'active' | 'pending' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';

/**
 * Direct Harvest Offer: Investor needs specific harvest quantity by deadline
 * Example: Sauce company needs 100KG tomatoes by specific date
 */
export interface DirectHarvestOffer {
  id: string;
  offerType: 'direct-harvest';
  
  // Investor Information
  investorName: string;
  projectTitle: string;
  companyName?: string;
  description: string;
  
  // Product Requirements
  cropType: string;
  cropVariety?: string;
  requiredQuantity: number; // in KG
  quantityUnit: 'kg' | 'tons' | 'units';
  qualityStandards?: string;
  deliveryDeadline: string; // ISO date
  
  // Location & Logistics
  preferredRegion?: string[];
  deliveryLocation: string;
  
  // Financial Terms
  totalBudget: number;
  pricePerUnit: number;
  currency: string;
  
  // Payment Schedule (Farmer will plan installments)
  paymentInstallments: PaymentInstallment[];
  
  // Status & Matching
  status: OfferStatus;
  applicationsCount: number;
  selectedFarmer?: FarmerMatch;
  selectedLandOwner?: LandOwnerMatch;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Sponsorship Offer: Investor sponsors farmers for commission on harvest
 * No direct harvest needed - just financial support for commission
 */
export interface SponsorshipOffer {
  id: string;
  offerType: 'sponsorship';
  
  // Investor Information
  investorName: string;
  sponsorshipTitle: string;
  description: string;
  
  // Sponsorship Details
  cropTypes: string[]; // Multiple crop types allowed
  preferredFarmingMethod?: 'organic' | 'conventional' | 'mixed';
  
  // Financial Terms
  minimumInvestment: number;
  maximumInvestment: number;
  commissionRate: number; // percentage (e.g., 15 means 15%)
  currency: string;
  
  // Support & Requirements
  supportType: ('capital' | 'equipment' | 'expertise' | 'marketing')[];
  minimumProjectDuration?: number; // in months
  maximumProjectDuration?: number; // in months
  
  // Geographic Preferences
  preferredRegions?: string[];
  
  // Payment Schedule (Farmer will plan installments)
  paymentInstallments: PaymentInstallment[];
  
  // Status & Matching
  status: OfferStatus;
  applicationsCount: number;
  selectedFarmer?: FarmerMatch;
  selectedLandOwner?: LandOwnerMatch;
  
  // Commission Tracking
  expectedHarvestValue?: number;
  expectedCommission?: number;
  actualCommission?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export type InvestorOffer = DirectHarvestOffer | SponsorshipOffer;

/**
 * Payment Installment Structure
 * Both offer types use installments for payments
 */
export interface PaymentInstallment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  milestone?: string; // e.g., "Project Start", "Mid-Season", "Harvest Complete"
  status: PaymentStatus;
  paidDate?: string;
  paymentProof?: string; // URL to payment receipt
}

/**
 * Farmer Match Details
 */
export interface FarmerMatch {
  farmerId: string;
  farmerName: string;
  farmerImage?: string;
  location: string;
  experience: number; // years
  rating?: number;
  confirmedAt?: string;
  farmerOwnedLand?: boolean; // If farmer owns land, only one agreement needed
}

/**
 * Land Owner Match Details
 * Only needed if farmer doesn't own the land
 */
export interface LandOwnerMatch {
  landOwnerId: string;
  landOwnerName: string;
  landOwnerImage?: string;
  landSize: number; // in acres
  landLocation: string;
  soilType?: string;
  irrigationType?: string;
  confirmedAt?: string;
  rentalDuration?: number; // in months
}

/**
 * Project Progress Tracking
 * Used for active offers/projects
 */
export interface ProjectProgress {
  offerId: string;
  currentPhase: 'planning' | 'planting' | 'growing' | 'harvesting' | 'completed';
  progressPercentage: number; // 0-100
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  milestones: Milestone[];
  updates: ProjectUpdate[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface ProjectUpdate {
  id: string;
  date: string;
  author: 'farmer' | 'landowner' | 'investor' | 'system';
  message: string;
  images?: string[];
}

/**
 * Agreement Details
 * Separate agreements for Investor-Farmer and Investor-LandOwner
 */
export interface Agreement {
  id: string;
  offerId: string;
  type: 'investor-farmer' | 'investor-landowner';
  parties: {
    investor: { id: string; name: string };
    counterparty: { id: string; name: string; role: 'farmer' | 'landowner' };
  };
  terms: {
    projectTimeline: string;
    rentalDuration?: number; // for land rental
    paymentSchedule: PaymentInstallment[];
    additionalTerms?: Record<string, string | number | boolean>;
  };
  status: 'draft' | 'pending-signature' | 'signed' | 'active' | 'completed' | 'terminated';
  createdAt: string;
  signedAt?: string;
  documentUrl?: string;
}

/**
 * Investor Dashboard Stats
 */
export interface InvestorStats {
  // Direct Harvest Stats
  activeHarvestOrders: number;
  totalHarvestBudget: number;
  pendingDeliveries: number;
  completedOrders: number;
  
  // Sponsorship Stats
  activeSponsorships: number;
  totalSponsorshipInvested: number;
  expectedCommissions: number;
  earnedCommissions: number;
  
  // Overall Stats
  totalActiveInvestments: number;
  pendingApplications: number;
  averageROI: number;
  
  // Payments
  upcomingPayments: number;
  overduePayments: number;
}
