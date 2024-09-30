/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dm_sans: ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "light-gradient": "linear-gradient(to bottom, #F9FFFF, #38C8E6)",
        "dark-gradient": "linear-gradient(to bottom, #031027, #02101D)",
      },
    },
  },
  plugins: [],
};
