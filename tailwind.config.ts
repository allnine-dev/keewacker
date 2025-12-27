import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg: "#0a0a0a",
          surface: "#1a1a1a",
          card: "#242424",
          border: "#333333",
          text: "#e5e5e5",
          muted: "#888888",
          accent: "#f5c400",
        },
      },
      ringColor: {
        DEFAULT: "#f5c400",
      },
      ringWidth: {
        DEFAULT: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
