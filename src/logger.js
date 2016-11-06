const {remote, ipcRenderer} = require('electron')

const logger = remote.getGlobal('logger')

function ipcLog (method, ...args) {
  ipcRenderer.send('log', {method, args})
}

;['profile', 'startTimer', 'verbose', 'info', 'warn', 'error']
  .forEach(method => {
    const originalMethod = console[method]
    // XXX function () is intentional to allow rebinding of this
    console[method] = function () {
      ipcLog(method, arguments)
      return originalMethod.apply(window.console, arguments)
    }
  })

// Handle console.log separately to set verbose level
const consoleLog = console.log
console.log = function () {
  ipcLog('verbose', ...arguments)
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
  // logger.error(`${message} in ${filename}:${lineno}:${colno}`, {filename, lineno, colno})
  ipcRenderer.send('uncaughtException', {message, filename, lineno, colno, error})
}

module.exports = logger
