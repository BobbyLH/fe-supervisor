const http = require('http')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const route = require('./helper/route')
const open = require('./helper/open')
const net = require('./helper/net')

const server = http.createServer((req, res) => {
  const url = req.url
  const isJS = url === '/dist/fe-supervisor.sdk.js'
  const filePath = path.join(__dirname, isJS ? '../' : './', url)

  if (url === '/') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    fs.createReadStream(path.join(filePath, 'index.html')).pipe(res)
  } else {
    route(req, res, filePath)
  }
})

const port = 3401
server.listen(port, 'localhost', () => {
  const addr = `http://localhost:${port}`
  console.info(`Server started at ${chalk.green(addr)}`)
  net(port, () => open(addr))
})