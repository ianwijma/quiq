const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      // Neutral
      white: colors.white,
      gray: colors.gray,
      black: colors.black,
      // Brand
      primary: colors.purple,
      secondairy: colors.green,
    },
    extend: {},
  },
  plugins: [],
};
