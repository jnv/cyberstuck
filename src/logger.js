const {ipcRenderer} = require('electron')

function ipcLog (method, args) {
  const argsArr = Object.keys(args).map(key => args[key])
  ipcRenderer.send('log', {method, args: argsArr})
}

const logger = {}

;['profile', 'startTimer', 'verbose', 'info', 'warn', 'error']
  .forEach(method => {
    const originalMethod = console[method]
    // XXX function () is intentional to allow rebinding of this
    console[method] = function () {
      ipcLog(method, arguments)
      return originalMethod.apply(window.console, arguments)
    }
    logger[method] = console[method]
  })

// Handle console.log separately to set verbose level
const consoleLog = console.log
console.log = function () {
  ipcLog('verbose', arguments)
  return consoleLog.apply(window.console, arguments)
}

window.onerror = function (message, filename, lineno, colno, error) {
  ipcRenderer.send('uncaughtException', {message, filename, lineno, colno, error})
}

logger.log = ipcLog
module.exports = logger
