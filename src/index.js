const http = require('http')
const path = require('path')
const colors = require('colors')

const config = require('./defaultConfig')
const router = require('./helper/router')



const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
  const filePath = path.join(config.root, req.url)
  router(req, res, filePath)
})

server.listen(config.port, 'localhost',() => {
  const addr = `http://${config.hotname}:${config.port}`
  console.log(colors.green(`server started at ${addr}`));
})