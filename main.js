const { app, BrowserWindow } = require("electron");
const spawn = require("child_process").spawn;
const path = require("path");

let mainWindow;

// Exit if we don't have the required ENVIORNMENT variables.
if (!process.env.BASE_URL) {
  console.log("Please set BASE_URL environment variable");
  process.exit(1)
}
if (!process.env.SECRET_KEY) {
  console.log("Please set SECRET_KEY environment variable");
  process.exit(1)
}
if (!process.env.ACCESS_KEY) {
  console.log("Please set ACCESS_KEY environment variable");
  process.exit(1)
}

// Disable CORS for development mode.
if (isDev()) {
  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
}

function isDev() {
  return process.env['NODE_ENV'] === "development";
}

function createWindow() {
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1800,
    height: 1400,
    webPreferences: {
      webSecurity: !isDev(),
      nodeIntegration: true,
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:4200");
  } else {
    mainWindow.loadFile("dist/angular-playground/index.html");
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function spawnServer() {
  let directory = isDev() ? __dirname : process.resourcesPath;

  spawn(path.join(directory, "backend/main"));
}

app.on("ready", () => {
  createWindow();
  spawnServer();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
