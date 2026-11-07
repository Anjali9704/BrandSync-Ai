/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Modern Professional SaaS Brand Tokens
        'bg-primary': '#F7F8F4',
        'bg-secondary': '#EFEFEA',
        'card': '#FFFFFF',
        'card-hover': '#FBFBF9',
        'border': '#DCE3DA',
        'border-strong': '#CBD4C8',

        // Brand Identity
        'brand': '#244C3A', // Forest Green
        'brand-hover': '#1B3B2D',
        'brand-light': '#E9EFE8',
        'brand-surface': '#F0F4EF',

        // Accents & Support
        'accent': '#D5A45B', // Muted Gold
        'accent-hover': '#C19047',
        'accent-light': '#FAF4EB',
        'sage': '#DCE3DA', // Soft Sage
        'sage-dark': '#BDC9BA',

        // Typography Tokens
        'text-primary': '#252B27',
        'text-secondary': '#737B75',
        'text-muted': '#9CA39E',

        // Semantic Status Tokens
        'success': '#244C3A', // Forest Green for success
        'success-bg': '#EBF2ED',
        'success-text': '#1E3F30',

        'warning': '#C28938', // Muted Gold/Amber
        'warning-bg': '#FCF6EC',
        'warning-text': '#8A5D19',

        'danger': '#C0392B', // Deep terracotta red
        'danger-bg': '#FDF2F2',
        'danger-text': '#962317',

        'info': '#4A6B82', // Slate blue
        'info-bg': '#F0F4F8',
        'info-text': '#2D4B60',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        DEFAULT: '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '14px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(36, 76, 58, 0.04)',
        'card': '0 1px 3px 0 rgba(37, 43, 39, 0.05), 0 1px 2px -1px rgba(37, 43, 39, 0.03)',
        'card-hover': '0 4px 12px 0 rgba(37, 43, 39, 0.08)',
        'modal': '0 16px 36px -4px rgba(36, 76, 58, 0.12), 0 6px 16px -4px rgba(37, 43, 39, 0.08)',
      },
    },
  },
  plugins: [],
};
