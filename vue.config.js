module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/gitlab': {
        target: 'http://gitlab.adups.com/',
        secure: false,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/gitlab': ''
        }
      }
    }
  }
}
