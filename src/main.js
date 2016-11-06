'use strict'
// MAIN ELECTRON PROCESS
const electron = require('electron')
const isDev = require('electron-is-dev')
const winston = require('winston')
const Sentry = require('@jnv/winston-sentry')
const {ipcMain} = electron

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: isDev ? 'debug' : 'info',
      colorize: isDev,
      timestamp: true,
      prettyPrint: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
    new Sentry({
      handleExceptions: true,
      level: 'warn',
      dsn: 'https://28829654f05d42bc8e9f7eaa13422c66:59003a59be9d457d881ba138d7824b14@sentry.io/112410',
      silent: isDev,
    }),
  ],
})
global.logger = logger
ipcMain.on('log', (event, {method, args}) => {
  if (!logger[method]) {
    logger.error(`Invalid logger method called: ${method}`, args)
    return
  }
  logger[method].apply(logger, args)
})

ipcMain.on('uncaughtException', (event, arg) => {
  logger.error(arg.error || arg.message, arg)
})

// Attempt to reduce memory usage
app.commandLine.appendSwitch('max_old_space_size', '1024')

require('electron-debug')({showDevTools: true})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  const winOptions = {
    minWidth: 480,
    minHeight: 640,
    width: 480,
    height: 640,
    useContentSize: true,
    backgroundColor: '#000000',
    // acceptFirstMouse: true,
    kiosk: !isDev,
  }
  mainWindow = new BrowserWindow(winOptions)
  mainWindow.setMenu(null)
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
