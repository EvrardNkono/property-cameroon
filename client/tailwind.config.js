/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pc-brown': '#3E2723', // Marron Prestige
        'pc-green': '#2E7D32', // Vert Agriculture
        'pc-gold': '#D4AF37',  // Or Investissement
      },
    },
  },
  plugins: [],
}