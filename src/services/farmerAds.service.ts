import { HttpClient } from "./httpClient";

const farmerAdsHttpClient = new HttpClient("http://localhost:3000/api");

export type FarmerOfferType = "harvest" | "commission";

export interface FarmerAdCostBreakdownItem {
  category: string;
  description: string;
  estimatedCost: number;
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
  farmer: string;
  offerType: FarmerOfferType;
  projectName: string;
  description: string;
  cropType: string;
  location: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  farmingMethods: string;
  agreementType: null;
  preferredRegions: string[];
  costBreakdown: FarmerAdCostBreakdownItem[];
  totalInvestmentRequired: number;
  harvestBasedDetails?: HarvestBasedDetailsPayload;
  commissionBasedDetails?: CommissionBasedDetailsPayload;
}

const buildCreateAdsEndpoint = (userId: string) =>
  `/v1/farmer/ads?userId=${encodeURIComponent(userId)}`;

const buildGetUserAdsEndpoint = (userId: string) =>
  `/v1/farmer/ads/user?userId=${encodeURIComponent(userId)}`;

export const createFarmerAd = (
  userId: string,
  payload: CreateFarmerAdPayload,
) => farmerAdsHttpClient.post<unknown>(buildCreateAdsEndpoint(userId), payload);

export const getFarmerAdsByUser = (userId: string) =>
  farmerAdsHttpClient.get<unknown>(buildGetUserAdsEndpoint(userId));

export const updateFarmerAd = (
  adId: string,
  payload: Partial<CreateFarmerAdPayload>,
) => farmerAdsHttpClient.patch<unknown>(`/v1/farmer/ads/${adId}`, payload);

export const deleteFarmerAd = (adId: string) =>
  farmerAdsHttpClient.delete<unknown>(`/v1/farmer/ads/${adId}`);
