/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af", // Navy Blue
        gold: "#d97706",   // Gold/Amber
        navy: "#0f172a",
        muted: "#475569",
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
