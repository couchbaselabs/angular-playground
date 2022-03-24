const { app, BrowserWindow } = require("electron");
const spawn = require("child_process").spawn;
const path = require("path");

let mainWindow;

function createWindow(screen) {
  const INDEX_PATH = "dist/angular-playground/index.html";

  mainWindow = new BrowserWindow({
    width: screen.width || 1800,
    height: screen.height || 1600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, INDEX_PATH));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function spawnServer() {
  let { env, resourcesPath } = process;
  let directory = env.NODE_ENV === "development" ? __dirname : resourcesPath;

  spawn(path.join(directory, "backend/main"));
}

app.on("ready", () => {
  // Cannot require screen until the app is ready.
  const { screen } = require("electron");

  createWindow(screen);
  spawnServer();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
