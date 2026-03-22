import type {
  DirectHarvestOffer,
  InvestorOffer,
  PaginatedOffersResponse,
  SponsorshipOffer,
} from "@/types/investor.types";
import { httpClient } from "./httpClient";

export const createDirectHarvestOffer = (
  payload: Partial<DirectHarvestOffer>,
) => httpClient.post<DirectHarvestOffer>("/v1/investor-offer", payload);

export const createSponsorshipOffer = (payload: Partial<SponsorshipOffer>) =>
  httpClient.post<SponsorshipOffer>("/v1/investor-offer", payload);

export const getInvestorOffers = () =>
  httpClient.get<PaginatedOffersResponse>("/v1/investor-offer");

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
) =>
  httpClient.put<SponsorshipOffer>(`/v1/investor-offer/${offerId}`, payload);

export const deleteInvestorOffer = (offerId: string) =>
  httpClient.delete(`/v1/investor-offer/${offerId}`);

export const getInvestorOffersPaginated = (page: number = 1, limit: number = 10) =>
  httpClient.get<PaginatedOffersResponse>(
    `/v1/investor-offer?page=${page}&limit=${limit}`,
  );

export const connectOfferToLandAd = (offerId: string, landAdId: string) =>
  httpClient.post<unknown>(`/v1/investor-offer/${offerId}/connect`, {
    landAdId,
  });
