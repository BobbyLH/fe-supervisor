const fs = require('fs')
const pkg = fs.readFileSync('./package.json', 'utf-8')
const { argv } = process
const versionRegExp = /^\d+\.\d+\.\d+$/
const normalRegExp = /version.*(\d+).(\d+).(\d+)/
const betaRegExp = /version.*(\d+).(\d+).(\d+)\-(beta).(\d+)/
const isBeta = argv[2] === 'beta'
const match = pkg.match(betaRegExp)
const argvV = isBeta ? argv[3] : argv[2]
const manualV = versionRegExp.test(argvV) && argvV

let version = ''
if (isBeta) {
  if (match) {
    version = `version": "${manualV || `${match[1]}.${match[2]}.${match[3]}-beta.${+match[5] + 1}`}",`
  } else {
    const match = pkg.match(normalRegExp)
    if (match[2] >= 999 && match[3] >= 999) {
      match[1] = parseInt(match[1]) + 1
      match[2] = 0
      match[3] = 0
    } else {
      if (match[3] >= 999) {
        match[2] = parseInt(match[2]) + 1
        match[3] = 0
      } else {
        match[3] = parseInt(match[3]) + 1
      }
    }
    version = `version": "${match[1]}.${match[2]}.${match[3]}-beta.${manualV || 0}",`
  }
} else {
  if (match) {
    version = `version": "${manualV || `${match[1]}.${match[2]}.${match[3]}`}",`
  } else {
    if (manualV) {
      version = `version": "${manualV}",`
    } else {
      const match = pkg.match(normalRegExp)
      if (match[2] >= 999 && match[3] >= 999) {
        match[1] = parseInt(match[1]) + 1
        match[2] = 0
        match[3] = 0
      } else {
        if (match[3] >= 999) {
          match[2] = parseInt(match[2]) + 1
          match[3] = 0
        } else {
          match[3] = parseInt(match[3]) + 1
        }
      }
      version = `version": "${match[1]}.${match[2]}.${match[3]}",`
    }
  }
}

fs.writeFileSync('./package.json', pkg.replace(/version.*,/, version))
