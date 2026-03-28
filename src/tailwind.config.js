/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          400: '#b275ff', // remapping old orange to new purple globally
          500: '#A259FF', // remapping old orange to new purple globally
          600: '#8c42eb',
        },
        purple: {
          400: '#b275ff',
          500: '#A259FF',
          600: '#8c42eb',
        },
        dark: '#0A0A0F',
        card: '#13141C',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        orange: '0 2px 24px 0 #ff880088',
        purple: '0 2px 24px 0 #a259ff88',
      }
    },
  },
  plugins: [],
} 