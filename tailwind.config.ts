import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand - Enterprise Red
        primary: {
          DEFAULT: "#C00000",
          hover: "#A00000",
          active: "#800000",
          light: "#FFF5F5",
          border: "#FCA5A5",
          subtle: "#FEF2F2",
          darkLight: "#2A0808",
        },
        // Background & Surfaces (CSS Variable Powered)
        background: "hsl(var(--background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        sidebar: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          border: "hsl(var(--border) / <alpha-value>)",
          muted: "#64748B",
          active: "#C00000",
          activeBg: "#FFF5F5",
        },
        // Subtle Status Pastels (With Dark Mode Contrast Alternatives)
        status: {
          success: {
            bg: "#F0FDF4",
            text: "#15803D",
            border: "#DCFCE7",
            darkBg: "#052E16",
            darkText: "#4ADE80",
            darkBorder: "#14532D",
          },
          danger: {
            bg: "#FEF2F2",
            text: "#991B1B",
            border: "#FEE2E2",
            darkBg: "#450A0A",
            darkText: "#FCA5A5",
            darkBorder: "#7F1D1D",
          },
          warning: {
            bg: "#FFFBEB",
            text: "#B45309",
            border: "#FEF3C7",
            darkBg: "#451A03",
            darkText: "#FDE047",
            darkBorder: "#78350F",
          },
          info: {
            bg: "#EFF6FF",
            text: "#1D4ED8",
            border: "#DBEAFE",
            darkBg: "#172554",
            darkText: "#60A5FA",
            darkBorder: "#1E3A8A",
          },
        },
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px", letterSpacing: "0.05em" }],
        xs: ["12px", { lineHeight: "16px", letterSpacing: "-0.01em" }],
        sm: ["13px", { lineHeight: "18px", letterSpacing: "-0.01em" }],
        base: ["14px", { lineHeight: "20px", letterSpacing: "-0.01em" }],
        lg: ["16px", { lineHeight: "24px", letterSpacing: "-0.02em" }],
        xl: ["18px", { lineHeight: "28px", letterSpacing: "-0.02em" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.03em" }],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        dropdown: "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
        modal: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        drawer: "-4px 0 24px 0 rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
