const { Menu, MenuItem } = require('electron');

module.exports = function createMenu(mainWindow) {
  const menuItems = [
    {
      label: 'Pantalla completa',
      accelerator: 'CmdOrCtrl+F',
      click: () => {
        const isFullScreen = mainWindow.isFullScreen();
        mainWindow.setFullScreen(!isFullScreen);
        mainWindow.webContents.send('fullscreen', !isFullScreen);
      }
    },
    {
      label: 'Silenciar audio',
      accelerator: 'CmdOrCtrl+M',
      click: () => {
        mainWindow.webContents.audioMuted = !mainWindow.webContents.audioMuted;
        mainWindow.webContents.send('muted', mainWindow.webContents.audioMuted);
      }
    },
    {
      label: 'Limpiar caché',
      accelerator: 'CmdOrCtrl+F5',
      click: () => clearData(mainWindow)
    },
    {
      label: 'Reiniciar',
      accelerator: 'F5',
      click: () => mainWindow.reload()
    }
  ];

  const menu = new Menu();
  if (process.platform === 'darwin') {
    menu.append(new MenuItem({ label: 'Universal Penguin', submenu: menuItems }));
  } else {
    menuItems.forEach(item => menu.append(new MenuItem(item)));
  }

  return menu;
};

async function clearData(mainWindow) {
  await mainWindow.webContents.session.clearCache();
  await mainWindow.webContents.session.clearStorageData();
  await mainWindow.webContents.session.clearHostResolverCache();
  await mainWindow.webContents.session.clearAuthCache();
  mainWindow.reload();
}