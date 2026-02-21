import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { JournalWatcher } from './journal-watcher';

let mainWindow: BrowserWindow | null = null;
let journalWatcher: JournalWatcher | null = null;

const JOURNAL_DIR = path.join(
  process.env.USERPROFILE || process.env.HOME || '',
  'Saved Games',
  'Frontier Developments',
  'Elite Dangerous'
);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Initialize journal watcher
  journalWatcher = new JournalWatcher(JOURNAL_DIR);

  journalWatcher.on('routeUpdate', (data) => {
    if (mainWindow) {
      mainWindow.webContents.send('routeUpdate', data);
    }
  });

  journalWatcher.on('jumpComplete', (data) => {
    if (mainWindow) {
      mainWindow.webContents.send('jumpComplete', data);
    }
  });

  journalWatcher.on('error', (error) => {
    console.error('Journal watcher error:', error);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('getJumpState', () => {
  return journalWatcher?.getState() || null;
});

ipcMain.handle('setAlwaysOnTop', (_event, value: boolean) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(value, 'screen-saver');
  }
});

ipcMain.handle('closeWindow', () => {
  mainWindow?.close();
});

ipcMain.handle('minimizeWindow', () => {
  mainWindow?.minimize();
});
