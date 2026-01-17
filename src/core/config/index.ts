/**
 * Core Configuration
 * Application-wide configuration settings
 */

export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Aswenna Portal',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
  },
  features: {
    // Feature flags
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.MODE === 'development',
  },
} as const

export type AppConfig = typeof config
