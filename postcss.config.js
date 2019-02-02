module.exports = ({ file, options, env }) => {
  let config = {
    syntax: "postcss-scss",
    plugins: {
      "postcss-easy-import": {
        extensions: ".scss"
      },
      "autoprefixer": {},
      "postcss-nested": {},
      "postcss-rgb": {},
      "postcss-inline-comment": {}
    }
  };
  if (env === "production") {
    config.plugins["cssnano"] = {
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
  return config;
};
