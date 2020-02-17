module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/gitlab': {
        target: 'http://gitlab.adups.com/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/gitlab': ''
        }
      }
    }
  }
}
