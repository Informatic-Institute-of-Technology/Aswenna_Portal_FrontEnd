import { httpClient } from "./httpClient";

export interface ApiRoleObject {
  _id: string;
  name: string;
  description?: string;
  permissions?: string[];
  meta?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ApiUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  address?: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  nic?: string;
  role: string | ApiRoleObject;
  permissions: string[];
  createdBy: string;
  updatedBy: string;
  meta: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  status?: string;
  statues?: string;
  personalInfo?: PersonalInfo;
}

export interface ApiImageFile {
  filename?: string;
  fileSize?: string;
  mimeType?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalInfo {
  nicNumber?: string;
  birthday?: string;
  gender?: string;
  age?: number;
  address?: string;
  city?: string;
  postalCode?: string;
  district?: string;
  province?: string;
  dsDivision?: string;
  gnDivision?: string;
  profilePicture?: string | ApiImageFile | null;
  nicFrontImage?: ApiImageFile;
  nicBackImage?: ApiImageFile;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FarmerProfile {
  _id?: string;
  user?: string;
  dsDivision?: string;
  gnDivision?: string;
  govijanaSevaId?: string;
  crop?: string;
  experience?: string;
  regions?: string;
  specificNeeds?: string;
  selectedCrops?: string[];
  nicImages?: Array<{
    filename?: string;
    url?: string;
    fileSize?: string;
    mimeType?: string;
  }>;
  govijanaSevaPassbook?: {
    filename?: string;
    url?: string;
    fileSize?: string;
    mimeType?: string;
  };
  GovijanaSevaPassbookImage?: {
    filename?: string;
    url?: string;
    fileSize?: string;
    mimeType?: string;
  };
  gnCertificate?: {
    filename?: string;
    url?: string;
    fileSize?: string;
    mimeType?: string;
  };
  gnCertificateImage?: {
    filename?: string;
    url?: string;
    fileSize?: string;
    mimeType?: string;
  };
}

export interface InvestorProfile {
  _id?: string;
  user?: string;
  dsDivision?: string;
  gnDivision?: string;
  organizationName?: string;
  companyAddress?: string;
  organizationPhoneNumber?: string;
  registrationNo?: string;
  cropFocus?: string;
  nicImages?: Array<{
    filename?: string;
    url?: string;
    fileSize?: string;
    mimeType?: string;
  }>;
  businessRegistration?: {
    filename?: string;
    url?: string;
    fileSize?: string;
    mimeType?: string;
  };
}

export interface LandImageFile {
  filename?: string;
  fileSize?: string;
  mimeType?: string;
  url?: string;
}

export interface LandOwnerProfile {
  _id?: string;
  user?: string;
  dsDivision?: string;
  gnDivision?: string;
  location?: { latitude: number; longitude: number };
  landAddress?: {
    street?: string;
    city?: string;
    province?: string;
    district?: string;
    postalCode?: string;
    size?: string;
    soilType?: string;
    rentalExpectation?: string;
    dsDivision?: string;
    gnDivision?: string;
    landImages?: LandImageFile[];
    bimsaviyaCertificate?: {
      filename?: string;
      fileSize?: string;
      mimeType?: string;
      url?: string;
      createdAt?: string;
      updatedAt?: string;
    };
  };
  nicImages?: Array<{
    filename?: string;
    url?: string;
    fileSize?: string;
    mimeType?: string;
  }>;
}

export type FarmerDetails = FarmerProfile;
export type InvestorDetails = InvestorProfile;
export type LandOwnerDetails = LandOwnerProfile;

export interface ApiUserDetail extends ApiUser {
  personalInfo?: PersonalInfo;
  farmer?: FarmerProfile;
  investor?: InvestorProfile;
  landOwner?: LandOwnerProfile;
  farmerDetails?: FarmerProfile;
  investorDetails?: InvestorProfile;
  landOwnerDetails?: LandOwnerProfile;
  farmingInfo?: { selectedCrops?: string[] };
  documents?: {
    nicFiles?: Array<{
      fileName: string;
      fileData?: string;
      url?: string;
      fileSize?: number;
      uploadDate?: string;
    }>;
    passbookFiles?: Array<{
      fileName: string;
      fileData?: string;
      url?: string;
    }>;
    gnFiles?: Array<{ fileName: string; fileData?: string; url?: string }>;
  };
}

export interface UsersResponse {
  data: ApiUser[];
  pagination: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number;
    page: number;
    prevPage: number;
    totalDocs: number;
    totalPages: number;
  };
}

const getRoleId = (role: string | ApiRoleObject): string =>
  typeof role === "object" ? role._id : role;

class AdminService {
  async getAllUsers(
    page: number = 1,
    limit: number = 100,
    query?: string,
  ): Promise<UsersResponse> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (query && query.trim()) {
        params.set("search", query.trim());
      }

