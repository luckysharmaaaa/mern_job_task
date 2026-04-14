/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minHeight: {
        '150': '600px', // Now you can use min-h-150 in your code
      },
    },
  },
  plugins: [],
}