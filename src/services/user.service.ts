import type { User } from "@/Context/createAuthContext";
import { httpClient } from "./httpClient";

export interface UpdateUserProfileDTO {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
}

export interface UserApiResponse {
  _id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  address: string | null;
  email: string | null;
  emailVerified: boolean | null;
  phoneNumber: string | null;
  phoneNumberVerified: boolean | null;
  roles: string[];
  permissions: string[];
  createdBy: string | null;
  updatedBy: string | null;
  meta: unknown[];
  createdAt: string | null;
  updatedAt: string | null;
  __v: number | null;
  personalInfo?: {
    nicNumber?: string;
    gender?: string;
    birthday?: string;
    age?: number;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    district?: string;
    profilePicture?: string | { url?: string; filename?: string } | null;
    nicFrontImage?: { url?: string; filename?: string } | null;
    nicBackImage?: { url?: string; filename?: string } | null;
  } | null;
}

class UserService {
  async getUserProfile(userId: string): Promise<User> {
    const response = await httpClient.get<UserApiResponse>(
      `/v1/user/${userId}`,
    );
    return this.mapUserResponse(response);
  }
  async updateUserProfile(
    userId: string,
    data: UpdateUserProfileDTO,
  ): Promise<User> {
    const response = await httpClient.patch<UserApiResponse>(
      `/v1/user/${userId}`,
      data,
    );
    return this.mapUserResponse(response);
  }
  async checkEmailDuplicate(email: string): Promise<boolean> {
    const response = await httpClient.get<{ exists: boolean }>(
      `/v1/user/email/${encodeURIComponent(email)}/duplicate-check`,
    );
    return response.exists;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user;
      }
      return null;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  private mapUserResponse(response: UserApiResponse): User {
    return {
      _id: response._id || null,
      firstName: response.firstName || null,
      lastName: response.lastName || null,
      fullName: response.fullName || null,
      address: response.address || null,
      email: response.email || null,
      emailVerified: response.emailVerified ?? null,
      phoneNumber: response.phoneNumber || null,
      phoneNumberVerified: response.phoneNumberVerified ?? null,
      roles: Array.isArray(response.roles) ? response.roles : [],
      permissions: Array.isArray(response.permissions)
        ? response.permissions
        : [],
      createdBy: response.createdBy || null,
      updatedBy: response.updatedBy || null,
      meta: Array.isArray(response.meta) ? response.meta : [],
      createdAt: response.createdAt || null,
      updatedAt: response.updatedAt || null,
      __v: response.__v ?? null,
      personalInfo: response.personalInfo ?? null,
    };
  }
}

export const userService = new UserService();
