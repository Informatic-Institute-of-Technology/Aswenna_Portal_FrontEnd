export type UserRole = 'farmer' | 'investor' | 'landowner' | 'superadmin';
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

// Export project-related types
export * from './project.types';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

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

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

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

export interface RegistrationData {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  nationalId: string;
  address: string;
  contactNumber: string;
  alternateContact?: string;
  dob: string;
  province?: string;
  district?: string;
  termsAccepted?: boolean;
}
