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
        dark: '#000000',
        card: '#0E0E11',
        bazara: {
          bg: '#000000',
          panel: '#0E0E11',
          nav: '#0E0E11',
          line: '#232323',
          muted: '#9ca3af',
          accent: '#fe6125',
        },
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