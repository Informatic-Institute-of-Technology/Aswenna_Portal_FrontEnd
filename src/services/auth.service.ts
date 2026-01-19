/**
 * Authentication Service
 * Handles authentication API calls and token management
 */

import type { User, UserRole } from '@/Context/createAuthContext';
import { decryptToken } from '@/utils';
import { httpClient } from './httpClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
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
}

class AuthService {

  async login(credentials: LoginCredentials): Promise<User> {
    console.log('=== Authentication Service: Login ===');
    console.log('Request credentials:', { email: credentials.email });

    const loginResponse = await httpClient.post<LoginResponse>('/auth/login', credentials);

    console.log('=== First API Response (Login) ===');
    console.log('Raw response data:', loginResponse);

    if (!loginResponse.access_token) {
      throw new Error('No access token received');
    }

    // Step 2: Decrypt token to get user ID and role
    const token = loginResponse.access_token;
    console.log('=== Token Information ===');
    console.log('Token Type:', loginResponse.token_type);
    console.log('Expires In:', loginResponse.expires_in, 'seconds');
    console.log('Encrypted Token:', token);

    const decryptedData = decryptToken(token);
    console.log('Decrypted Token Payload:', decryptedData);
    console.log('Raw Decrypted Data:', JSON.stringify(decryptedData, null, 2));

    const userId = decryptedData?.sub || decryptedData?.userId || decryptedData?.id;
    const userRole = decryptedData?.role;

    if (!userId) {
      throw new Error('No user ID found in token');
    }

    console.log('User ID from token:', userId);
    console.log('User role from token:', userRole);

    // Step 3: Store token
    localStorage.setItem('auth_token', token);
    localStorage.setItem('token_type', loginResponse.token_type || 'Bearer');
    localStorage.setItem('token_expires_in', loginResponse.expires_in?.toString() || '');
    console.log('Token saved to localStorage');

    // Step 4: Fetch full user profile
    console.log('\n=== Making Second API Call to Get User Details ===');
    const userProfile = await httpClient.get<UserApiResponse>(`/v1/user/${userId}`);

    console.log('=== Second API Response (User Details) ===');
    console.log('Raw user details:', userProfile);

    // Step 5: Map and store user data
    const userData: User = {
      _id: userProfile._id || null,
      firstName: userProfile.firstName || null,
      lastName: userProfile.lastName || null,
      fullName: userProfile.fullName || null,
      address: userProfile.address || null,
      email: userProfile.email || null,
      emailVerified: userProfile.emailVerified ?? null,
      phoneNumber: userProfile.phoneNumber || null,
      phoneNumberVerified: userProfile.phoneNumberVerified ?? null,
      roles: Array.isArray(userProfile.roles) ? userProfile.roles : [],
      permissions: Array.isArray(userProfile.permissions) ? userProfile.permissions : [],
      createdBy: userProfile.createdBy || null,
      updatedBy: userProfile.updatedBy || null,
      meta: Array.isArray(userProfile.meta) ? userProfile.meta : [],
      createdAt: userProfile.createdAt || null,
      updatedAt: userProfile.updatedAt || null,
      __v: userProfile.__v ?? null,
      role: userRole as UserRole,
    };

    console.log('\n=== Parsed Final User Data ===');
    console.log(JSON.stringify(userData, null, 2));

    localStorage.setItem('user', JSON.stringify(userData));

    return userData;
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('token_expires_in');
    localStorage.removeItem('user');
    console.log('User logged out');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
