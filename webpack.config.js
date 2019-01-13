const path = require("path");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ImageminPlugin = require("imagemin-webpack");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");
const imageminSvgo = require("imagemin-svgo");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    main: path.resolve(__dirname, "src/assets/scripts/main.js")
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "js/[name].min.js?[hash]"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        },
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {}
        }
      },
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        exclude: [
          /src\/assets\/icons\/.+\.svg$/,
          /\/dist\/img\/sprite.svg$/,
        ],
        loader: "file-loader",
        options: {
          publicPath: '/',
          name: "img/[name].[ext]?[hash]"
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: [
          /src\/assets\/icons\/.+\.svg$/,
          /src\/assets\/img\/.+\.svg$/,
          /\/dist\/img\/sprite.svg$/,
        ],
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: '/fonts/'
          }
        }]
      },
      {
        test: /src\/assets\/icons\/.*\.svg$/,
        use: [
          {
            loader: "svg-sprite-loader",
            options: {
              extract: true,
              spriteFilename: "./img/sprite.svg",
              runtimeCompat: true,
            }
          },
          {
            loader: "svgo-loader",
            options: {
              plugins: [
                {removeNonInheritableGroupAttrs: true},
                {collapseGroups: true},
                {removeAttrs: {attrs: "(fill|stroke)"}},
              ]
            }
          }
        ]
      }
    ]
  },
  performance: {
    hints: false
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js"
    },
    extensions: ["*", ".js", ".vue", ".json"]
  },
  devtool: devMode ? "#source-map" : "",
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
  plugins: [
    new BrowserSyncPlugin({
      open: false,
      host: "localhost",
      port: 3000,
      server: {baseDir: ["dist"]}
    }),
    new SpriteLoaderPlugin({
      plainSprite: true
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin("dist"),
    new CopyWebpackPlugin([
      {from: "./manifest.json", to: ""}
    ]),
    new ExtractTextPlugin("css/[name].min.css?[hash]"),
    new ImageminPlugin({
      bail: false,
      cache: true,
      name: "./img/[name].[ext]",
      imageminOptions: {
        plugins: [
          imageminGifsicle({
            interlaced: true
          }),
          imageminJpegtran({
            progressive: true
          }),
          imageminOptipng({
            optimizationLevel: 5
          }),
          imageminSvgo({
            removeViewBox: true
          })
        ]
      }
    }),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, "dist", "index.html"),
      template: path.resolve(__dirname, "src/template/layouts", "index.html"),
      chunks: ["main"],
      title: "Test page",
      inject: false,
      hash: true,
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   conservativeCollapse: true
      // }
    })
  ]
};
