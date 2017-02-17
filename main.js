'use strict'
const electron = require('electron');
const ipc = electron.ipcMain
const Menu = electron.Menu
const Tray = electron.Tray

const Positioner = require('electron-positioner')


// module to control application
const app = electron.app;

//module to create native window
const BrowserWindow = electron.BrowserWindow;
const path = require('path')
const url = require('url')


// global reference of the window object
let mainWindow;
let positioner;

const iconName = 'dist/img/logo.png'
const iconPath = path.join(__dirname, iconName)
let appIcon = null

/**
 * create window 
 */
function createWindow() {

    //browser window option
    const browserOptions = {
        width: 320,
        height: 350,
        // transparent: true,
        frame: false,
        skipTaskbar: true,        
        icon: 'dist/img/logo.png'
    };

    mainWindow = new BrowserWindow(browserOptions);
    

    // load the index.html to the app
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/dist/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // mainWindow.openDevTools();

    positioner = new Positioner(mainWindow);
    positioner.move('bottomRight');

    // close window
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
        if(appIcon!= null) appIcon.destroy()
    });
    mainWindow.show();
}

/**
 *  System Tray 
 */
ipc.on('put-in-tray', function (event) {
  mainWindow.hide();
  appIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([{
    label: 'Remove',
    click: function () {
      event.sender.send('tray-removed')
    }
  }])
  appIcon.setToolTip('Timesheet App');
  appIcon.setContextMenu(contextMenu);
  
  appIcon.on('click', function() {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
    mainWindow.on('show', function() {
      //appIcon.setHighlightMode('always');
    });
    mainWindow.on('hide', function() {
      //appIcon.setHighlightMode('never');
    });
})

ipc.on('remove-tray', function () {
  appIcon.destroy()
});

// app events
app.on('ready', createWindow);
app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit();
    }
    if (appIcon) appIcon.destroy();
});
app.on('activate', function() {
    if(mainWindow === null) {
        createWindow();
    }
});