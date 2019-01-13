const fs = require("fs");

module.exports = {
  syntax: "postcss-scss",
  plugins: {
    "postcss-easy-import": {
      extensions: ".scss"
    },
    "autoprefixer": {},
    "postcss-advanced-variables": {
      "variables": JSON.parse(
        fs.readFileSync("./src/assets/styles/variables.json", "utf-8")
      )
    },
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
