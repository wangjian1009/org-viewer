module.exports = {
  devServer: {
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
