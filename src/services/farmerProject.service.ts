import { httpClient } from "./httpClient";

export interface FarmerProjectCostBreakdownItem {
  category: string;
  description: string;
  estimatedCost: number;
}

export interface FarmerProjectMilestoneItem {
  milestone: string;
  description: string;
  estimatedAmount: number;
}

export interface FarmerProjectHarvestBasedDetails {
  expectedHarvest?: number;
  expectedLandArea?: number;
}

export interface FarmerProjectCommissionBasedDetails {
  commissionPercentage: number;
  expectedLandArea?: number;
}

export interface FarmerProjectFarmerRef {
  _id: string;
  fullName: string;
  email: string;
}

export type FarmerProjectFarmerField = FarmerProjectFarmerRef | string | null;

export interface FarmerProjectApiItem {
  _id: string;
  farmer: FarmerProjectFarmerField;
  offerType: "harvest" | "commission";
  projectName: string;
  description: string;
  cropType: string;
  cropIcon?: string;
  backgroundImage?: string;
  location: string;
  farmingMethods: string;
  preferredRegions: string[];
  costBreakdown: FarmerProjectCostBreakdownItem[];
  milestoneBreakdown: FarmerProjectMilestoneItem[];
  totalInvestmentRequired: number;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  status: string;
  visibility: boolean;
  harvestBasedDetails?: FarmerProjectHarvestBasedDetails;
  commissionBasedDetails?: FarmerProjectCommissionBasedDetails;
  landAvailability?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerProjectPaginatedResponse {
  data: FarmerProjectApiItem[];
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

export type FarmerProjectByIdResponse =
  | FarmerProjectApiItem
  | { data: FarmerProjectApiItem };

export const getFarmerProjects = () =>
  httpClient.get<FarmerProjectPaginatedResponse>("/v1/farmer-project");

export const getFarmerProjectById = (projectId: string) =>
  httpClient.get<FarmerProjectByIdResponse>(`/v1/farmer-project/${projectId}`);
