/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
   theme: {
    extend: {
      fontFamily: {
         sans: ['Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}