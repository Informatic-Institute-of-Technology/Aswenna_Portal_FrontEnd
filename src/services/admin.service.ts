import type { UnifiedProject } from "@/types/admin.types";
import type {
  DirectHarvestOfferAPI,
  SponsorshipOfferAPI,
} from "@/types/investor.types";
import {
  normalizeDirectHarvestOffer,
  normalizeFarmerProject,
  normalizeSponsorshipOffer,
} from "@/utils/projectNormalization";
import type { FarmerProjectApiItem } from "./farmerProject.service";
import { getFarmerProjects } from "./farmerProject.service";
import { httpClient } from "./httpClient";
import { getInvestorOffers } from "./offer.service";

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

  /**
   * ============================================================================
   * ALL PROJECTS DASHBOARD METHODS
   * ============================================================================
   *
   * Handles fetching and aggregating data from multiple APIs for the
   * All Projects dashboard (Super Admin view)
   */

  /**
   * Fetch all active projects from all sources concurrently
   *
   * Data Flow:
   * 1. Calls getFarmerProjects() → /v1/farmer-project → normalizes to UnifiedProject[]
   * 2. Calls getInvestorOffers() → /v1/investor-offer → normalizes to UnifiedProject[]
   * 3. Combines both results into single array
   * 4. Caches for 5 minutes with TTL validation
   */
  async fetchActiveProjects(useCache = true): Promise<UnifiedProject[]> {
    try {
      const cacheKey = "active:all";

      // Check cache
      if (useCache && this.projectsCache.has(cacheKey)) {
        const cached = this.projectsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
          console.log(
            `✓ Using cached active projects (age: ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`,
          );
          return cached.data;
        }
      }

      const [farmerProjects, investorOffers] = await Promise.all([
        this.getFarmerProjects(),
        this.getInvestorOffers(),
      ]);

      // Combine and normalize
      const allProjects = [...farmerProjects, ...investorOffers];
      this.projectsCache.set(cacheKey, {
        data: allProjects,
        timestamp: Date.now(),
      });

      console.log(
        `✓ Fetched & Combined: ${farmerProjects.length} farmer projects + ${investorOffers.length} investor offers = ${allProjects.length} total`,
      );

      return allProjects;
    } catch (error) {
      console.error("Error fetching active projects:", error);
      const cached = this.projectsCache.get("active:all");
      return cached?.data || [];
    }
  }

  /**
   * Fetch all projects from all sources (no status filter)
   *
   * Data Flow:
   * 1. Same as fetchActiveProjects but includes all statuses
   * 2. Fetches farmer projects (harvest + commission) and investor offers (direct-harvest + sponsorship)
   * 3. Returns normalized UnifiedProject[] with 5-minute TTL cache
   */
  async fetchAllProjects(useCache = true): Promise<UnifiedProject[]> {
    try {
      const cacheKey = "all:all";

      if (useCache && this.projectsCache.has(cacheKey)) {
        const cached = this.projectsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
          console.log(
            `✓ Using cached all projects (age: ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`,
          );
          return cached.data;
        }
      }

      const [farmerProjects, investorOffers] = await Promise.all([
        this.getFarmerProjects(),
        this.getInvestorOffers(),
      ]);

      const allProjects = [...farmerProjects, ...investorOffers];
      this.projectsCache.set(cacheKey, {
        data: allProjects,
        timestamp: Date.now(),
      });

      console.log(
        `✓ Fetched & Combined: ${farmerProjects.length} farmer projects + ${investorOffers.length} investor offers = ${allProjects.length} total`,
      );

      return allProjects;
    } catch (error) {
      console.error("Error fetching all projects:", error);
      const cached = this.projectsCache.get("all:all");
      return cached?.data || [];
    }
  }

  /**
   * Fetch farmer projects (harvest and commission-based) from API and normalize
   *
   * API Endpoint: GET /v1/farmer-project
   * Returns: Paginated list of farmer projects with both harvest and commission types
   */
  private async getFarmerProjects(): Promise<UnifiedProject[]> {
    try {
      const response = await getFarmerProjects();
      const farmerProjectsData = response?.data || [];

      console.log(
        `📊 Fetched ${farmerProjectsData.length} farmer projects from /v1/farmer-project`,
      );

      // Normalize all farmer projects to UnifiedProject format
      const normalizedProjects = farmerProjectsData.map(
        (project: FarmerProjectApiItem) => {
          const normalized = normalizeFarmerProject(project);
          console.log(
            `  ✓ Normalized: ${project.projectName} (${project.offerType}) - Category: ${normalized.category}`,
          );
          return normalized;
        },
      );

      return normalizedProjects;
    } catch (error) {
      console.error(
        "❌ Error fetching farmer projects from /v1/farmer-project:",
        error,
      );
      return [];
    }
  }

  /**
   * Fetch investor offers (direct harvest and sponsorship) from API and normalize
   *
   * API Endpoint: GET /v1/investor-offer
   * Returns: Paginated list of investor offers with both direct-harvest and sponsorship types
   */
  private async getInvestorOffers(): Promise<UnifiedProject[]> {
    try {
      const response = await getInvestorOffers();
      const investorOffersData = response?.data || [];

      console.log(
        `📊 Fetched ${investorOffersData.length} investor offers from /v1/investor-offer`,
      );

      const normalizedProjects: UnifiedProject[] = [];

      // Normalize all investor offers based on their type
      investorOffersData.forEach(
        (offer: DirectHarvestOfferAPI | SponsorshipOfferAPI) => {
          try {
            if (offer.offerType === "direct-harvest") {
              const normalized = normalizeDirectHarvestOffer(
                offer as DirectHarvestOfferAPI,
              );
              console.log(
                `  ✓ Normalized: ${offer.offerType} - ${(offer as DirectHarvestOfferAPI).harvestBaseDetails?.projectTitle} - Category: ${normalized.category}`,
              );
              normalizedProjects.push(normalized);
            } else if (offer.offerType === "sponsorship") {
              const normalized = normalizeSponsorshipOffer(
                offer as SponsorshipOfferAPI,
              );
              console.log(
                `  ✓ Normalized: ${offer.offerType} - ${(offer as SponsorshipOfferAPI).commissionDetails?.sponsorshipTitle} - Category: ${normalized.category}`,
              );
              normalizedProjects.push(normalized);
            }
          } catch (error) {
            console.error(`  ❌ Error normalizing offer ${offer._id}:`, error);
          }
        },
      );

      return normalizedProjects;
    } catch (error) {
      console.error(
        "❌ Error fetching investor offers from /v1/investor-offer:",
        error,
      );
      return [];
    }
  }

  /**
   * Fetch project by ID and normalize to UnifiedProject
   */
  async fetchProjectById(
    projectId: string,
    sourceApi: "farmer-project" | "investor-offer",
  ) {
    try {
      const endpoint =
        sourceApi === "farmer-project"
          ? `/v1/farmer-project/${projectId}`
          : `/v1/investor-offer/${projectId}`;

      const response = await httpClient.get<
        FarmerProjectApiItem | DirectHarvestOfferAPI | SponsorshipOfferAPI
      >(endpoint);

      // Normalize based on source API
      if (sourceApi === "farmer-project") {
        return normalizeFarmerProject(response as FarmerProjectApiItem);
      } else {
        const offerData = response as
          | DirectHarvestOfferAPI
          | SponsorshipOfferAPI;
        if (offerData.offerType === "direct-harvest") {
          return normalizeDirectHarvestOffer(
            offerData as DirectHarvestOfferAPI,
          );
        } else {
          return normalizeSponsorshipOffer(offerData as SponsorshipOfferAPI);
        }
      }
    } catch (error) {
      console.error(`Error fetching project ${projectId}:`, error);
      return null;
    }
  }

  /**
   * Invalidate projects cache
   */
  invalidateProjectsCache() {
    this.projectsCache.clear();
  }

  /**
   * Projects cache storage - stores normalized UnifiedProject[] with TTL
   */
  private projectsCache = new Map<
    string,
    { data: UnifiedProject[]; timestamp: number }
  >();
}

export const adminService = new AdminService();
