const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  openKzoFile: () => ipcRenderer.invoke('open-kzo-file'),
  saveKzoFile: (pathOrName, content) => ipcRenderer.invoke('save-kzo-file', pathOrName, content),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  readFileBuffer: (filePath) => ipcRenderer.invoke('read-file-buffer', filePath)
});
