import { createContext } from 'react';

export type UserRole = 'farmer' | 'investor' | 'land_owner';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
