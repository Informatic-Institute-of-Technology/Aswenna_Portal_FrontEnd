export type OfferType = "direct-harvest" | "sponsorship";
export type OfferStatus = "active" | "pending" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "overdue";

export interface InvestorRef {
  _id: string;
  fullName: string;
  email: string;
}

export interface HarvestBaseDetails {
  projectTitle: string;
  cropType: string;
  cropVariety?: string;
  requiredQuantity: number;
  quantityUnit: string;
  pricePerUnit: number;
  deliveryLocation: string;
  totalBudget: number;
  companyName?: string;
  preferredRegion: string[];
}

export interface CommissionDetails {
  sponsorshipTitle: string;
  cropTypes: string[];
  preferredFarmingMethod?: "organic" | "conventional" | "mixed";
  minimumInvestment: number;
  maximumInvestment: number;
  commissionRate: number;
  supportType: ("capital" | "equipment" | "expertise" | "marketing")[];
  preferredRegions: string[];
}

interface OfferAPIBase {
  _id: string;
  investor: InvestorRef;
  description: string;
  cropIcon: string;
  backgroundImage: string;
  expectedROI: number;
  currency: string;
  expiredDate: string;
  status: OfferStatus;
  applicationsCount: number;
  farmerId?: string;
  farmerName?: string;
  landOwnerId?: string;
  landOwnerName?: string;
  landowner?: {
    _id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    personalInfo?: Record<string, unknown>;
  };

  landownerProject?: {
    _id: string;
    title?: string;
    name?: string;
    status?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DirectHarvestOfferAPI extends OfferAPIBase {
  offerType: "direct-harvest";
  harvestBaseDetails: HarvestBaseDetails;
}

export interface SponsorshipOfferAPI extends OfferAPIBase {
  offerType: "sponsorship";
  commissionDetails: CommissionDetails;
}

export type InvestorOfferAPI = DirectHarvestOfferAPI | SponsorshipOfferAPI;

export interface PaginatedOffersResponse {
  data: InvestorOfferAPI[];
  pagination: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number;
    page: number;
    prevPage: number;
    totalDocs: number;
    totalPages: number;
  };
}

export interface DirectHarvestOffer {
  id?: string;
  offerType: "direct-harvest";

  investor: string;
  projectTitle: string;
  companyName?: string;
  description: string;

  cropIcon: string;
  backgroundImage: string;

  cropType: string;
  cropVariety?: string;
  requiredQuantity: number;
  quantityUnit: "kg" | "tons" | "units";

  preferredRegion?: string[];
  deliveryLocation: string;

  totalBudget: number;
  pricePerUnit: number;
  expectedROI: number;
  currency: string;

  expiredDate: string;

  status: OfferStatus;
  applicationsCount: number;
}

export interface SponsorshipOffer {
  id?: string;
  offerType: "sponsorship";

  investor: string;
  sponsorshipTitle: string;
  description: string;

  cropIcon: string;
  backgroundImage: string;

  cropTypes: string[];
  preferredFarmingMethod?: "organic" | "conventional" | "mixed";

  minimumInvestment: number;
  maximumInvestment: number;
  commissionRate: number;
  expectedROI: number;
  currency: string;

  supportType: ("capital" | "equipment" | "expertise" | "marketing")[];

  preferredRegions?: string[];

  expiredDate: string;

  status: OfferStatus;
  applicationsCount: number;
}

export type InvestorOffer = DirectHarvestOffer | SponsorshipOffer;

export interface InvestorPaymentInstallment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  milestone?: string;
  status: PaymentStatus;
  paidDate?: string;
  paymentProof?: string;
}

export interface FarmerMatch {
  farmerId: string;
  farmerName: string;
  farmerImage?: string;
  location: string;
  experience: number;
  rating?: number;
  confirmedAt?: string;
  farmerOwnedLand?: boolean;
}

export interface LandOwnerMatch {
  landOwnerId: string;
  landOwnerName: string;
  landOwnerImage?: string;
  landSize: number;
  landLocation: string;
  soilType?: string;
  irrigationType?: string;
  confirmedAt?: string;
  rentalDuration?: number;
}

export interface ProjectProgress {
  offerId: string;
  currentPhase:
    | "planning"
    | "planting"
    | "growing"
    | "harvesting"
    | "completed";
  progressPercentage: number;
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
  author: "farmer" | "landowner" | "investor" | "system";
  message: string;
  images?: string[];
}

export interface Agreement {
  id: string;
  offerId: string;
  type: "investor-farmer" | "investor-landowner";
  parties: {
    investor: { id: string; name: string };
    counterparty: { id: string; name: string; role: "farmer" | "landowner" };
  };
  terms: {
    projectTimeline: string;
    rentalDuration?: number;
    paymentSchedule: InvestorPaymentInstallment[];
    additionalTerms?: Record<string, string | number | boolean>;
  };
  status:
    | "draft"
    | "pending-signature"
    | "signed"
    | "active"
    | "completed"
    | "terminated";
  createdAt: string;
  signedAt?: string;
  documentUrl?: string;
}

export interface InvestorStats {
  activeHarvestOrders: number;
  totalHarvestBudget: number;
  pendingDeliveries: number;
  completedOrders: number;

  activeSponsorships: number;
  totalSponsorshipInvested: number;
  expectedCommissions: number;
  earnedCommissions: number;

  totalActiveInvestments: number;
  pendingApplications: number;
  averageROI: number;

  upcomingPayments: number;
  overduePayments: number;
}
