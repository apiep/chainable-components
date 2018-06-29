import * as webpack from 'webpack';
import config from './base';
import { CONSTANTS } from './constants';
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseEntry = config.entry as webpack.Entry;
const entry = [
    // activate HMR for React
    'react-hot-loader/patch',

    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack-dev-server/client?http://localhost:' + CONSTANTS.DEV_SERVER_PORT,

    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    'webpack/hot/only-dev-server',
    baseEntry,
  ];

const rules = (config.module as any).rules.map((loaderConf: any) => {
  if (loaderConf.test.test('test.ts')) {
    return {
      ...loaderConf,
      use: [{
        loader: 'react-hot-loader/webpack',
      },
        ...loaderConf.use,
      ],
    };
  } else {
    return loaderConf;
  }
});
const module = {
  ...config.module,
  rules,
};

const plugins = [
  ...(config.plugins || []),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': 'null',
  }),
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    title: '🔗-able Components'
  })
];

const hotConfig = {
  ...config,
  entry,
  module,
  plugins,
  devtool: '#cheap-module-source-map',
  mode: 'development',
  devServer: {
    contentBase: CONSTANTS.BUILD_DIR,
    historyApiFallback: true,
    hot: true,
    stats: 'minimal',
    port: CONSTANTS.DEV_SERVER_PORT,
    open: true,
  },
};

export default hotConfig;
