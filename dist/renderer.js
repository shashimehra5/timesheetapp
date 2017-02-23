const ipc = require('electron').ipcRenderer
const ElectronData = require('electron-data')

const saveBtn = document.getElementById('saveBtn')
// let trayOn = false

var settings = new ElectronData({
  path: "./",
  filename: 'settings'
});

saveBtn.addEventListener('putTray', function (event) {
    ipc.send('put-in-tray')
    settings.set("jobName", event.detail.jobName);
    settings.set("jobTime", event.detail.jobTime);
    console.info("Job Number is: ", settings.get("jobName"));
    console.info("Job Time is: ", settings.get("jobTime"));
    console.info("all data are: ", settings.get());
})

// Tray removed from context menu on icon
    ipc.on('restore-select', function () {
    ipc.send('restore-app')
    trayOn = false
})

ipc.on('quit-select', function () {
    ipc.send('quit-app')
    trayOn = false
})
