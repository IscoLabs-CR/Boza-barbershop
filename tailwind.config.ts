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
        // Acento dorado de la marca Boza (placa/anillo del logo, bordes y tagline).
        gold: {
          DEFAULT: "#c8a24c",
          deep: "#94702c",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono-ticket)", "monospace"],
        // Título del hero. Oswald es condensada: encaja mejor nombres largos
        // como "BOZA BARBERSHOP" sin desbordar en móvil.
        fancy: ["var(--font-oswald)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
