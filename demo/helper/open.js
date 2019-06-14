 const { exec } = require('child_process')

 module.exports = url => {
   switch(process.platform) {
    case 'darwin':
      exec(`open ${url}`)
      break
    case 'win32':
      exec(`start ${url}`)
      break
    case 'linux':
      exec(`xdg-open ${url}`)
      break
   }
 }