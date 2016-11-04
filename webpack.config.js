var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var TARGET_ENV = process.env.npm_lifecycle_event === 'build'
               ? 'production'
               : 'development';


var commonConfig = {

  output: {
    path:     path.resolve( __dirname, 'dist/' ),
    publicPath: '/',
    filename: 'app-[hash].js',
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions:         ['', '.js', '.elm']
  },

  module: {
    noParse: /\.elm$/,
    loaders: [
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        loader: 'file-loader'
      }
    ]
  },

  target: 'web',

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/public/index.html',
      inject:   'body',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(TARGET_ENV)
    })
  ],

  postcss: [ autoprefixer( { browsers: ['last 2 versions'] } ) ],

}

if (TARGET_ENV === 'development') {
  console.log('🔵 => DEVELOPMENT MODE');

  module.exports = merge( commonConfig, {

    entry: [
      'webpack-hot-middleware/client?reload=true',
      path.join( __dirname, 'src/public/static/index.js' )
    ],

    module: {
      loaders: [
        {
          test:    /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/, /Styles\.elm$/],
          loader:  'elm-hot!elm-webpack?verbose=true&warn=true'
        },
        {
          test: /Styles\.elm$/,
          loader: 'style!css!elm-css-webpack'
        },
        {
          test: /\.(css|scss)$/,
          loaders: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    }

  });
}

// additional webpack settings for prod env (when invoked via 'npm run build')
if ( TARGET_ENV === 'production' ) {
  console.log('🔴 => PRODUCTION MODE');

  module.exports = merge( commonConfig, {

    entry: path.join( __dirname, 'src/public/static/index.js' ),

    module: {
      loaders: [
        {
          test:    /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          loader:  'elm-webpack'
        },
        {
          test: /\.(css|scss)$/,
          loader: ExtractTextPlugin.extract( 'style-loader', [
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ])
        }
      ]
    },

    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'src/public/static/img/',
          to:   'static/img/'
        },
        {
          from: 'src/public/favicon.ico'
        },
      ]),

      new webpack.optimize.OccurenceOrderPlugin(),

      // extract CSS into a separate file
      new ExtractTextPlugin( './[hash].css', { allChunks: true } ),

      // minify & mangle JS/CSS
      new webpack.optimize.UglifyJsPlugin({
        minimize:   true,
        compressor: { warnings: false }
        // mangle:  true
      })
    ]

  });
}
