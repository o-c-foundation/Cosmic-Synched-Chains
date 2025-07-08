/**
 * Webpack configuration for Cosmos Deploy Platform frontend
 * Fixes deprecation warnings and optimizes build
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isProduction ? 'js/[name].[contenthash:8].js' : 'js/bundle.js',
      publicPath: '/'
    },
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 3000,
      hot: true,
      historyApiFallback: true,
      // Using setupMiddlewares instead of deprecated onBeforeSetupMiddleware and onAfterSetupMiddleware
      setupMiddlewares: (middlewares, devServer) => {
        // Add custom middleware before all other middlewares
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        // You can add your middleware logic here if needed
        // e.g. devServer.app.use('/api', (req, res) => {...})

        return middlewares;
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash:8][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico'
      }),
      ...(isProduction ? [new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
      })] : [])
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    },
    performance: {
      hints: isProduction ? 'warning' : false
    }
  };
};
