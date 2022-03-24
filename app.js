const {app, BrowserWindow} = require('electron');
const spawn = require('child_process').spawn;
const path = require("path");

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'dist/angular-playground/index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

// TODO: Investigate how to start external script
// via IpcMain.
spawn('./backend/main');
