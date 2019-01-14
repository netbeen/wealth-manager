const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const _ = require('lodash');

const cwd = process.cwd();

// 处理入口文件
const entry = {};
const pagePath = path.join(__dirname, 'src/pages');
const rootChildren = fs.readdirSync(pagePath).filter(me => me !== 'components' && me !== 'utils');

/**
 * 递归生成 entry
 * @param {*} currentPath 当前路径
 * @param {*} childDirs   当前路径下的所有子目录
 */
function addEntryInPath(currentPath, childDirs) {
  childDirs.forEach((name) => {
    const handlingChild = path.join(currentPath, name);
    const stat = fs.lstatSync(handlingChild);
    // 以目录有没有 index.jsx 来判断是不是需要加到 entry 里
    const idxPath = path.join(handlingChild, 'index.jsx');
    const hasIndex = fs.existsSync(idxPath);
    if (hasIndex) {
      const relativePath = path.relative(pagePath, handlingChild);
      // webpack 的 entry 都是用 / 分隔的，使用 windows 的分隔符反而有问题
      const entryKey = relativePath.replace(new RegExp(_.escapeRegExp(path.sep), 'g'), '/');
      entry[entryKey] = idxPath;
    } else if (stat.isDirectory()) {
      addEntryInPath(handlingChild, fs.readdirSync(handlingChild));
    }
  });
}

addEntryInPath(pagePath, rootChildren);

module.exports = function (env) {
  const config = {
    context: cwd,
    entry,
    output: {
      path: path.resolve(__dirname, '../app/public/aiscAssets/build'),
      publicPath: 'build',
      filename: '[name].js',
      chunkFilename: '[chunkhash].js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        components: path.join(__dirname, 'src/components'),
        utils: path.join(__dirname, 'src/utils'),
        images: path.join(__dirname, 'src/images'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.[s]?css$/,
          loader: ExtractTextPlugin.extract({
            use: ['css-loader', 'sass-loader'],
          }),
        },
        {
          test: /\.(png|jpg|svg|gif)$/,
          loader: 'url-loader?limit=25000',
        },
        {
          test: /\.(html|tpl)$/,
          loader: 'html-loader',
        },
      ],
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-redux': 'ReactRedux',
      'redux-thunk': 'var window.ReduxThunk.default',
      redux: 'Redux',
      '@alife/aisc': 'var Aisc',
      '@alife/aisc-p2charts': 'var AiscP2charts',
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].bundle.css',
        allChunks: true,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        // minChunks: 3
        minChunks: (module, count) => {
          // This prevents stylesheet resources with the .css or .scss extension
          // from being moved from their original chunk to the vendor chunk
          if (module.resource && /^.*\.(css|scss)$/.test(module.resource)) {
            return false;
          }
          return count >= 3;
        },
      }),
      // 进度插件
      new webpack.ProgressPlugin((percentage, msg) => {
        const stream = process.stderr;
        /* eslint-disable */
        if (stream.isTTY && percentage < 0.71) {
          stream.cursorTo(0);
          stream.write(`🐸 building...   ${~~(percentage * 100)}%`);
          stream.clearLine(1);
        } else {
          stream.cursorTo(0);
          stream.write(`🐸 ${msg}   ${~~(percentage * 100)}%`);
          stream.clearLine(1);
        }
        /* eslint-enable */
      }),
      new BrowserSyncPlugin({
        host: '127.0.0.1',
        port: 9001,
        proxy: 'http://127.0.0.1:9000/',
      }),
    ],
  };

  if (env.production) {
    config.plugins.push(
      new UglifyJsPlugin({
        sourceMap: true,
        minimize: true,
        compress: {
          unused: true,
          warnings: true,
        },
        // beautify: true // 控制是否压缩
      })
    );
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
        __DEV__: JSON.stringify('false'),
      })
    );
  } else {
    config.devServer = {
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
    config.plugins.push(new webpack.SourceMapDevToolPlugin({}));
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
        },
        __DEV__: JSON.stringify('true'),
      })
    );
    config.plugins.push(
      new WebpackNotifierPlugin({
        title: 'AISC building...',
        // contentImage: path.join(__dirname, 'img', 'aisued.png'),
        alwaysNotify: true,
        excludeWarning: true,
      })
    );
  }
  return config;
};
