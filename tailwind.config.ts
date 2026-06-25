import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a56db",
          dark: "#1243af",
          light: "#e8effc",
        },
        secondary: {
          DEFAULT: "#0e9f6e",
          light: "#e3faf5",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fef3c7",
        },
        danger: {
          DEFAULT: "#e02424",
          light: "#fde8e8",
        },
        info: {
          DEFAULT: "#3f83f8",
          light: "#e1effe",
        },
        dark: "#111827",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
