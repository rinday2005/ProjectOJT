/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d8ca5',
          hover: '#0a7d94',
        },
        'cream-sidebar': '#f9fbfc',
        'background-light': '#fafbfc',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        sans: ['Public Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}