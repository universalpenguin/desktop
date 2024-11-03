// https://github.com/electron-userland/electron-builder/issues/5371#issuecomment-791771150

const child_process = require('child_process')
const fs = require('fs')
const path = require('path');
const appName = "universal-penguin";

function isLinux(targets) {
    const re = /AppImage|snap|deb|rpm|freebsd|pacman/i;
    return !!targets.find(target => re.test(target.name));
}

module.exports = async function afterPack({targets, appOutDir}) {
    if (!isLinux(targets)) return;
    const script = '#!/bin/bash\n"${BASH_SOURCE%/*}"/' + appName + '.bin "$@" --no-sandbox';
    new Promise((resolve) => {
        const child = child_process.exec(`mv ${appName} ${appName}.bin`, {cwd: appOutDir});
        child.on('exit', () => resolve());
    }).then(() => {
        fs.writeFileSync(path.join(appOutDir, appName), script);
        child_process.exec(`chmod +x ${appName}`, {cwd: appOutDir});
    });
}