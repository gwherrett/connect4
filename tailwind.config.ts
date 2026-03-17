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
        apt: {
          lime:         '#A9B743',
          terra:        '#7A3E28',
          dark:         '#2A2318',
          cream:        '#FAF7F0',
          mid:          '#5B5348',
          'lime-tint':  '#F4F8E8',
          'terra-tint': '#F4E8E0',
        },
        success: { 500: '#3a7d44' },
        error:   { 500: '#c0392b' },
      },
      fontFamily: {
        display: ['var(--font-lora)', 'Georgia', 'serif'],
        body:    ['var(--font-figtree)', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        sm:  '6px',
        md:  '10px',
        lg:  '16px',
        btn: '0.375rem',
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
