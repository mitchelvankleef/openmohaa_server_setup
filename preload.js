const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	getConfig: (game) => ipcRenderer.invoke('getConfig', game),
    getEnabledGames: () => ipcRenderer.invoke('getEnabledGames'),
    runServer: (game) => ipcRenderer.invoke('runServer', game),
    saveConfig: (config, game) => ipcRenderer.invoke('saveConfig', config, game),
	showDialog: (title, message) => ipcRenderer.invoke('showDialog', title, message),
});