const daisyui = require('daisyui');

module.exports = {
  content: [
    './src/**/*.{tsx,jsx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'msg': 'fit-content(200px) 1fr',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [daisyui],
  daisyui: {
    themes: false,
  },
  important: true,
};
