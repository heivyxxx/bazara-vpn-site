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
          400: '#ff824f',
          500: '#fe6125',
          600: '#e04c14',
        },
        purple: {
          400: '#ff824f',
          500: '#fe6125',
          600: '#e04c14',
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