const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  publicPath: '/',
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ],
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()]
  }
}
