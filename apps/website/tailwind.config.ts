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
        // Islamic color palette
        islamic: {
          green: {
            50: '#f0f9f4',
            100: '#dcf2e3',
            200: '#bce5ca',
            300: '#8dd1a5',
            400: '#57b578',
            500: '#349856',
            600: '#267d44',
            700: '#206539',
            800: '#1d5130',
            900: '#1a4329',
          },
          gold: {
            50: '#fefdf3',
            100: '#fdf9e3',
            200: '#fbf2c0',
            300: '#f8e693',
            400: '#f4d65a',
            500: '#efc843',
            600: '#d4a626',
            700: '#b08220',
            800: '#8f6621',
            900: '#785420',
          },
          navy: {
            50: '#f4f6f9',
            100: '#e8edf2',
            200: '#d6dfe7',
            300: '#b8c9d6',
            400: '#94aec1',
            500: '#7793b0',
            600: '#627ba0',
            700: '#556990',
            800: '#495876',
            900: '#3e4a61',
          },
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;