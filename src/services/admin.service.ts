/**
 * Admin API Service
 * Handles all API calls for super admin features
 */

import { httpClient } from './httpClient';

export interface ApiUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  role: string;
  permissions: string[];
  createdBy: string;
  updatedBy: string;
  meta: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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

class AdminService {
  async getAllUsers(page: number = 1, limit: number = 100): Promise<UsersResponse> {
    try {
      const response = await httpClient.get<UsersResponse>(
        `/v1/user?page=${page}&limit=${limit}`
      );
      console.log('Fetched users:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
        '696e40fda4f896e9f40c8b93': 'farmer',
        '696e6163b558abe269548099': 'investor',
        '696e616db558abe26954809c': 'landowner',
        '696f008a3e12fb6fd9ed945b': 'superadmin',
      };

      const stats = {
        totalUsers: data.length,
        farmers: data.filter((u) => roleMapping[u.role] === 'farmer').length,
        investors: data.filter((u) => roleMapping[u.role] === 'investor').length,
        landowners: data.filter((u) => roleMapping[u.role] === 'landowner').length,
        verified: data.filter((u) => u.emailVerified).length,
        unverified: data.filter((u) => !u.emailVerified).length,
      };

      return stats;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw error;
    }
  }

  parseLocation(address: string): { city: string; province?: string } {
    const parts = address.split(',').map((p) => p.trim());
    return {
      city: parts[0] || 'Unknown',
      province: parts[1],
    };
  }

  async getUserDistribution() {
    try {
      const users = await this.getAllUsersPaginated();
      const distribution: { [key: string]: number } = {};

      users.forEach((user) => {
        const { city } = this.parseLocation(user.address);
        distribution[city] = (distribution[city] || 0) + 1;
      });

      return distribution;
    } catch (error) {
      console.error('Failed to fetch user distribution:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
