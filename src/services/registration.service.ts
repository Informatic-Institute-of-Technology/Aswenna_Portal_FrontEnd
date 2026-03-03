import { httpClient } from "./httpClient";

// Base interfaces
export interface PersonalInfo {
  nicNumber: string;
  birthday: string;
  gender: "Male" | "Female";
  age: number;
  address: string;
  city: string;
  postalCode: string;
  district: string;
  province: string;
}

export interface FarmerDetails {
  dsDivision: string;
  gnDivision: string;
  govijanaSevaId: string;
  crop: string;
  experience: string;
  regions: string;
  specificNeeds: string;
}

export interface InvestorDetails {
  dsDivision: string;
  gnDivision: string;
  organizationName: string;
  companyAddress: string;
  organizationPhoneNumber: string;
  registrationNo: string;
  cropFocus: string;
}

export interface LandOwnerDetails {
  dsDivision: string;
  gnDivision: string;
  location: {
    latitude: number;
    longitude: number;
  };
  landAddress: {
    street: string;
    city: string;
    province: string;
    district: string;
    postalCode: string;
    size: string;
    soilType: string;
    rentalExpectation: string;
    dsDivision: string;
    gnDivision: string;
  };
}

export interface FarmerRegistrationRequest {
  fullName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  password: string;
  personalInfo: PersonalInfo;
  role: "farmer";
  farmerDetails: FarmerDetails;
}

export interface InvestorRegistrationRequest {
  fullName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  password: string;
  role: "investor";
  personalInfo: PersonalInfo;
  investorDetails: InvestorDetails;
}

export interface LandownerRegistrationRequest {
  fullName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  password: string;
  role: "landowner";
  personalInfo: PersonalInfo;
  landOwnerDetails: LandOwnerDetails;
}

export type RegistrationRequest =
  | FarmerRegistrationRequest
  | InvestorRegistrationRequest
  | LandownerRegistrationRequest;

export interface UploadUserFilesRequest {
  profilePicture?: File | null;
  nicFrontImage?: File | null;
  nicBackImage?: File | null;
  GovijanaSevaPassbookImage?: File | null;
  gnCertificateImage?: File | null;
  bimsaviyaCertificate?: File | null;
  landImages?: File[];
}

export interface RegistrationResponse {
  _id?: string;
  message?: string;
  success?: boolean;
  user?: {
    _id: string;
    email: string;
    role: string;
  };
}

class RegistrationService {
  async registerFarmer(
    data: FarmerRegistrationRequest,
  ): Promise<RegistrationResponse> {
    console.log("[RegistrationService] POST /v1/user");
    console.log(
      "[RegistrationService] Farmer data:",
      JSON.stringify(data, null, 2),
    );
    return await httpClient.post<RegistrationResponse>("/v1/user", data);
  }

  async registerInvestor(
    data: InvestorRegistrationRequest,
  ): Promise<RegistrationResponse> {
    console.log("[RegistrationService] POST /v1/user");
    console.log(
      "[RegistrationService] Investor data:",
      JSON.stringify(data, null, 2),
    );
    return await httpClient.post<RegistrationResponse>("/v1/user", data);
  }

  async registerLandowner(
    data: LandownerRegistrationRequest,
  ): Promise<RegistrationResponse> {
    console.log("[RegistrationService] POST /v1/user");
    console.log(
      "[RegistrationService] Landowner data:",
      JSON.stringify(data, null, 2),
    );
    return await httpClient.post<RegistrationResponse>("/v1/user", data);
  }

  async register(data: RegistrationRequest): Promise<RegistrationResponse> {
    console.log("[RegistrationService] POST /v1/user");
    console.log(
      "[RegistrationService] Registration data:",
      JSON.stringify(data, null, 2),
    );
    return await httpClient.post<RegistrationResponse>("/v1/user", data);
  }

  async uploadUserFiles(
    userId: string,
    files: UploadUserFilesRequest,
  ): Promise<RegistrationResponse> {
    console.log("[RegistrationService] POST /v1/user/:user/upload", userId);
    const formData = new FormData();
    if (files.profilePicture)
      formData.append("profilePicture", files.profilePicture);
    if (files.nicFrontImage)
      formData.append("nicFrontImage", files.nicFrontImage);
    if (files.nicBackImage) formData.append("nicBackImage", files.nicBackImage);
    if (files.GovijanaSevaPassbookImage)
      formData.append(
        "GovijanaSevaPassbookImage",
        files.GovijanaSevaPassbookImage,
      );
    if (files.gnCertificateImage)
      formData.append("gnCertificateImage", files.gnCertificateImage);
    if (files.bimsaviyaCertificate)
      formData.append("bimsaviyaCertificate", files.bimsaviyaCertificate);
    if (files.landImages?.length) {
      for (const img of files.landImages) {
        formData.append("landImages", img);
      }
    }
    return await httpClient.postMultipart<RegistrationResponse>(
      `/v1/user/${userId}/upload`,
      formData,
    );
  }
}

export const registrationService = new RegistrationService();
