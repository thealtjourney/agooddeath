import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#e9dcbe",
          light: "#f2e8d0",
          dark: "#d8c69f",
        },
        ink: {
          DEFAULT: "#2a2117",
          soft: "#4a3d2c",
          faded: "#6b5a43",
        },
        rubric: "#8f2c1c", // red-ink capitals
        gilt: "#b5872b", // gold for A Good Death
      },
      fontFamily: {
        black: ["var(--font-blackletter)", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
      },
      keyframes: {
        flashIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stamp: {
          "0%": { opacity: "0", transform: "scale(1.6) rotate(-8deg)" },
          "60%": { opacity: "1", transform: "scale(0.92) rotate(-8deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-8deg)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "70%": { opacity: "1", transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        flashIn: "flashIn 0.4s ease-out both",
        stamp: "stamp 0.5s cubic-bezier(0.2,0.8,0.2,1) both",
        pulseSoft: "pulseSoft 1.4s ease-in-out infinite",
        pop: "pop 0.5s cubic-bezier(0.2,0.8,0.2,1) both",
        riseIn: "riseIn 0.5s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
