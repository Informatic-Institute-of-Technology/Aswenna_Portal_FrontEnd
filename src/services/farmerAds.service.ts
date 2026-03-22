import { HttpClient } from "./httpClient";

const farmerAdsHttpClient = new HttpClient();

export type FarmerOfferType = "harvest" | "commission";
export type FarmerLandAvailability = "with_land" | "without_land";

export interface FarmerAdCostBreakdownItem {
  category: string;
  description: string;
  estimatedCost: number;
}

export interface FarmerAdMilestoneBreakdownItem {
  milestone: string;
  description: string;
  estimatedAmount: number;
}

export interface HarvestBasedDetailsPayload {
  expectedHarvest?: number;
  expectedLandArea?: number;
}

export interface CommissionBasedDetailsPayload {
  commissionPercentage?: number;
  investmentAmount?: number;
  noOfInstallments?: number;
  expectedLandArea?: number;
}

export interface CreateFarmerAdPayload {
  farmer?: string;
  farmerImage?: string;
  offerType: FarmerOfferType;
  projectName: string;
  description: string;
  cropType: string;
  cropIcon?: string;
  backgroundImage?: string;
  location: string;
  landAvailability: FarmerLandAvailability;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  farmingMethods: string;
  preferredRegions: string[];
  costBreakdown: FarmerAdCostBreakdownItem[];
  milestoneBreakdown: FarmerAdMilestoneBreakdownItem[];
  totalInvestmentRequired: number;
  harvestBasedDetails?: HarvestBasedDetailsPayload;
  commissionBasedDetails?: CommissionBasedDetailsPayload;
}

const buildCreateProjectEndpoint = () => `/v1/farmer-project`;

const buildGetAllProjectsEndpoint = () => `/v1/farmer-project`;

const buildUpdateProjectEndpoint = (projectId: string) =>
  `/v1/farmer-project/${projectId}`;

const buildDeleteProjectEndpoint = (projectId: string) =>
  `/v1/farmer-project/${projectId}`;

export const createFarmerAd = (
  userId: string,
  payload: CreateFarmerAdPayload,
) =>
  farmerAdsHttpClient.post<unknown>(buildCreateProjectEndpoint(), {
    ...payload,
    farmer: userId,
  });

export const getFarmerAdsByUser = (userId: string) =>
  farmerAdsHttpClient.get<unknown>(
    `${buildGetAllProjectsEndpoint()}?farmerId=${encodeURIComponent(userId)}`,
  );

export const updateFarmerAd = (
  adId: string,
  payload: Partial<CreateFarmerAdPayload>,
) =>
  farmerAdsHttpClient.patch<unknown>(buildUpdateProjectEndpoint(adId), payload);

export const deleteFarmerAd = (adId: string) =>
  farmerAdsHttpClient.delete<unknown>(buildDeleteProjectEndpoint(adId));
