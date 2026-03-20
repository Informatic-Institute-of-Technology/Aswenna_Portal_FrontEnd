
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const API_TIMEOUT = 30000;

export const ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  HOME: "/",
} as const;

export const AUTH_TOKEN_KEY = "auth_token";
export const USER_DATA_KEY = "user";
export const TOKEN_EXPIRY_KEY = "token_expiry";

export const PASSWORD_MIN_LENGTH = 8;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const APP_NAME = "Aswenna Portal";
export const TOAST_DURATION = 3000;

export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "auth_token",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  NETWORK_ERROR: "Network error. Please try again.",
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  GENERIC_ERROR: "Something went wrong. Please try again.",
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in!",
  LOGOUT_SUCCESS: "Successfully logged out",
  PASSWORD_RESET_SENT: "Password reset email sent",
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export const CROP_EMOJI_MAP: Record<string, string> = {
  Rice: "🌾",
  Wheat: "🌾",
  Corn: "🌽",
  Tomatoes: "🍅",
  Potatoes: "🥔",
  Onions: "🧅",
  Carrots: "🥕",
  Tea: "🍵",
  Coffee: "☕",
  Rubber: "🌳",
  Coconut: "🥥",
  "Vegetables (Mixed)": "🥬",
  "Fruits (Mixed)": "🍎",
  Cinnamon: "🌿",
  Pepper: "🌶️",
  Chili: "🌶️",
  Banana: "🍌",
  Mango: "🥭",
} as const;

export const CROP_EMOJIS = [
  "🌾",
  "🌽",
  "🍅",
  "🥔",
  "🧅",
  "🥕",
  "🍵",
  "☕",
  "🌳",
  "🥥",
  "🥬",
  "🍎",
  "🌿",
  "🌶️",
  "🍌",
  "🥭",
  "🫘",
  "🍇",
  "🍊",
  "🍋",
  "🫑",
  "🥒",
  "🧄",
  "🍠",
] as const;

export const OFFER_BACKGROUND_IMAGES = [
  {
    id: "rice-paddy",
    url: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600",
    label: "Rice Paddy",
  },
  {
    id: "vegetable-farm",
    url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600",
    label: "Vegetable Farm",
  },
  {
    id: "tea-plantation",
    url: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600",
    label: "Tea Plantation",
  },
  {
    id: "coconut-grove",
    url: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=600",
    label: "Coconut Grove",
  },
  {
    id: "spice-garden",
    url: "https://images.unsplash.com/photo-1466065478348-0b967011f8e0?w=600",
    label: "Spice Garden",
  },
  {
    id: "fruit-orchard",
    url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600",
    label: "Fruit Orchard",
  },
  {
    id: "corn-field",
    url: "https://images.unsplash.com/photo-1601312078427-cb0a18440ddd?w=600",
    label: "Corn Field",
  },
  {
    id: "green-farmland",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
    label: "Green Farmland",
  },
  {
    id: "tropical-plantation",
    url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600",
    label: "Tropical Plantation",
  },
  {
    id: "highland-farm",
    url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600",
    label: "Highland Farm",
  },
  {
    id: "sunrise-field",
    url: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=600",
    label: "Sunrise Field",
  },
  {
    id: "harvest-scene",
    url: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600",
    label: "Harvest Scene",
  },
] as const;
