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
  
export * from './api';
export * from './farmer.types';
export * from './investor.types';

