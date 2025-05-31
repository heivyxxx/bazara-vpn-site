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
          400: '#ff8800',
          500: '#ff8800',
        },
        purple: {
          400: '#a259ff',
          500: '#a259ff',
        },
        dark: '#181818',
        card: '#232323',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        orange: '0 2px 24px 0 #ff880088',
        purple: '0 2px 24px 0 #a259ff88',
      }
    },
  },
  plugins: [],
} 