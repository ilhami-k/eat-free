/**
 * Main Process
 * Entry point for Electron application
 * Responsibilities:
 * - App lifecycle management
 * - Window creation
 * - Register IPC handlers (by calling registerAllRepositories)
 */

import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import 'dotenv/config';
import { registerAllRepositories } from './ipc/registerRepositories';
import { databaseRepository } from './repositories/databaseRepository';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

/**
 * Create the main application window
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    icon: isDev ? undefined : path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:5173' // Vite dev server
    : `file://${path.join(__dirname, '../renderer/index.html')}`; // Production build

  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Create application menu
 */
function createMenu(): void {
  const template: Array<Electron.MenuItemConstructorOptions> = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * App ready - Register IPC handlers and create window
 */
app.on('ready', async () => {
  console.log('[Main] Application starting...');

  // Register all repository IPC handlers (the single most important call)
  registerAllRepositories();

  // Verify database connection
  const isHealthy = await databaseRepository.healthCheck();
  if (!isHealthy) {
    console.error('[Main] Database health check failed');
    app.quit();
    return;
  }

  console.log('[Main] Database connection verified');

  // Create window and menu
  createWindow();
  createMenu();
});

/**
 * All windows closed - disconnect and quit
 */
app.on('window-all-closed', async () => {
  console.log('[Main] All windows closed');

  // Disconnect from database
  await databaseRepository.disconnect();
  console.log('[Main] Database disconnected');

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Activate - restore window on macOS
 */
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Uncaught exception handler
 */
process.on('uncaughtException', (error) => {
  console.error('[Main] Uncaught exception:', error);
});
