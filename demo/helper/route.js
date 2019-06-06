const fs = require('fs')
const chalk = require('chalk')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      fs.createReadStream(filePath).pipe(res)
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.end(files.join(','))
    }
  } catch (err) {
    console.warn('err msg is:', chalk(err.toString()))
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/html')
    res.end(`${filePath} not exist /n ${err}`)
  }
}