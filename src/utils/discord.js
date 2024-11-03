const DiscordRPC = require('discord-rpc');
const applicationId = '1297024557068189746';
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
DiscordRPC.register(applicationId);

function rpcReady() {
    rpc.setActivity({
        details: `Paseando por la isla de Club Penguin`,
        state: `Universal Penguin`,
        startTimestamp: new Date(),
        largeImageKey: 'logo',
    });
}

function initRichPresence() {
    rpc.on('ready', rpcReady);
    rpc.login({ clientId: applicationId }).catch(console.error);
}

module.exports = initRichPresence;