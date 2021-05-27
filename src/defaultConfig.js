module.exports = {
  root: process.cwd(),
  hotname: '127.0.0.1',
  port: 9527,
  compress: /\.(js|html|json|md)/,
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    eTag: true
  }
}