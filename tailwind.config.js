/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  safelist: [
    'dark',
    // Explicitly safelist all dark mode arbitrary values we use
    'dark:bg-[#272727]',
    'dark:bg-[#2E2E2E]',
    'dark:bg-[#323232]',
    'dark:text-[#F5F5F5]',
    'dark:text-[#747474]',
    'dark:text-[#FF652F]',
    'dark:text-[#FFE400]',
    'dark:border-[#323232]',
    'dark:border-[#FF652F]',
    'dark:border-[#FFE400]',
    'dark:border-[#FF652F]/40',
    'dark:border-[#FF652F]/50',
    'dark:shadow-lg',
    'dark:shadow-xl',
    'dark:shadow-2xl',
    'dark:hover:shadow-xl',
    'dark:hover:shadow-2xl',
    'dark:hover:text-[#FF652F]',
    'dark:hover:border-[#FF652F]',
    'dark:focus:ring-[#FF652F]',
    'dark:bg-[#FF652F]',
    'dark:bg-[#FF652F]/20',
    'dark:bg-[#FF652F]/30',
    'dark:bg-[#14A76C]/20',
    'dark:bg-[#14A76C]/30',
    'dark:text-[#14A76C]',
    'dark:bg-[#FFE400]/10',
    'dark:bg-[#FFE400]/20',
    'dark:text-[#FFE400]',
    'dark:border-[#FFE400]/20',
  ],
  theme: {
    extend: {
      colors: {
        // Custom palette
        'bg-primary': {
          light: '#FAFBFF',
          dark: '#272727',
        },
        'bg-secondary': {
          light: '#F5F7FA',
          dark: '#2E2E2E',
        },
        'bg-tertiary': {
          light: '#FFFFFF',
          dark: '#323232',
        },
        'text-primary': {
          light: '#1E1E1E',
          dark: '#F5F5F5',
        },
        'text-secondary': {
          light: '#4A5568',
          dark: '#747474',
        },
        'accent': {
          primary: '#2563EB',
          highlight: '#FFE400',
          success: '#14A76C',
        },
      },
    },
  },
  plugins: [],
}

