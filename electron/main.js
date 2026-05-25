const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'KZO InspectPro Elite',
    icon: path.join(__dirname, '..', 'icon-512.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  // Supprimer le menu natif Electron (l'app a sa propre UI)
  Menu.setApplicationMenu(null);

  // Charger l'application depuis le disque local
  win.loadFile(path.join(__dirname, '..', 'KZO_Inspect.html'));
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
