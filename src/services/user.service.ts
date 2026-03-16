import type { User, UserRole } from "@/Context/createAuthContext";
import { config } from "@/core/config";
import { httpClient } from "./httpClient";

type RoleApiValue =
  | string
  | {
      _id?: string;
      name?: string;
      description?: string;
    }
  | null
  | undefined;

const normalizeCropFocus = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const deriveRole = (role: RoleApiValue): UserRole | undefined => {
  const roleName =
    typeof role === "string"
      ? role
      : typeof role === "object" && role
        ? role.name
        : undefined;

  const normalized = roleName?.toLowerCase();
  if (
    normalized === "farmer" ||
    normalized === "investor" ||
    normalized === "landowner" ||
    normalized === "superadmin"
  ) {
    return normalized;
  }

  return undefined;
};

type ProfilePictureApiValue =
  | string
  | {
      url?: string;
      filename?: string;
      [key: string]: unknown;
    }
  | null
  | undefined;

type UploadedMediaApiValue =
  | {
      url?: string;
      filename?: string;
      [key: string]: unknown;
    }
  | null
  | undefined;

const resolveProfilePicture = (
  value: ProfilePictureApiValue,
): ProfilePictureApiValue => {
  if (!value || typeof value === "string") return value;
  if (value.url || !value.filename) return value;

  return {
    ...value,
    url: `${config.storage.baseUrl}/${value.filename}`,
  };
};

const resolveUploadedMedia = (
  value: UploadedMediaApiValue,
): UploadedMediaApiValue => {
  if (!value) return value;
  if (value.url || !value.filename) return value;

  return {
    ...value,
    url: `${config.storage.baseUrl}/${value.filename}`,
  };
};

export interface UpdateUserProfileDTO {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  address?: string;
  phoneNumber?: string;
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
  };
  investor?: {
    organizationName?: string;
    registrationNo?: string;
    companyAddress?: string;
    organizationPhoneNumber?: string;
    dsDivision?: string;
    gnDivision?: string;
    cropFocus?: string[];
  };
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
  status?: string | null;
  termsAccepted?: boolean | null;
  role?: RoleApiValue;
  investor?: {
    organizationName?: string;
    registrationNo?: string;
    companyAddress?: string;
    organizationPhoneNumber?: string;
    dsDivision?: string;
    gnDivision?: string;
    cropFocus?: string | string[];
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
    const mappedPersonalInfo = response.personalInfo
      ? {
          ...response.personalInfo,
          profilePicture: resolveProfilePicture(
            response.personalInfo.profilePicture,
          ),
          nicFrontImage: resolveUploadedMedia(
            response.personalInfo.nicFrontImage,
          ),
          nicBackImage: resolveUploadedMedia(
            response.personalInfo.nicBackImage,
          ),
        }
      : null;

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
      role: deriveRole(response.role),
      roleInfo:
        typeof response.role === "object" && response.role
          ? response.role
          : null,
      status: response.status ?? null,
      termsAccepted: response.termsAccepted ?? null,
      investor: response.investor
        ? {
            ...response.investor,
            cropFocus: normalizeCropFocus(response.investor.cropFocus),
          }
        : null,
      personalInfo: mappedPersonalInfo,
    };
  }
}

export const userService = new UserService();
