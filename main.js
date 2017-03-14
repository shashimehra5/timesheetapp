'use strict'
const squirrelInstall = require('./squirrel_install');
if (squirrelInstall.handleSquirrelEvent()) {
    return;
 }

const electron = require('electron');
const app = electron.app;

const ipc = electron.ipcMain
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const Tray = electron.Tray

const Positioner = require('electron-positioner')

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
        width: 380,
        height: 450,
        // transparent: true,
        frame: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        maximizable: false,
        // resizable: false,
        icon: 'dist/img/logo.png'
    };

    mainWindow = new BrowserWindow(browserOptions);

    // load the index.html to the app
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/dist/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // dev tools
    // mainWindow.openDevTools();

    positioner = new Positioner(mainWindow);
    positioner.move('bottomRight');

    // close window
    mainWindow.on('closed', function() {
        // the window object, usually you would store windows in an array if
        // your app supports multi windows, this is the time when you should delete the
        // corresponding element.
        mainWindow = null
        if (appIcon != null)
            appIcon.destroy()
    });
    mainWindow.show();
    appIcon = new Tray(iconPath);
    console.log(app.getPath('userData'));

    // power monitor
    // on power resume, we correct the current time out
    electron.powerMonitor.on('resume', function() {
         console.log('on power resume');
         mainWindow.webContents.send('power-resume');
    });

    // on power suspend, we clear the timeout
    electron.powerMonitor.on('suspend', function() {
         console.log('on power suspend');
         mainWindow.webContents.send('power-suspend');
    });
}

/**
 *  System Tray
 */
ipc.on('put-in-tray', function(event) {
    mainWindow.hide();

    // const contextMenu = new Menu()
    // const menuItemOne = new MenuItem({
    //     label: 'Restore',
    //     click: function() {
    //         event.sender.send('restore-select')
    //     }
    // })
    // contextMenu.append(menuItemOne);
    // const menuItemTwo = new MenuItem({
    //     label: 'Hide',
    //     click: function() {
    //         event.sender.send('put-in-tray')
    //     }
    // })
    // contextMenu.append(menuItemTwo);
    // const menuItemThree = new MenuItem({
    //     label: 'Remove',
    //     click: function() {
    //         event.sender.send('quit-select')
    //     }
    // })
    // contextMenu.append(menuItemThree);
    // appIcon.setContextMenu(contextMenu);

    appIcon.setToolTip('Timesheet App');
    
});

ipc.on('restore-app', function() {
    mainWindow.show();
    //appIcon.destroy();
});

ipc.on('quit-app', function() {
    app.quit();
    appIcon.destroy();
});

ipc.on('hour-tick', function() {
    mainWindow.show();
});

// app events
app.on('ready', createWindow);
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    if (appIcon)
        appIcon.destroy();
});
app.on('activate', function() {
    if (mainWindow === null) {
        createWindow();
    }
});