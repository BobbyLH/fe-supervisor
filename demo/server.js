const http = require('http')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const route = require('./helper/route')

const server = http.createServer((req, res) => {
  const url = req.url
  const isJS = url === '/dist/fe-supervisor.min.js'
  const filePath = path.join(__dirname, isJS ? '../' : './', url)

  if (url === '/') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    fs.createReadStream(path.join(filePath, 'index.html')).pipe(res)
  } else {
    route(req, res, filePath)
  }
})

server.listen('3401', 'localhost', () => {
  console.info(`Server started at ${chalk.green('http://localhost:3401')}`)
})