import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Pull in the custom font variable from layout.tsx
      fontFamily: {
        // If you want a named key, e.g. "sans" or "poppins"
        poppins: ["var(--font-poppins)"],
      },
      // Only keep the colors you need
      colors: {
        primary: "#C78853",
        screen: "#FBFEF9",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
