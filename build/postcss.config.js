const Autoprefixer = require('autoprefixer');
const CssNano = require('cssnano');

module.exports = {
  plugins: [
    Autoprefixer,
    CssNano({
      preset: [
        'default', {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
