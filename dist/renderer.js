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
content.addEventListener('onDateSelected', onDateSelected);
content.addEventListener('onSendLinda', onSendLinda);

/**
 * save the recorded time json data to local
 */
function onSaveButton(event) {

    // get the current date
    var curDate = event.detail.currentDate;

    // get the current time
    var curTime = event.detail.currentTime;
    storage.has(curDate, function(error, hasKey) {
        if(error) 
            throw error;
        if(hasKey) {
             
             //the key already existed
            let jobDetails = {
                "jobName": event.detail.jobName,
                "jobTime": event.detail.jobTime
            };

             // get the existing data and update
             storage.get(curDate, function(error, dataObj) {
                 if(error)
                    throw error
                 
                 var data = dataObj.curDate;

                 // check the time exsits 
                 var isExisted = false;
                 for(var i=0; i<data.length; i++) {
                    
                    // the time exsits
                    if(data[i].curTime == curTime){
                        data[i].jobDetails.push(jobDetails);
                        isExisted = true;
                        break;
                    }
                 }

                //if the time is not exsited
                if(!isExisted){
                    let details = {
                        "curTime": curTime,
                        "jobDetails" : [jobDetails]
                    };
                    data.push(details);
                }

                dataObj["curDate"] = data;

                //save to local
                storage.set(curDate, dataObj, function (error) {
                    if (error) 
                        throw error;
                    }
                );
             });

        } else {

            // a new entry, the key is not existed in json
            let jobDetails = [
                {
                    "jobName": event.detail.jobName,
                    "jobTime": event.detail.jobTime
                }
            ];

            let details = [{
                "curTime": curTime,
                "jobDetails" : jobDetails
            }];

            let detail_obj = {
                curDate : details
            }

            //save to local
            storage.set(curDate, detail_obj, function (error) {
                if (error) 
                    throw error;
                }
            );
        }
    });
}

function onOverviewSelect(event) {
    var date = new Date();
    var selyear = date.getUTCFullYear();
    var selmonth = date.getUTCMonth()+1;
    var seldate = date.getUTCDate();
    var fullyear = selyear +'-'+ selmonth+'-'+seldate;
    generateList(fullyear);
}

function onBackMainScreen(event) {
    //let list = document.getElementById('jobList');
    //list.removeChild(list.childNodes[0]);
}

function onDateSelected(event) {
    var selectDate = event.detail.selectDate;
    console.info("renderer process:" + selectDate);
    generateList(selectDate);
}

/**
 * send the selected date range timesheet to linda 
 */
function onSendLinda(event) {
    var startDate = event.detail.startDate;
    var endDate = event.detail.endDate;
    console.info("renderer process:", startDate, endDate);
    var body_message = 'Time Sheet\r\n\r\nFrom ' + startDate + ' to ' + endDate + ' :\r\n\r\n';
    var email = 'liang.lin@fivebyfiveglobal.com';
    var subject = 'Timesheet auto email';
    var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(body_message);
    document.location.href = mailto_link;
}

function generateList(fullyear) {
    
    storage.get(fullyear, function(error, data) {
            if (error) 
                throw error;
            console.log("gen list: ",data["curDate"]);

            // dispatch event to overview page
            var onGenOverviewEvent = new CustomEvent("onGenOverview", { 
                detail: {
                    data:  data["curDate"]
                }, 
                bubbles: true });
            window.dispatchEvent(onGenOverviewEvent);

            // console.log(data); var tslist='<List>'; for (var key in data){     //
            // construct subheader     var subheader = '<Subheader inset={true}>' + key +
            // '</Subheader>';     tslist += subheader;     // construct list items     var
            // value = data[key];     for(let i=0; i<value.length; i++) {         var
            // listItem = '<ListItem leftAvatar={<Avatar icon={<ActionAssignment />} />}
            // primaryText="' +             value[i].jobName + '"secondaryText="' +
            // value[i].jobTime + '" />';         tslist += listItem;     } } tslist +=
            // "</List>"; 
            
            //native HTML tags
            // var tslist = "<div>";
            // for(var i=0; i<data.length; i++){
            //     var dateObj = data[i];
            //     console.log("dateObj: ",data[i]);
            //     var subheader = '<h2>' + dateObj.curTime + '</h2><ul>';
            //     tslist += subheader;
            //     var value = dateObj.jobDetails;
            //     for (let i = 0; i < value.length; i++) {
            //         var listItem = '<li><h3>' + value[i].jobName + ' - ' + value[i].jobTime + '</h3></li>';
            //         tslist += listItem;
            //     }
            //     tslist += "</ul>";
            // }
            
            // tslist += "</div>";
            // console.log(tslist);

            // let list = document.getElementById('jobList');
            // console.info("list: ", list);
            // if(list.childNodes.length > 0) {
            //     list.removeChild(list.childNodes[0]);
            // }
            // list.insertAdjacentHTML('afterbegin', tslist);
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

/**
 * the timer to refresh app every hour
 */
function callEveryHour() {
    setInterval(onTickHour(), 1000 * 60 * 60);
}

/**
 * tick hour
 */
function onTickHour() {
    ipc.send('hour-tick');
    var onTickHourEvent = new CustomEvent("onTickHour", {bubbles: true});
    window.dispatchEvent(onTickHourEvent);
}

// Tray removed from context menu on icon
ipc.on('restore-select', function () {
        ipc.send('restore-app')
    })

ipc.on('quit-select', function () {
    ipc.send('quit-app')
})
