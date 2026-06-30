import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefdf3",
          100: "#d6f9e1",
          200: "#aff2c6",
          300: "#79e6a3",
          400: "#3fd07c",
          500: "#16a34a",
          600: "#0f8a3d",
          700: "#0d6e33",
          800: "#0e572b",
          900: "#0c4724",
        },
        sun: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
    },
  },
  plugins: [],
};

export default config;
