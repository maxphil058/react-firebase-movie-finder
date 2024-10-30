/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      "fontFamily" :{
        "matemasie":["matemasie","sans-serif"],
        "nerko":['Nerko One',"sans-serif"],
        "afacad":['Afacad Flux',"sans-serif"],

      }
      
    },
  },
  plugins: [],
}