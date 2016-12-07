const run = require('runjs').run
const pkg = require('./package.json')

const electronVersion = pkg.engines.electron

const task = {
  clean: () => {
    run('rimraf dist/ .cache')
  },
  build: () => {
    process.env.NODE_ENV = 'production'
    run(`electron-packager-compile . cyberstuck --version=${electronVersion} --platform=linux --arch=x64 --out=./dist --overwrite --prune --asar`)
  },
}

module.exports = task
