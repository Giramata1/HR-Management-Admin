/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Important if using App Router or src directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class', // Optional: enables dark mode with `class`
};
