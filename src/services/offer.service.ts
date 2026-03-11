import type {
  DirectHarvestOffer,
  SponsorshipOffer,
} from "@/types/investor.types";
import { httpClient } from "./httpClient";

export const createDirectHarvestOffer = (
  payload: Partial<DirectHarvestOffer>,
) =>
  httpClient.post<DirectHarvestOffer>(
    "/investor/offers/direct-harvest",
    payload,
  );

export const createSponsorshipOffer = (payload: Partial<SponsorshipOffer>) =>
  httpClient.post<SponsorshipOffer>("/investor/offers/sponsorship", payload);
