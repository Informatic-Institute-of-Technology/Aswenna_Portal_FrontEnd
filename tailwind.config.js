/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4ade80",
        "primary-dark": "#22c55e",
        "background-light": "#f3f4f6",
        "background-dark": "#050505",
        "surface-light": "#ffffff",
        "surface-dark": "#0f0f10",
        "surface-card": "#161618",
        "border-light": "#e5e7eb",
        "border-dark": "#27272a",
        "accent-green": "#22c55e",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
