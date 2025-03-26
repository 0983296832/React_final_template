const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      // Cấu hình alias cho webpack
      // để khi import cho ngắn gọn
      // Ví dụ: import Login from '@pages/Login'
      // Thay vì: import Login from '../pages/Login' chẳng hạn
      '@src': path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('tailwindcss'), require('autoprefixer')]
              }
            }
          }
        ]
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'dist/assets/[hash][ext][query]'
        }
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/i,
        type: 'asset/inline'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, '..', './build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './src/index.html'),
      filename: 'index.html'
    }),
    new Dotenv()
  ],
  cache: {
    type: 'filesystem', // Lưu cache trên ổ đĩa để build nhanh hơn
    cacheDirectory: path.resolve(__dirname, '.webpack_cache'), // Thư mục lưu cache
    compression: 'gzip', // Nén cache để giảm dung lượng
    maxAge: 24 * 60 * 60 * 1000 // Thời gian cache tồn tại (1 ngày)
  },
  stats: 'errors-only'
};
