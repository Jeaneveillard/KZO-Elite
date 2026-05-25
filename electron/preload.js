// preload.js — bridge sécurisé entre Node.js et le renderer
// v1.0 : aucune API Node exposée (l'app n'en a pas besoin)
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
});
