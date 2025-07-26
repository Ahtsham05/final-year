/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary200:"#ffbf00",
        primary100:"#ffc929",
        secondary200:"#00b050",
        secondary100:"#0b1a78"
      }
    },
  },
  plugins: [],
}

