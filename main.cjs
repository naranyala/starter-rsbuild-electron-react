// Basic init
const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path');
const url = require('url');
const args = process.argv.slice(1)
const serve = args.some(val => val === '--start-dev')

// Let electron reloads by itself when rsbuild watches changes in ./app/
if (serve) {
  require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/.bin/electron`),
    hardResetMethod: 'exit'
  })
}

// To avoid being garbage collected
let mainWindow

app.on('ready', () => {
    createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

/**
 * Creates the main browser window
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    })

    // Use dynamic port from environment variable if available, otherwise default
    const devUrl = process.env.ELECTRON_START_URL || "http://localhost:1234";
    const startUrl = serve ? devUrl : url.format({
          pathname: path.join(__dirname, 'dist/index.html'),
          protocol: 'file:',
          slashes: true
        });

    mainWindow.loadURL(startUrl)

    // Open DevTools in development
    if (serve) {
        mainWindow.webContents.openDevTools({ mode: 'detach' })
    }

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}
