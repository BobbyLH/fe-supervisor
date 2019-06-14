const net = require('net')

module.exports = function checkPort (port, open) {
  const server = net.createServer().listen(port)

  server.on('listening', function () {
    server.close()
    open && open()
  })
}