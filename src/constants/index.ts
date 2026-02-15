/**
 * Application Constants
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Application Routes
export const ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  HOME: '/',
} as const;

// Authentication
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user';
export const TOKEN_EXPIRY_KEY = 'token_expiry';

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// UI Constants
export const APP_NAME = 'Aswenna Portal';
export const TOAST_DURATION = 3000; // 3 seconds

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'auth_token',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please try again.',
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  LOGOUT_SUCCESS: 'Successfully logged out',
  PASSWORD_RESET_SENT: 'Password reset email sent',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
