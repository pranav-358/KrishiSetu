/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soil-ink': '#2B2419',
        'husk-cream': '#F7F1E4',
        'leaf-green': '#3F6B4A',
        'sindoor-rust': '#C1440E',
        'wheat-gold': '#E8B84B',
        'well-water-blue': '#3E6E8E',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
