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
          50:  '#fdf6ee',
          100: '#f5e8d0',
          500: '#c87800',
          700: '#8a5200',
        },
        neutral: {
          50:  '#f5f2ed',
          100: '#ede8e1',
          200: '#d8d0c5',
          400: '#a09080',
          600: '#6b5f52',
          900: '#1a1a1a',
        },
        success: { 500: '#3a7d44' },
        error:   { 500: '#c0392b' },
      },
      fontFamily: {
        display: ['Palatino Linotype', 'Palatino', 'Book Antiqua', 'Georgia', 'serif'],
        body:    ['var(--font-source-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08)',
        md: '0 4px 12px rgba(0,0,0,0.1)',
        lg: '0 8px 24px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
