/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'light-red': '#f8d7da',
        'light-orange': '#ffe5b4',
        'light-yellow': '#fefce8',
        'light-green': '#3fd02d',
        'light-teal': '#d1ecf1',
        'light-blue': '#0181ef',
        'light-indigo': '#d6d8ff',
        'light-purple': '#e2d6ff',
        'light-pink': '#f9e2e9',
        'light-gray': '#f4f4f4',
      },
    },
  },
  plugins: [],
}