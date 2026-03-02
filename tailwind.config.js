export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ["Inter", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono:  ["Roboto Mono", "JetBrains Mono", "Fira Code", "Consolas", "monospace"],
        serif: ["Merriweather", "Georgia", "serif"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },

      fontWeight: {
        regular:   "400",
        medium:    "500",
        semibold:  "600",
        bold:      "700",
        extrabold: "800",
      },

      letterSpacing: {
        caps: "0.08em",
      },

      colors: {
        "bg-app":      "#050505",
        "bg-page":     "#080808",
        "bg-surface":  "#0f0f0f",
        "bg-elevated": "#141414",
        "bg-overlay":  "#1a1a1a",
        "bg-subtle":   "#2a2a2a",
        "bg-input":    "#1a1a1a",
        "bg-hover":    "rgba(255,255,255,0.05)",
        "bg-active":   "rgba(255,255,255,0.08)",
        "bg-selected": "rgba(34,197,94,0.12)",

        "border-base":   "#2a2a2a",
        "border-subtle": "#242424",
        "border-strong": "#404040",
        "border-brand":  "#22c55e",
        "border-focus":  "#4ade80",
        "border-error":  "#ef4444",

        "text-primary":   "#ffffff",
        "text-secondary": "#b0b0b0",
        "text-tertiary":  "#737373",
        "text-disabled":  "#404040",
        "text-brand":     "#22c55e",
        "text-danger":    "#ef4444",
        "text-warning":   "#f59e0b",
        "text-link":      "#60a5fa",
        "text-on-brand":  "#ffffff",

        "brand-primary":      "#22c55e",
        "brand-primary-hover":"#16a34a",
        "brand-accent":       "#f97316",
        "brand-accent-hover": "#ea580c",

        "status-paid":    "#22c55e",
        "status-pending": "#f59e0b",
        "status-overdue": "#ef4444",
        "status-upcoming":"#555555",
        "status-success": "#22c55e",
        "status-warning": "#f59e0b",
        "status-error":   "#ef4444",
        "status-info":    "#818cf8",

        "tile-total":   "#94a3b8",
        "tile-paid":    "#22c55e",
        "tile-pending": "#f97316",
        "tile-info":    "#818cf8",

        "olive-400": "#8FA887",
        "olive-500": "#6B8E23",
        "olive-600": "#5A7519",

        "green-500":  "#22c55e",
        "green-600":  "#16a34a",
        "orange-500": "#f97316",
        "orange-600": "#ea580c",
        "red-500":    "#ef4444",
        "amber-500":  "#f59e0b",
        "indigo-400": "#818cf8",
        "blue-400":   "#60a5fa",
      },

      borderRadius: {
        sm:     "4px",
        base:   "6px",
        md:     "8px",
        lg:     "12px",
        xl:     "16px",
        "2xl":  "20px",
        "3xl":  "24px",
        button: "8px",
        card:   "12px",
        dialog: "16px",
        badge:  "9999px",
      },

      boxShadow: {
        sm:      "0 1px 2px rgba(0,0,0,0.3)",
        base:    "0 2px 6px rgba(0,0,0,0.4)",
        md:      "0 4px 12px rgba(0,0,0,0.45)",
        lg:      "0 8px 24px rgba(0,0,0,0.55)",
        xl:      "0 16px 48px rgba(0,0,0,0.65)",
        "2xl":   "0 24px 80px rgba(0,0,0,0.85)",
        dialog:  "0 24px 64px rgba(0,0,0,0.8)",
        brand:   "0 2px 12px rgba(34,197,94,0.3)",
        accent:  "0 2px 12px rgba(249,115,22,0.4)",
        danger:  "0 2px 12px rgba(239,68,68,0.3)",
        warning: "0 2px 12px rgba(245,158,11,0.3)",
      },

      transitionDuration: {
        75:  "75ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.45,0,0.55,1)",
      },
    },
  },
  plugins: [],
};
