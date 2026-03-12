import type {
  DirectHarvestOffer,
  SponsorshipOffer,
} from "@/types/investor.types";
import { httpClient } from "./httpClient";

export const createDirectHarvestOffer = (
  payload: Partial<DirectHarvestOffer>,
) => httpClient.post<DirectHarvestOffer>("/v1/investor-offer", payload);

export const createSponsorshipOffer = (payload: Partial<SponsorshipOffer>) =>
  httpClient.post<SponsorshipOffer>("/v1/investor-offer", payload);
