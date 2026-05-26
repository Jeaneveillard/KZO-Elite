const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Dossier userData cohérent entre dev et packagé
app.setPath('userData', path.join(app.getPath('appData'), 'kzo-inspectpro-elite'));

const PORT = 7430;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json'
};

function startServer() {
  const dir = app.isPackaged
    ? path.join(process.resourcesPath, 'Code_Source')
    : path.join(__dirname, '..', 'Code_Source');
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = req.url === '/' ? '/kzo-inspectpro-elite.html' : req.url;
      const filePath = path.join(dir, url);
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
        res.end(data);
      });
    });
    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') resolve(null);
      else throw e;
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

async function createWindow() {
  await startServer();

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'KZO InspectPro Elite',
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  Menu.setApplicationMenu(null);
  win.loadURL('http://localhost:' + PORT + '/');
}

// ── IPC : Ouvrir fichier .kzo ──────────────────────────────
ipcMain.handle('open-kzo-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Ouvrir une inspection KZO',
    filters: [{ name: 'Inspection KZO', extensions: ['kzo'] }, { name: 'Tous les fichiers', extensions: ['*'] }],
    properties: ['openFile']
  });
  if (canceled || !filePaths.length) return null;
  return filePaths[0];
});

// ── IPC : Enregistrer fichier .kzo ─────────────────────────
ipcMain.handle('save-kzo-file', async (_event, pathOrName, content) => {
  const isFullPath = pathOrName && (pathOrName.includes('\\') || pathOrName.includes('/'));
  let savePath = isFullPath ? pathOrName : null;

  if (!savePath) {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Enregistrer l\'inspection KZO',
      defaultPath: pathOrName || 'inspection.kzo',
      filters: [{ name: 'Inspection KZO', extensions: ['kzo'] }]
    });
    if (canceled || !filePath) return { success: false };
    savePath = filePath;
  }

  try {
    fs.writeFileSync(savePath, content, 'utf8');
    return { success: true, filePath: savePath };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// ── IPC : Lire fichier (texte) ─────────────────────────────
ipcMain.handle('read-file', async (_event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return { success: true, content };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// ── IPC : Lire fichier (binaire base64) ────────────────────
ipcMain.handle('read-file-buffer', async (_event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return { success: true, data: buffer.toString('base64') };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
