const path = require("path");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const autoprefixer = require("autoprefixer");

module.exports = (env, argv) => {
  const devMode = argv.mode !== "production";
  let config = {
    entry: {
      main: path.resolve(__dirname, "./src/assets/scripts/main.js")
    },
    output: {
      path: path.resolve(__dirname, "dist/"),
      publicPath: "/",
      filename: devMode? "js/[name].js" : "js/[name].min.js?[contenthash]"
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
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
            }
          ]
        },
        {
          test: /\.scss$/,
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
            },
            {
              loader: "sass-resources-loader",
              options: {
                sourceMap: true,
                resources: [
                  path.resolve(__dirname, "./src/assets/styles/variables.scss")
                ]
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
          test: /\.vue$/,
          loader: "vue-loader"
        },
        {
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/
        },
        {
          test: /\.pug$/,
          oneOf: [
            {
              resourceQuery: /^\?vue/,
              use: ["pug-plain-loader"]
            },
            {
              use: [{
                loader: "pug-loader",
                options: {
                  pretty: devMode
                }
              }]
            }
          ]
        },
        {
          test: /\.(png|jpeg|jpg|gif|svg)$/,
          exclude: [
            path.resolve(__dirname, "./src/assets/icons/"),
            /node_modules.*\.svg$/
          ],
          loader: "file-loader",
          options: {
            outputPath(url) {
              url = url.split("/");
              url.splice(0, 3).join("/");
              url = url.join("/");
              return "img/" + url;
            },
            name: "[path][name].[ext]?[hash]"
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
                extract: true,
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
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js"
      },
      extensions: ["*", ".js", ".vue", ".json"]
    },
    devtool: devMode ? "#eval-source-map" : "",
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false
            }
          }
        })
      ]
    },
    devServer: {
      contentBase: "./dist",
      host: "0.0.0.0",
      port: 3000,
      watchContentBase: true,
      historyApiFallback: true,
      noInfo: true,
      hot: true,
      open: true
    },
    plugins: [
      new SpriteLoaderPlugin({
        plainSprite: true
      }),
      new VueLoaderPlugin(),
      new CopyWebpackPlugin([
        {from: "./sitemap.xml", to: ""},
        {from: "./robots.txt", to: ""},
        {from: "./favicon.ico", to: ""}
      ]),
      new MiniCssExtractPlugin({
        filename: "css/[name].css?[contenthash]"
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css/g,
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ["default", {discardComments: {removeAll: true}}],
        },
        canPrint: true
      }),
      new HtmlWebpackPlugin({
        filename: path.join(__dirname, "dist", "index.html"),
        template: path.resolve(__dirname, "./src/template/layouts", "_template.html"),
        chunks: ["main"],
        title: "My App",
        description: "My App",
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
      new CleanWebpackPlugin("dist"),
      new FaviconsWebpackPlugin({
        logo: "./src/assets/images/favicon.png",
        prefix: "/icons-favicon/",
        title: "My App",
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: false,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: true
        }
      }),
      new ImageminPlugin({
        svgo: {
          removeViewBox: true
        }
      })
    );
  }
  return config;
};
