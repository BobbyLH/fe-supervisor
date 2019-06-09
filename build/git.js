const fs = require('fs')
const chalk = require('chalk')
const pkg = fs.readFileSync('./package.json', 'utf-8')
const version = pkg.match(/"version.*,/)

async function autoGit () {
  const simpleGit = require('simple-git/promise')
  const git = simpleGit(__dirname)
  const { current } = await git.branch()
  const branch = (process.argv && process.argv[2]) || current
  const message = version
  let gitStatus = null
  try {
    gitStatus = await git.add('../*')
    gitStatus = await git.commit(`[FE - SUPERVISOR]: ${message}`)
    gitStatus = await git.push('origin', branch)
    console.log(`[git - status]: ${chalk.green(gitStatus || 'success')}`)
  } catch (e) {
    // handle the error
    console.log(`[git - error]: ${chalk.red(e)}`)
    return true
  }
  return true
}

autoGit()
