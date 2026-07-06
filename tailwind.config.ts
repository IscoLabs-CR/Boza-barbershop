import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#ffffff",
        ink: "#0b1f2a",
        muted: "#64748b",
        line: "#e6ebf0",
        brand: {
          DEFAULT: "#2c2c34",
          deep: "#161519",
          tint: "#ececf0",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono-ticket)", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
