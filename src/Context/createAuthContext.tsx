import { createContext } from "react";

export type UserRole = "farmer" | "investor" | "landowner" | "superadmin";

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
