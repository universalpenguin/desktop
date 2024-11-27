const { app, BrowserWindow, Menu, shell } = require('electron');
const createMenu = require('./utils/menu');
const loadFlashPlugin = require('./utils/flash');
const initRichPresence = require('./utils/discord');
const { checkForUpdates } = require('./utils/updater');
const path = require('path');
if (process.platform === "linux") app.commandLine.appendSwitch("no-sandbox");
loadFlashPlugin(app);

let mainWindow;
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  const createWindow = async () => {
    let splashWindow = new BrowserWindow({
      width: 800,
      height: 320,
      frame: false,
      transparent: true,
      resizable: false,
      webPreferences: { contextIsolation: true }
    });

    splashWindow.loadURL(`file://${path.join(__dirname, 'splash/index.html')}`);
    splashWindow.on("closed", () => (splashWindow = null));
    splashWindow.webContents.on("did-finish-load", () => {
      splashWindow.show();
      initRichPresence();
      setTimeout(() => {
        splashWindow.close();
        mainWindow.show();
      }, 4000);
    });

    mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      show: false,
      webPreferences: {
        plugins: true,
        contextIsolation: true,
      }
    });

    Menu.setApplicationMenu(createMenu(mainWindow));
    mainWindow.loadURL('https://play.universalpenguin.net/');
    mainWindow.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
  };

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.whenReady().then(() => {
    createWindow();
    checkForUpdates();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}