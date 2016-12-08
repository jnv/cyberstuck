const run = require('runjs').run
const pkg = require('./package.json')

const electronVersion = pkg.engines.electron
const buildDir = 'dist/cyberstuck-linux-x64'

function gitRef () {
  // Workaround for https://github.com/pawelgalazka/runjs/issues/36
  return run('git rev-parse HEAD', {stdio: 'pipe'}).toString().trim()
}

const task = {
  clean: () => {
    run('rimraf dist/ .cache')
  },
  build: () => {
    process.env.NODE_ENV = 'production'
    run(`electron-packager-compile . cyberstuck --version=${electronVersion} --platform=linux --arch=x64 --out=./dist --overwrite --prune --asar`)
    run(`git rev-parse HEAD > ${buildDir}/ref`)
    console.log(`git rev-parse HEAD`)
  },
  deploy: () => {
    const start = new Date().toISOString()
    const deployDir = process.env.DEPLOY_DIR
    if (!deployDir) {
      throw new Error('Please, set DEPLOY_DIR environment variable to move the build into')
    }
    task.build()
    run(`rsync -av ${buildDir}/ ${deployDir}/`)
    if (process.env.SENTRY_DEPLOY_HOOK) {
      const url = process.env.SENTRY_DEPLOY_HOOK
      const ref = gitRef()
      const payload = {version: ref, ref: ref, dateStarted: start, dateReleased: new Date().toISOString()}
      run(`curl ${url} -X POST -H 'Content-Type: application/json' -d '${JSON.stringify(payload)}'`)
    } else {
      console.warn('SENTRY_DEPLOY_HOOK not set, skipping release notification')
    }
  },
}

module.exports = task
