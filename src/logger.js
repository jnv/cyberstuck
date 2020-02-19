const {ipcRenderer} = require('electron')

function objValues(obj) {
  return Object.keys(obj).map((key) => obj[key])
}

function ipcLog(method, args) {
  ipcRenderer.send('log', {method, args: objValues(args)})
}

const logger = {}

const consoleLog = console.log
;['profile', 'startTimer', 'verbose', 'info', 'warn', 'error'].forEach(
  (method) => {
    const originalMethod = console[method]
    // XXX function () is intentional to allow rebinding of this
    console[method] = function() {
      ipcLog(method, arguments)
      if (originalMethod) {
        return originalMethod.apply(window.console, arguments)
      } else {
        return consoleLog.apply(window.console, arguments)
      }
    }
    logger[method] = console[method]
  }
)

// Handle console.log separately to set verbose level
console.log = function() {
  ipcLog('verbose', arguments)
  return consoleLog.apply(window.console, arguments)
}

window.onerror = function(message, filename, lineno, colno, error) {
  ipcRenderer.send('uncaughtException', {
    message,
    filename,
    lineno,
    colno,
    error,
  })
}

logger.log = ipcLog
module.exports = logger
