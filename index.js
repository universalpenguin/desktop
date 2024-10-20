const { app, BrowserWindow, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  const createWindow = () => {
    let splashWindow = new BrowserWindow({ 
      width: 800,
      height: 320,
      frame: false,
      transparent: true,
      show: false,
      resizable: false
    });

    splashWindow.loadURL(`file://${path.join(__dirname, 'splash', 'index.html')}`);
    splashWindow.on("closed", () => (splashWindow = null));
    splashWindow.webContents.on("did-finish-load", () => {
      splashWindow.show();
    });

    const mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      autoHideMenuBar: true,
      useContentSize: true,
      show: false,
      webPreferences: {
        devTools: false,
        plugins: true
      }
    });

    // Delay showing the main window by 3 seconds
    splashWindow.webContents.on('did-finish-load', () => {
      setTimeout(() => {
        splashWindow.close();
        mainWindow.show();
      }, 4000);
    });

    // Open external links in the user's default browser
    mainWindow.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });

    // Load the URL into the main window
    mainWindow.webContents.session.clearHostResolverCache();
    mainWindow.loadURL('https://play.universalpenguin.net/');
  };

  const initializeFlashPlugin = () => {
    let pluginName;
    switch (process.platform) {
      case 'win32':
        pluginName = app.isPackaged ? 'pepflashplayer.dll' : 'win/x64/pepflashplayer.dll';
        break;
      case 'darwin':
        pluginName = 'PepperFlashPlayer.plugin';
        break;
      default:
        pluginName = 'libpepflashplayer.so';
    }

    const resourcesPath = app.isPackaged ? process.resourcesPath : __dirname;

    if (['freebsd', 'linux', 'netbsd', 'openbsd'].includes(process.platform)) {
      app.commandLine.appendSwitch('no-sandbox');
    }

    app.commandLine.appendSwitch('ppapi-flash-path', path.join(resourcesPath, 'plugins', pluginName));
    app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.465');
  };

  app.on('second-instance', () => {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  initializeFlashPlugin();

  app.whenReady().then(() => {
    createWindow();
    autoUpdater.checkForUpdates();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}