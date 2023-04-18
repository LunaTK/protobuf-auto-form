const daisyui = require('daisyui');
const plugin = require('tailwindcss/plugin');

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
    themes: false,
  },
};
