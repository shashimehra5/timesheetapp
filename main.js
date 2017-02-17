'use strict'
const electron = require('electron');

// module to control application
const app = electron.app;

//module to create native window
const BrowserWindow = electron.BrowserWindow;
const path = require('path')
const url = require('url')

// global reference of the window object
let mainWindow;

/**
 * create window 
 */
function createWindow() {

    //browser window option
    const browserOptions = {
        width: 300,
        height: 320,
        // transparent: true,
        frame: false,
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

    // close window
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
}

// app events
app.on('ready', createWindow);
app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function() {
    if(mainWindow === null) {
        createWindow();
    }
});