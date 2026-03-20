import { httpClient } from "./httpClient";

export interface PersonalInfo {
  fullName?: string;
  nicNumber?: string;
  phoneNumber?: string;
  street?: string;
  city?: string;
  province?: string;
  district?: string;
  postalCode?: string;
  dsDivision?: string;
  gnDivision?: string;
  profilePicture?: string | null;
  birthday?: string;
  gender?: string;
  age?: number | null;
}

export interface LandInfo {
  landStreet?: string;
  landCity?: string;
  landProvince?: string;
  landDistrict?: string;
  landPostalCode?: string;
  landDsDivision?: string;
  landGnDivision?: string;
  landSize?: string;
  soilType?: string;
  rentalExpectation?: string;
  pinLocation?: { lat: number; lng: number } | null;
}

export interface OrganizationInfo {
  organizationName?: string;
  headOfficeLocation?: string;
  organizationContactNo?: string;
  businessRegistrationNo?: string;
  cropFocus?: string[];
}

export interface FarmingInfo {
  selectedCrops?: string[];
}

export interface ProfileSetupData {
  role: string;
  personalInfo: PersonalInfo;
  landInfo?: LandInfo;
  organizationInfo?: OrganizationInfo;
  farmingInfo?: FarmingInfo;
  termsAccepted: boolean;
}

export interface CompleteProfilePayload extends ProfileSetupData {
  termsAcceptedAt: string;
  userId: string | null;
  email: string | null;
}

export interface CompleteProfileResponse {
  success: boolean;
  message: string;
  userId?: string;
}

class ProfileService {

  async completeProfile(
    payload: CompleteProfilePayload
  ): Promise<CompleteProfileResponse> {
    console.log("=== Profile Service: Complete Profile ===");
    console.log("Payload:", payload);

    const response = await httpClient.post<CompleteProfileResponse>(
      "/v1/user/complete-profile",
      payload
    );

    console.log("Complete profile response:", response);
    return response;
  }

  getProfileSetupData(): ProfileSetupData | null {
    try {
      const data = localStorage.getItem("profileSetupData");
      if (!data) return null;
      return JSON.parse(data) as ProfileSetupData;
    } catch (error) {
      console.error("Error parsing profile setup data:", error);
      return null;
    }
  }

  saveProfileSetupData(data: ProfileSetupData): void {
    localStorage.setItem("profileSetupData", JSON.stringify(data));
  }

  clearProfileSetupData(): void {
    localStorage.removeItem("profileSetupData");
  }

  getUserRole(): string | null {
    return localStorage.getItem("userRole");
  }
}

export const profileService = new ProfileService();
