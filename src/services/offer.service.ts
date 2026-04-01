import type {
  DirectHarvestOffer,
  InvestorOffer,
  OfferStatus,
  OfferType,
  PaginatedOffersResponse,
  SponsorshipOffer,
} from "@/types/investor.types";
import { httpClient } from "./httpClient";

export const createDirectHarvestOffer = (
  payload: Partial<DirectHarvestOffer>,
) => httpClient.post<DirectHarvestOffer>("/v1/investor-offer", payload);

export const createSponsorshipOffer = (payload: Partial<SponsorshipOffer>) =>
  httpClient.post<SponsorshipOffer>("/v1/investor-offer", payload);

type GetInvestorOffersParams = {
  status?: OfferStatus;
  offerType?: OfferType;
  page?: number;
  limit?: number;
};

export const getInvestorOffers = (params?: GetInvestorOffersParams) => {
  const searchParams = new URLSearchParams();

  if (params?.status) searchParams.set("status", params.status);
  if (params?.offerType) searchParams.set("offerType", params.offerType);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const endpoint = query ? `/v1/investor-offer?${query}` : "/v1/investor-offer";

  return httpClient.get<PaginatedOffersResponse>(endpoint);
};

export const getInvestorOfferById = (offerId: string) =>
  httpClient.get<InvestorOffer>(`/v1/investor-offer/${offerId}`);

export const updateDirectHarvestOffer = (
  offerId: string,
  payload: Partial<DirectHarvestOffer>,
) =>
  httpClient.put<DirectHarvestOffer>(`/v1/investor-offer/${offerId}`, payload);

export const updateSponsorshipOffer = (
  offerId: string,
  payload: Partial<SponsorshipOffer>,
) => httpClient.put<SponsorshipOffer>(`/v1/investor-offer/${offerId}`, payload);

export const deleteInvestorOffer = (offerId: string) =>
  httpClient.delete(`/v1/investor-offer/${offerId}`);

export const getInvestorOffersPaginated = (
  page: number = 1,
  limit: number = 10,
) =>
  httpClient.get<PaginatedOffersResponse>(
    `/v1/investor-offer?page=${page}&limit=${limit}`,
  );

export const connectOfferToLandAd = (offerId: string, landAdId: string) =>
  httpClient.post<unknown>(`/v1/investor-offer/${offerId}/connect`, {
    landAdId,
  });

export const matchLandOwnerOffer = (
  offerId: string,
  landownerProjectId: string,
) =>
  httpClient.patch<unknown>(`/v1/land-owner-offer/${offerId}`, {
    landownerProjectId,
  });

export interface FarmerOfferMilestonePayload {
  title: string;
  estimatedAmount: number;
  paymentOverDueDate?: string;
  startDate?: string;
  endDate?: string;
}

export interface FarmerOfferBreakdownPayload {
  costBreakdown: Array<{ title: string; estimatedCost: number }>;
  milestoneBreakdown: FarmerOfferMilestonePayload[];
}

export const updateFarmerOfferBreakdown = (
  offerId: string,
  payload: FarmerOfferBreakdownPayload,
) => httpClient.patch<unknown>(`/v1/farmer-offer/${offerId}`, payload);
