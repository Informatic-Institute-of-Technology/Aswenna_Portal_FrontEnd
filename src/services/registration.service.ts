import { httpClient } from "./httpClient";

// Base interfaces
export interface PersonalInfo {
  profilePicture: string;
  nicNumber: string;
  birthday: string;
  gender: "male" | "female";
  age: number;
  address: string;
  city: string;
  postalCode: string;
  district: string;
  province: string;
  nicFrontImage?: string;
  nicBackImage?: string;
}

export interface FarmerDetails {
  dsDivision: string;
  gnDivision: string;
  govijanaSevaId: string;
  GovijanaSevaPassbookImage?: string;
  gnCertificateImage?: string;
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
    landImages: string[];
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

export interface RegistrationResponse {
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
    console.log("[RegistrationService] Farmer data:", JSON.stringify(data, null, 2));
    return await httpClient.post<RegistrationResponse>("/v1/user", data);
  }

  async registerInvestor(
    data: InvestorRegistrationRequest,
  ): Promise<RegistrationResponse> {
    console.log("[RegistrationService] POST /v1/user");
    console.log("[RegistrationService] Investor data:", JSON.stringify(data, null, 2));
    return await httpClient.post<RegistrationResponse>("/v1/user", data);
  }

  async registerLandowner(
    data: LandownerRegistrationRequest,
  ): Promise<RegistrationResponse> {
    console.log("[RegistrationService] POST /v1/user");
    console.log("[RegistrationService] Landowner data:", JSON.stringify(data, null, 2));
    return await httpClient.post<RegistrationResponse>("/v1/user", data);
  }

  async register(data: RegistrationRequest): Promise<RegistrationResponse> {
    console.log("[RegistrationService] POST /v1/user");
    console.log("[RegistrationService] Registration data:", JSON.stringify(data, null, 2));
    return await httpClient.post<RegistrationResponse>("/v1/user", data);
  }
}

export const registrationService = new RegistrationService();
