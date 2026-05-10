/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./pages/*.html"
  ],

  theme: {
    extend: {
      colors: {
        primary: "#f49d25",
        "background-light": "#f8f7f5",
        "background-dark": "#221a10",
      },

      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
      },

      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },

  plugins: [],
}