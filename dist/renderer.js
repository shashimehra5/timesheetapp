'use strict'
const ipc = require('electron').ipcRenderer
const remote = require('electron').remote
const storage = require('electron-json-storage');
const content = document.getElementById('content');

storage.clear(function (error) {
    if (error) 
        throw error;
    }
);

content.addEventListener('putTray', function (event) {
    ipc.send('put-in-tray');
    console.log("close");

    //get all
    storage.getAll(function (error, data) {
        if (error) 
            throw error;
        console.info("storage data: ", data);
    });
})

content.addEventListener('onSave', onSaveButton);
content.addEventListener('onOverview', onOverviewSelect);
content.addEventListener('onBack', onBackMainScreen);

function onSaveButton(event) {
    var curTime = event.detail.currentTime;
    storage.has(curTime, function (error, hasKey) {
        if (error) 
            throw error;
        if (hasKey) {

            //the key already existed
            let details = {
                "jobName": event.detail.jobName,
                "jobTime": event.detail.jobTime
            };

            // get the existing data and update
            storage.get(curTime, function (error, data) {
                if (error) 
                    throw error;
                data.push(details);
                console.log("update: ", data);

                // update
                storage.set(curTime, data, function (error) {
                    if (error) 
                        throw error;
                    }
                );
            });
        } else {

            // a new entry, the key is not existed in json
            let details = [
                {
                    "jobName": event.detail.jobName,
                    "jobTime": event.detail.jobTime
                }
            ];

            //save to local
            storage.set(curTime, details, function (error) {
                if (error) 
                    throw error;
                }
            );
        }
    });
}

function onOverviewSelect(event) {
    generateList();
}

function onBackMainScreen(event) {
    let list = document.getElementById('jobList');
    list.removeChild(list.childNodes[0]);
}

function generateList() {
    storage.getAll(function (error, data) {
            if (error) 
                throw error;
            
            // console.log(data); var tslist='<List>'; for (var key in data){     //
            // construct subheader     var subheader = '<Subheader inset={true}>' + key +
            // '</Subheader>';     tslist += subheader;     // construct list items     var
            // value = data[key];     for(let i=0; i<value.length; i++) {         var
            // listItem = '<ListItem leftAvatar={<Avatar icon={<ActionAssignment />} />}
            // primaryText="' +             value[i].jobName + '"secondaryText="' +
            // value[i].jobTime + '" />';         tslist += listItem;     } } tslist +=
            // "</List>"; native HTML tags
            var tslist = "<div>";
            for (var key in data) {
                var subheader = '<h2>' + key + '</h2><ul>';
                tslist += subheader;
                var value = data[key];
                for (let i = 0; i < value.length; i++) {
                    var listItem = '<li><h3>' + value[i].jobName + ' - ' + value[i].jobTime + '</h3></li>';
                    tslist += listItem;
                }
                tslist += "</ul>";
            }
            tslist += "</div>";
            console.log(tslist);
            document.getElementById('jobList').insertAdjacentHTML('afterbegin', tslist);
        });
}

// show the window every hour
var winDate = new Date();
if (winDate.getMinutes() === 0) {
    callEveryHour()
} else {
    winDate.setHours(winDate.getHours() + 1);
    winDate.setMinutes(0);
    winDate.setSeconds(0);

    let difference = winDate - new Date();
    setTimeout(callEveryHour, difference);
}

function callEveryHour() {
    setInterval(onTickHour(), 1000 * 60 * 60);
}

function onTickHour() {
    ipc.send('hour-tick');
    document.getElementById('timeArrange').innerHTML = "Time @ " + getCurrentHour();
}

function getCurrentHour() {
    var currentdate = new Date();
    var hours = currentdate.getHours();
    var hours = (hours + 24) % 24;
    var mid = 'am';
    if (hours == 0) {
        hours = 12;
    } else if (hours > 12) {
        hours = hours % 12;
        mid = 'pm';
    }

    var premid = 'am';
    var preHour = currentdate.getHours() - 1;
    if (preHour == 0) {
        preHour = 12;
    } else if (preHour > 12) {
        preHour = preHour % 12;
        premid = 'pm';
    }

    var curHour = preHour + premid + '-' + hours + mid;
    return curHour;
}

// Tray removed from context menu on icon
ipc.on('restore-select', function () {
        ipc.send('restore-app')
    })

ipc.on('quit-select', function () {
    ipc.send('quit-app')
})
