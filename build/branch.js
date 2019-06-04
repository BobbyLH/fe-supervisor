const simpleGit = require('simple-git/promise')
const shell = require('shelljs')
const chalk = require('chalk')
const git = simpleGit(__dirname)

async function checkBranch () {
  const { current } = await git.branch()
  const branch = (process.argv && process.argv[2]) || current
  if (current !== 'master' && branch === current) {
    shell.echo(`[BUILD ERROR - BRANCH]: The current branch is ${chalk.red(current)}, unspecific branch parameter so please checkout to ${chalk.green('master')} branch to build`)
    shell.exit(1)
    return false
  }
  return true
}

checkBranch()
