const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

const IS_DEV = process.env.NODE_ENV === "development";
const SERVER_DIR = IS_DEV ? __dirname : process.resourcesPath;
const LOAD_PATH = IS_DEV ? "http://localhost:4200" : "dist/angular-playground/index.html";

/** Emits when Electron is initializing. */
app.on("will-finish-launching", () => {

  /** Exit if required environment variables not present. */
  ["BASE_URL", "SECRET_KEY", "ACCESS_KEY"].forEach(checkEnvVariablePresent);

  /** Disable CORS for development mode during startup. */
  if (IS_DEV) disableCors();
});

/** Create Window when Electron has finished initializing. */
app.on("ready", () => {
  createWindow();
});

/** Quit when all windows have been closed. */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/**
 * Creates and returns a new BrowserWindow instance.
 * @property {integer} x - Window x position.
 * @property {integer} y - Window y position.
 * @property {integer} width - Window width.
 * @property {integer} height - Window height.
 * @property {boolean} webPreferences.nodeIntegration - Crucial for security.
 * @property {boolean} webPreferences.webSecurity - Crucial for security.
 * @property {boolean} webPreferences.enableRemoteModule - Crucial for security.
 * @property {function} webPreferences.preload - Runs preload script.
 *
 * @returns {BrowserWindow}
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1800,
    height: 1400,
    webPreferences: {
      webSecurity: !IS_DEV,
      nodeIntegration: false,
      enableRemoteModule: false,
      preload: path.resolve(SERVER_DIR, "preload.js")
    },
  });

  mainWindow.loadURL(LOAD_PATH);
}

/** Disables CORS. */
function disableCors () {
  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
}

/**
 * Checks presence of environment variable.
 * Exits if not present.
 *
 * @param {string} key - Environment variable name.
 */
function checkEnvVariablePresent(key) {
  if (!process.env[key]) {
    console.log(`${key} environment variable is not set`);
    process.exit(1)
  }
}
