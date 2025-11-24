const webpack = require('webpack');

module.exports = function override(config, env) {
  // Disable fullySpecified for all modules to handle ESM imports
  config.resolve.fullySpecified = false;

  // Add fallback for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve('process/browser.js'),
    buffer: require.resolve('buffer/'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert/'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: false,
    url: require.resolve('url/'),
    zlib: require.resolve('browserify-zlib'),
    path: require.resolve('path-browserify'),
    util: require.resolve('util/')
  };

  // Add support for .mjs files from node_modules
  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
    resolve: {
      fullySpecified: false
    }
  });

  // Provide process and Buffer as globals
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer']
    })
  );

  return config;
};
