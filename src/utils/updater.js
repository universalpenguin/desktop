const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '¡Actualización disponible!',
      message: 'Una nueva versión de UP está disponible. Se descargará en segundo plano.',
    });
  });

  autoUpdater.on('update-downloaded', () => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Reiniciar', 'Después'],
      title: 'Actualización lista',
      message: 'Una nueva versión ha sido descargada.',
      detail: 'Reinicia la aplicación para aplicar la actualización.',
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error en la actualización', `Ocurrió un error al buscar actualizaciones: ${error.message}`);
  });
}

module.exports = { checkForUpdates };