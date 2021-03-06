const fs = require('fs/promises')
const { createReadStream, readFileSync } = require('fs')
const path = require('path')

const HandleBars = require('handlebars')
const mime = require('mime')
const compress = require('../helper/compress')
const range = require('./range')
const isFresh = require('./cache')

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = readFileSync(tplPath)
const template = HandleBars.compile(source.toString())

module.exports = async function(req, res, filePath, config) {
  try {
    const stats = await fs.stat(filePath)
    if(stats.isFile()) {           
      const mimeType = mime.getType(path.extname(filePath))
      res.setHeader('Content-Type', `${mimeType ?? 'text/plain'};charset=utf-8`)
      if(isFresh(stats, req, res)) {
        res.statusCode = 304
        res.end()
        return
      }
      const { code, start, end } = range(stats.size, req, res)
      res.statusCode = code
      let rs
      if(code === 200) {
        rs = createReadStream(filePath)
      }  else {
        rs = createReadStream(filePath, {
          start,
          end
        })
      }
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