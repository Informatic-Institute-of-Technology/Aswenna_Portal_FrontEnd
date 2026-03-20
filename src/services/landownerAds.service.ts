import { httpClient } from "./httpClient";

export interface CreateLandownerAdPayload {
  landOwner: string;
  title: string;
  location: string;
  landArea: string;
  availableFrom: string;
  availableTo: string;
  soilType: string;
  rentalAmount: string;
  landHistory?: string;
  additionalInfo?: string;
}

export const createLandownerAd = (payload: CreateLandownerAdPayload) =>
  httpClient.post<unknown>("/v1/land-owner/ads", payload);
