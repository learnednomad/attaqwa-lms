import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
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
        secondary: {
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
        charcoal: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
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
    },
  },
  plugins: [],
}

export default config
