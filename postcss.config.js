module.exports = {
  syntax: "postcss-scss",
  plugins: {
    "postcss-easy-import": {
      extensions: ".scss"
    },
    "autoprefixer": {},
    "postcss-nested": {},
    "postcss-rgb": {},
    "postcss-inline-comment": {},
    "cssnano": {
      map: true,
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true
          }
        }
      ]
    }
  }
};
