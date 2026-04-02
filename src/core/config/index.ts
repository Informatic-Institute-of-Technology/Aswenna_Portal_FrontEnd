export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || "Aswenna Portal",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    environment: import.meta.env.MODE,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://burt-superwise-indispensably.ngrok-free.dev/api",
    timeout: 30000,
  },
  storage: {
    baseUrl:
      import.meta.env.VITE_STORAGE_BASE_URL ||
      "https://bceinvoice.blob.core.windows.net/blobtest",
  },
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    enableDebug: import.meta.env.MODE === "development",
  },
} as const;

export type AppConfig = typeof config;
