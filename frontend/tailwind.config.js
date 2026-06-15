/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bcdffd',
          300: '#7ec0fa',
          400: '#3b9bf6',
          500: '#107beb', 
          600: '#055ec0',
          700: '#054ba0',
          800: '#084081',
          900: '#0d366b',
        }
      }
    },
  },
  plugins: [],
}
