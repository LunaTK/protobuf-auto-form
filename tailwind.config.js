const daisyui = require('daisyui');

module.exports = {
  content: [
    './src/**/*.{tsx,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: false,
  },
};
