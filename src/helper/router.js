const fs = require('fs/promises')
const { createReadStream, readFileSync } = require('fs')
const path = require('path')

const HandleBars = require('handlebars')
const mime = require('mime')
const config = require('../defaultConfig')
const compress = require('../helper/compress')

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = readFileSync(tplPath)
const template = HandleBars.compile(source.toString())

module.exports = async function(req, res, filePath) {
  try {
    const stats = await fs.stat(filePath)
    if(stats.isFile()) {
      const mimeType = mime.getType(path.extname(filePath))
      res.statusCode = 200
      res.setHeader('Content-Type', `${mimeType ?? 'text/plain'};charset=utf-8`)
      let rs = createReadStream(filePath)
      if(filePath.match(config.compress)) {
        rs = compress(rs, req, res)
      }
      rs.pipe(res)
    } 
    if(stats.isDirectory()) {
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      let files = await fs.readdir(filePath)
      const dir = path.relative(config.root, filePath)
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : '',
        files
      }
      res.end(template(data))
    }
  } catch (error) {
    console.log(error)
    res.statusCode = 404
    res.end('目录不存在')
  }
}