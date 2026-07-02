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
          DEFAULT: 'hsl(262, 83%, 58%)',
          light: 'hsl(262, 83%, 68%)',
          dark: 'hsl(262, 83%, 48%)',
        },
        secondary: {
          DEFAULT: 'hsl(316, 70%, 50%)',
          light: 'hsl(316, 70%, 60%)',
          dark: 'hsl(316, 70%, 40%)',
        },
        darkBg: {
          DEFAULT: 'hsl(222, 47%, 11%)',
          card: 'hsl(223, 47%, 16%)',
          border: 'hsl(223, 47%, 22%)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
