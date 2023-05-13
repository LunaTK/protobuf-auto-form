const daisyui = require('daisyui');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,jsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {},
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    daisyui,
    plugin(function ({ addVariant }) {
      addVariant('not-first-desc', '&>*:not(:first-child)');
    }),
  ],
  daisyui: {
    themes: ['dark', 'light'],
  },
  darkMode: 'class',
};
