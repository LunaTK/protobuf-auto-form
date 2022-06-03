const daisyui = require('daisyui');

module.exports = {
  content: [
    './src/**/*.{tsx,jsx}',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [daisyui],
  daisyui: {
    themes: false,
  },
};
