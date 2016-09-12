#!/usr/bin/env node
'use strict'

const path = require('path')

const spawn = require('child_process').spawn
const pkgdir = path.resolve(__dirname, '../')
const pkginfo = require(path.join(pkgdir, 'package.json'))

const cmd = 'node_modules/.bin/electron-packager-compile'

function getArgs () {
  const args = ['.']
  args.push(`--version=${pkginfo.engines.electron}`)
  const arch = 'x64'
  const platform = 'linux'

  args.push(`--platform=${platform}`)
  args.push(`--arch=${arch}`)
  args.push('--out=./dist')
  args.push('--asar')
  args.push('--overwrite')
  args.push('--prune')
  args.push('--ignore=/tasks(/|$)')
  args.push('--ignore=/arduino-driver')
  args.push('--ignore=^/\\.')

  return args
}

const args = getArgs()

const env = Object.assign({}, process.env)
env.NODE_ENV = 'production'

const spawnOpts = {
  shell: true,
  cwd: pkgdir,
  env,
}

const packager = spawn(cmd, args, spawnOpts)

packager.stdout.on('data', (data) => {
  console.log(data)
})

packager.stderr.on('data', (data) => {
  console.log(data)
})

packager.on('close', (code) => {
  console.log(`exited with code ${code}`)
})
