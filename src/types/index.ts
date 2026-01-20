/**
 * Global type definitions
 * Export all shared types from this file
 */

export type UserRole = 'farmer' | 'investor' | 'landowner' | 'superadmin';

// User & Authentication Types
export interface User {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  name: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Form Types
export interface FormField {
  value: string;
  error?: string;
  touched?: boolean;
}

export interface LoginFormState {
  email: FormField;
  password: FormField;
}

export interface SignUpFormState {
  name: FormField;
  email: FormField;
  password: FormField;
  confirmPassword: FormField;
}

// Registration Form Data
export interface RegistrationData {
  // Step 1: Initial signup
  email: string;
  password: string;

  // Step 2: Role selection
  role: UserRole;

  // Step 3: Personal details
  fullName: string;
  nationalId: string;
  address: string;
  contactNumber: string;
  alternateContact?: string;
  dob: string;
  province?: string;
  district?: string;

  // Step 4: Terms accepted
  termsAccepted?: boolean;
}
