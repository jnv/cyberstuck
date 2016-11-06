const {remote, ipcRenderer} = require('electron')

const logger = remote.getGlobal('logger')

;['profile', 'startTimer']
  .concat(Object.keys(logger.levels))
  .forEach(method => {
    const originalMethod = console[method]
    // XXX function () is intentional to allow rebinding of this
    console[method] = function () {
      logger[method].apply(logger, arguments)
      return originalMethod.apply(window.console, arguments)
    }
  })

// Handle console.log separately to set verbose level
const consoleLog = console.log
console.log = function () {
  logger.verbose.apply(logger, arguments)
  return consoleLog.apply(window.console, arguments)
}

// Handle exceptions through process
/*
if (logger.catchExceptions && typeof logger.catchExceptions === 'function') {
  global.process.on('uncaughtException', function (error) {
    logger.catchExceptions(JSON.stringify(error))
  })
}
*/

window.onerror = function (message, filename, lineno, colno, error) {
  logger.error(`${message} in ${filename}:${lineno}:${colno}`, {filename, lineno, colno})
  ipcRenderer.send('uncaughtException', error)
}

module.exports = logger
