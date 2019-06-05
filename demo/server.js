const http = require('http')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const server = http.createServer((req, res) => {
  const url = req.url
  const isJS = url === '/dist/fronted-monitor.js'
  const filePath = path.join(__dirname, isJS ? '../' : './', url)
  console.log('filePath', filePath, url)
  if (url === '/') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    fs.createReadStream(path.join(filePath, 'index.html')).pipe(res)
  } else {
    fs.stat(filePath, (err, stats) => {
      if (err || !stats) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html')
        res.end(`${filePath} not exist`)
      } else {
        if (stats.isFile()) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          fs.createReadStream(filePath).pipe(res)
        } else if (stats.isDirectory()) {
          fs.readdir(filePath, (err, files) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.end(files.join(','))
          })
        }
      }
    })
  }
})

server.listen('3401', 'localhost', () => {
  console.info(`Server started at ${chalk.green('http://localhost:3401')}`)
})