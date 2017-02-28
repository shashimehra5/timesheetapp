'use strict'
const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
     .then(createWindowsInstaller)
     .catch((error) => {
     console.error(error.message || error)
     process.exit(1)
 })

function getInstallerConfig () {
    console.log('creating windows installer')
    const rootPath = path.join('./')
    const outPath = path.join(rootPath, 'releases')

    return Promise.resolve({
       appDirectory: path.join(outPath, 'Timesheet\ App-win32-ia32/'),
       authors: 'FBF Digitial',
       noMsi: true,
       outputDirectory: path.join(outPath, 'windows-installer'),
       exe: 'Timesheet\ App.exe',
       setupExe: 'TimesheetAppInstaller.exe',
       setupIcon: path.join(rootPath, 'dist', 'img', 'logo.ico'),
       loadingGif: path.join(rootPath, 'dist', 'img', 'loading.gif')
   })
}