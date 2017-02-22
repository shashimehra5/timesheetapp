const ipc = require('electron').ipcRenderer
const ElectronData = require('electron-data')

const saveBtn = document.getElementById('saveBtn')
// let trayOn = false

saveBtn.addEventListener('putTray', function (event) {
  ipc.send('put-in-tray')
  console.info("Job Number is: ", event.detail.jobName);
  console.info("Job Time is: ", event.detail.jobTime);
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
