const {app, BrowserWindow} = require('electron')
const url = require("url");
const path = require("path");


let mainWindow


// TODO: live reload
// const env = process.env.NODE_ENV || 'development';
//
// If development environment
// if (env === 'development') {
//   require('electron-reload')(__dirname, {
//     electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
//     hardResetMethod: 'exit'
//   });
// }


function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/angular-playground/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  mainWindow.webContents.on('did-fail-load', () => {
    console.log('did-fail-load');
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/angular-playground/index.html'),
      protocol: 'file:',
      slashes: true
    }));
// REDIRECT TO FIRST WEBPAGE AGAIN
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

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
