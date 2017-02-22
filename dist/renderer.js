const ipc = require('electron').ipcRenderer

const saveBtn = document.getElementById('saveBtn')
// let trayOn = false

saveBtn.addEventListener('tray', function (event) {
  ipc.send('put-in-tray')
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
