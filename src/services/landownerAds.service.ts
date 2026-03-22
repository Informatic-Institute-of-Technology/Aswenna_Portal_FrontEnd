import { httpClient } from "./httpClient";

export interface CreateLandownerAdPayload {
  landOwner: string;
  title: string;
  location: string;
  landArea: string | number;
  availableFrom: string;
  availableTo: string;
  soilType: string;
  waterAvailability?: string;
  rentalAmount: string | number;
  landHistory?: string;
  additionalInfo?: string;
}

export interface UpdateLandownerAdPayload {
  title?: string;
  location?: string;
  landArea?: string | number;
  availableFrom?: string;
  availableTo?: string;
  soilType?: string;
  waterAvailability?: string;
  rentalAmount?: string | number;
  landHistory?: string;
  additionalInfo?: string;
}

export interface LandImage {
  filename?: string;
  fileSize?: string | number;
  mimeType?: string;
  createdAt?: string;
  updatedAt?: string;
  url?: string;
}

export interface LandownerInfo {
  _id?: string;
  fullName?: string;
  email?: string;
  personalInfo?: {
    profilePicture?: {
      url?: string;
      filename?: string;
      fileSize?: string | number;
      mimeType?: string;
    };
  };
}

export interface LocationData {
  latitude?: number;
  longitude?: number;
  street?: string;
  city?: string;
  district?: string;
  province?: string;
  postalCode?: string;
}

export interface LandownerAdApiItem {
  _id: string;
  landOwner?: string | { _id: string };
  landowner?: string | LandownerInfo;
  title: string;
  location?: string | LocationData;
  landArea?: string | number;
  availableFrom?: string;
  availableTo?: string;
  soilType?: string;
  rentalAmount?: string | number;
  landHistory?: string;
  additionalInfo?: string;
  waterAvailability?: string;
  image?: string;
  images?: LandImage[];
  status?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandownerAdsListResponse {
  data: LandownerAdApiItem[];
  pagination?: unknown;
}

export const createLandownerAd = (payload: CreateLandownerAdPayload) =>
  httpClient.post<unknown>("/v1/land-owner/ads", payload);

export const getLandownerAds = () =>
  httpClient.get<LandownerAdsListResponse>(
    "/v1/land-owner/ads?sort=-createdAt",
  );

export const deleteLandownerAd = (adId: string) =>
  httpClient.delete<unknown>(`/v1/land-owner/ads/${adId}`);

export const updateLandownerAd = (
  adId: string,
  payload: UpdateLandownerAdPayload,
) => httpClient.patch<unknown>(`/v1/land-owner/ads/${adId}`, payload);

export const getLandownerAdById = async (adId: string) => {
  const response = await httpClient.get<
    { data?: LandownerAdApiItem } | LandownerAdApiItem
  >(`/v1/land-owner/ads/${adId}`);
  return (response as any).data || (response as LandownerAdApiItem);
};

export const uploadLandAdImages = (adId: string, imageFiles: File[]) => {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append("images", file);
  });
  return httpClient.postMultipart<unknown>(
    `/v1/land-owner/ads/${adId}/images`,
    formData,
  );
};
