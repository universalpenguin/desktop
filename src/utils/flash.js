const path = require('path');

function getPluginName(app) {
    let pluginName;
    switch (process.platform) {
        case 'win32':
            pluginName = app.isPackaged ? 'pepflashplayer.dll' : 'win/x64/pepflashplayer.dll';
            break;
        case 'darwin':
            pluginName = app.isPackaged ? 'PepperFlashPlayer.plugin' : 'mac/x64/PepperFlashPlayer.plugin';
            break;
        default:
            pluginName = app.isPackaged ? 'libpepflashplayer.so' : 'linux/x64/libpepflashplayer.so';
    }
    return pluginName;
}

function loadFlashPlugin(app) {
    const pluginName = getPluginName(app);
    const flashPath = app.isPackaged ? path.join(process.resourcesPath, 'flash', pluginName) : path.join(__dirname, '..', '..', 'flash', pluginName);
    
    app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
    app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.465');
}

module.exports = loadFlashPlugin;