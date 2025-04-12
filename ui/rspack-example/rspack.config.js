const { rspack } = require('@rspack/core');
const ReactRefreshPlugin = require('@my-react/react-rspack');

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('@rspack/cli').Configuration} */
const config = {
  entry: { main: './src/index.tsx' },
  devtool: 'source-map',
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
  },
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            sourceMap: true,
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: !isProduction,
                  refresh: !isProduction,
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: './index.html' }),
    !isProduction && new ReactRefreshPlugin(),
  ].filter(Boolean),
};

module.exports = config;