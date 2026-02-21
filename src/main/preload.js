const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getJumpState: () => ipcRenderer.invoke('getJumpState'),
  setAlwaysOnTop: (value) => ipcRenderer.invoke('setAlwaysOnTop', value),
  closeWindow: () => ipcRenderer.invoke('closeWindow'),
  minimizeWindow: () => ipcRenderer.invoke('minimizeWindow'),
  onRouteUpdate: (callback) => {
    ipcRenderer.on('routeUpdate', (_, data) => callback(data));
  },
  onJumpComplete: (callback) => {
    ipcRenderer.on('jumpComplete', (_, data) => callback(data));
  }
});
