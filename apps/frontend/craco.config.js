/* eslint-disable import/no-extraneous-dependencies */
const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  style: {
    postcss: {
      plugins: [tailwind, autoprefixer],
    },
  },
};
