import { createContext } from "react";

export type UserRole = 'farmer' | 'investor' | 'landowner' | 'superadmin';

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
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  nationalId?: string;
  address?: string;
  contactNumber?: string;
  alternateContact?: string;
  dob?: string;
  province?: string;
  district?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup?: (data: SignUpData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