      const response = await httpClient.get<UsersResponse>(
        `/v1/user?${params.toString()}`,
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  }
  async getAllUsersPaginated(): Promise<ApiUser[]> {
    const allUsers: ApiUser[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getAllUsers(page, 100);
      allUsers.push(...response.data);
      hasMore = response.pagination.hasNextPage;
      page++;
    }

    return allUsers;
  }

  async getUserStats() {
    try {
      const data = await this.getAllUsersPaginated();

      const roleMapping: { [key: string]: string } = {
        "696e40fda4f896e9f40c8b93": "farmer",
        "696e6163b558abe269548099": "investor",
        "696e616db558abe26954809c": "landowner",
        "696f008a3e12fb6fd9ed945b": "superadmin",
      };

      const stats = {
        totalUsers: data.length,
        farmers: data.filter((u) => roleMapping[getRoleId(u.role)] === "farmer")
          .length,
        investors: data.filter(
          (u) => roleMapping[getRoleId(u.role)] === "investor",
        ).length,
        landowners: data.filter(
          (u) => roleMapping[getRoleId(u.role)] === "landowner",
        ).length,
        verified: data.filter((u) => u.emailVerified).length,
        unverified: data.filter((u) => !u.emailVerified).length,
      };

      return stats;
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      throw error;
    }
  }

  parseLocation(address: string): { city: string; province?: string } {
    if (!address || typeof address !== "string" || address.trim() === "") {
      return {
        city: "Unknown",
        province: undefined,
      };
    }

    const parts = address.split(",").map((p) => p.trim());
    return {
      city: parts[0] || "Unknown",
      province: parts[1],
    };
  }

  async getUserDistribution() {
    try {
      const users = await this.getAllUsersPaginated();
      const distribution: { [key: string]: number } = {};

      users.forEach((user) => {
        const { city } = this.parseLocation(user.address ?? "");
        distribution[city] = (distribution[city] || 0) + 1;
      });

      return distribution;
    } catch (error) {
      console.error("Failed to fetch user distribution:", error);
      throw error;
    }
  }

  async getProvinceDistribution() {
    try {
      const users = await this.getAllUsersPaginated();
      const distribution: {
        [province: string]: {
          farmers: number;
          investors: number;
          landowners: number;
          total: number;
        };
      } = {};

      const roleMap: { [key: string]: string } = {
        "696e40fda4f896e9f40c8b93": "farmers",
        "696e6163b558abe269548099": "investors",
        "696e616db558abe26954809c": "landowners",
      };

      users.forEach((user) => {
        const { province } = this.parseLocation(user.address ?? "");
        const roleKey = roleMap[getRoleId(user.role)];

        const provinceKey = province || "Unknown";

        if (!distribution[provinceKey]) {
          distribution[provinceKey] = {
            farmers: 0,
            investors: 0,
            landowners: 0,
            total: 0,
          };
        }

        if (roleKey) {
          distribution[provinceKey][
            roleKey as "farmers" | "investors" | "landowners"
          ]++;
        }
        distribution[provinceKey].total++;
      });

      return distribution;
    } catch (error) {
      console.error("Failed to fetch province distribution:", error);
      throw error;
    }
  }

  async updateUser(
    userId: string,
    updates: {
      firstName?: string;
      lastName?: string;
      address?: string;
      phoneNumber?: string;
    },
  ): Promise<ApiUser> {
    try {
      const response = await httpClient.patch<ApiUser>(
        `/v1/user/${userId}`,
        updates,
      );
      console.log("Updated user:", response);
      return response;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, status: string): Promise<ApiUser> {
    try {
      const response = await httpClient.patch<ApiUser>(`/v1/user/${userId}`, {
        status,
      });
      console.log("Updated user status:", response);
      return response;
    } catch (error) {
      console.error("Failed to update user status:", error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<ApiUserDetail> {
    try {
      const response = await httpClient.get<ApiUserDetail>(
        `/v1/user/${userId}`,
      );
      console.log("Fetched user detail:", response);
      return response;
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await httpClient.delete<unknown>(`/v1/user/${userId}`);
      console.log("Deleted user:", userId);
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
