// const server = require('./server/server');

module.exports = {
  configureWebpack: {
    mode: 'development',
    devtool: 'inline-source-map',
  },
  devServer: {
    // before: server,
    disableHostCheck: true,
    clientLogLevel: 'info',
    host: '0.0.0.0',
    port: 8080,
    hot: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
  },
  chainWebpack: config => config.optimization.minimize(false)
};
