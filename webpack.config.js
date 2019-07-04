const path = require("path");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const autoprefixer = require("autoprefixer");
module.exports = (env, argv) => {
  const devMode = argv.mode !== "production";
  let config = {
    entry: {
      main: path.resolve(__dirname, "./src/assets/scripts/main.js")
    },
    mode: argv.mode,
    output: {
      path: path.resolve(__dirname, "dist/"),
      publicPath: "/",
      filename: devMode ? "js/[name].js" : "js/[name].[chunkhash].js",
      chunkFilename: "js/chunks/[name].[chunkhash].js"
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: [
                  autoprefixer()
                ],
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        },
        {
          enforce: "pre",
          test: /\.js$/,
          loader: "eslint-loader",
          exclude: /node_modules/
        },
        {
          test: /\.pug$/,
          use: [{
            loader: "pug-loader",
            options: {
              pretty: devMode
            }
          }]
        },
        {
          test: /\.(png|jpeg|jpg|gif|svg)$/,
          exclude: [
            path.resolve(__dirname, "./src/assets/icons/"),
            /node_modules.*\.svg$/
          ],
          loader: "file-loader",
          options: {
            name: devMode ? "[path][name].[ext]" : "img/[hash].[ext]"
          }
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          exclude: [
            path.resolve(__dirname, "./src/assets/icons/"),
            path.resolve(__dirname, "./src/assets/images/")
          ],
          use: [{
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]"
            }
          }]
        },
        {
          test: /src.*assets.*icons.*\.svg$/,
          use: [
            {
              loader: "svg-sprite-loader",
              options: {
                extract: !devMode,
                spriteFilename: "/img/sprite.svg",
                runtimeCompat: true
              }
            },
            {
              loader: "svgo-loader",
              options: {
                plugins: [
                  {removeNonInheritableGroupAttrs: true},
                  {collapseGroups: true},
                  {removeAttrs: {attrs: "(fill|stroke)"}}
                ]
              }
            }
          ]
        }
      ]
    },
    devtool: devMode ? "source-map" : false,
    optimization: {
      // splitChunks: {
      //   cacheGroups: {
      //     styles: {
      //       name: "styles",
      //       test: /\.css$/,
      //       chunks: "all",
      //       enforce: true
      //     }
      //   }
      // },
      minimizer: [
        new UglifyJsPlugin({
          parallel: true,
          uglifyOptions: {
            beautify: false,
            compress: {
              sequences: true,
              booleans: true,
              loops: true,
              unused: true,
              unsafe: true,
              drop_console: true
            },
            output: {
              comments: false
            },
            warnings: false
          }
        })
      ]
    },
    devServer: {
      host: "0.0.0.0",
      port: 3000,
      noInfo: true,
      open: true
    },
    plugins: [
      new SpriteLoaderPlugin({
        plainSprite: true
      }),
      new CopyWebpackPlugin([
        {from: "./sitemap.xml", to: ""},
        {from: "./robots.txt", to: ""},
        {from: "./favicon.ico", to: ""}
      ]),
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash].css",
        chunkFilename: "css/chunks/[name].[contenthash].css"
      }),
      new HtmlWebpackPlugin({
        filename: path.join(__dirname, "dist", "index.html"),
        template: path.resolve(__dirname, "./src/template/pages", "index.pug"),
        chunks: ["main"],
        chunksSortMode: "manual",
        title: "My App",
        description: "My App",
        mode: devMode,
        inject: false,
        minify: {
          removeComments: !devMode,
          collapseWhitespace: !devMode,
          conservativeCollapse: !devMode
        }
      })
    ]
  };
  if (!devMode) {
    config.plugins.push(
      new CleanWebpackPlugin(),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css/g,
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ["default", {discardComments: {removeAll: true}}]
        },
        canPrint: true
      }),
      new FaviconsWebpackPlugin({
        logo: "./src/assets/images/favicon.png",
        prefix: "icons-favicon/",
        title: "My App",
        persistentCache: false,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: true
        }
      }),
      new ImageminPlugin({})
    );
  }
  return config;
};
