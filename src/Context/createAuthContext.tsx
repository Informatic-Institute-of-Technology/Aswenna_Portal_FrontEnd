import { createContext } from "react";

export type UserRole = "farmer" | "investor" | "landowner" | "superadmin";

export interface InvestorProfile {
  organizationName?: string;
  registrationNo?: string;
  companyAddress?: string;
  organizationPhoneNumber?: string;
  dsDivision?: string;
  gnDivision?: string;
  cropFocus?: string[];
}

export interface RoleInfo {
  _id?: string;
  name?: string;
  description?: string;
}

export interface UploadedMedia {
  url?: string;
  filename?: string;
  fileSize?: string;
  mimeType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string | null;
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
  role?: UserRole;
  roleInfo?: RoleInfo | null;
  status?: string | null;
  termsAccepted?: boolean | null;
  investor?: InvestorProfile | null;
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
    profilePicture?: string | UploadedMedia | null;
    nicFrontImage?: UploadedMedia | null;
    nicBackImage?: UploadedMedia | null;
  } | null;
}

export interface AuthContextType {
  user: User | null;
  sessionId: string | null;
  loading: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
