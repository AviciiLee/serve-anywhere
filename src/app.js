const http = require('http')
const path = require('path')
const colors = require('colors')

const defaultConfig = require('./config/defaultConfig')
const router = require('./helper/router')
const openUrl = require('./helper/openUrl')

class Server {

  constructor(config) {
    this.conf = Object.assign(defaultConfig, config)
  }

  start() {
    const server = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
      const filePath = path.join(this.conf.root, req.url)
      router(req, res, filePath, this.conf)
    })

    server.listen(this.conf.port, 'localhost',() => {
      const addr = `http://${this.conf.hotname}:${this.conf.port}`
      console.log(colors.green(`server started at ${addr}`));
      openUrl(addr)
    })
  }
}

module.exports = Server