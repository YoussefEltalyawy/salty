import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  animation: {
    shimmer: 'shimmer 2s linear infinite',
  },
  keyframes: {
    shimmer: {
      from: {
        backgroundPosition: '0 0',
      },
      to: {
        backgroundPosition: '-200% 0',
      },
    },
  },
} satisfies Config;
