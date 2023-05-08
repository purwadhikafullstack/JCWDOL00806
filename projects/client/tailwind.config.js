/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue-first": "#5585b5",
        "blue-second": "#53a8b6",
        "blue-third": "#79c2d0",
        "blue-fourth": "#bbe4e9"
      }
    },
  },
  plugins: [],
}