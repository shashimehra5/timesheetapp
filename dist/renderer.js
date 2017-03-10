'use strict'
const ipc = require('electron').ipcRenderer
const remote = require('electron').remote
const storage = require('electron-json-storage');
const content = document.getElementById('content');
const email = 'linda.pengelly@fivebyfiveglobal.com';
const subject = 'Timesheet auto email';

const office_hours = [10, 11, 12, 13, 15, 16, 17];

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
var body_message;   // get data from local has a time delays, we need to make this variable global                                     
function onSendLinda(event) {
    var startDate = event.detail.startDate;
    var endDate = event.detail.endDate;
    var range = genRangeDates(startDate, endDate);
    body_message = 'Time Sheet\r\n\r\nFrom ' + startDate + ' to ' + endDate + ' :\r\n\r\n\r\n';
    genMsgBody(range);

    // there is a time delays to get the local saved data so we send the email when this loop finishes at here
    setTimeout(waitEmailData, 650);
}

function waitEmailData(event){
    var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(body_message);
    document.location.href = mailto_link;
}

function genMsgBody(range){

    // the selected date range 
    for(let i = 0; i < range.length; i++) {
        let curDate = range[i];

        // check the date is available
        storage.has(curDate, function(error, hasKey) {
            if(error) 
                throw error;
            if(hasKey) {
                body_message += curDate + '\r\n\r\n';

                // get the existing data and update
                storage.get(curDate, function(error, dataObj) {
                    if(error)
                       throw error
                    
                    var timeSlots = dataObj.curDate;

                    // looking for each time slot
                    for(let t = 0; t < timeSlots.length; t++) {
                        body_message += '    ' + timeSlots[t].curTime  + '\r\n\r\n';
                        let jobs = timeSlots[t].jobDetails;

                        //looking for jobs in each time slot
                        for (let j = 0; j < jobs.length; j++) {
                            let jobName = jobs[j].jobName;
                            let jobTime = jobs[j].jobTime;
                            body_message += '        ' + jobName + " - " + jobTime + ' hour' + '\r\n';
                        }
                        body_message += '\r\n';
                    }
                    body_message += '\r\n';
                });
            }
        });
    }
}

function genRangeDates(startDate, endDate) {

    //contains all dates in the selected range
    var dateRange = [];

    var re = /(\d{4})\-(\d{1,2})\-(\d{1,2})/g;
    var re2 = /(\d{4})\-(\d{1,2})\-(\d{1,2})/g;
    var startDateArr = re.exec(startDate);
    var endDateArr = re2.exec(endDate);

    // year (mutiple years selection is not support)
    var year = startDateArr[1];

    //month
    var startMonth = startDateArr[2];
    var endMonth = endDateArr[2];

    console.info("start/end month", startMonth, endMonth);

    if(typeof startMonth === "string") { 
        startMonth = parseInt(startMonth) + 1;
        endMonth = parseInt(endMonth) + 1;
    }

    //day
    var startDay = startDateArr[3];
    var endDay = endDateArr[3];

    if(typeof startDay === "string") { 
        startDay = parseInt(startDay);
        endDay = parseInt(endDay);
    }

    // if the selected range spreads mutiple months
    if(endMonth > startMonth) {
        var diff_month = endMonth - startMonth;
        console.log("month diff", diff_month);

        // the first month
        for(let i = startDay; i <= 31; i++){
            let loop_date = year  + "-" + startMonth + "-" + i;
            dateRange.push(loop_date);
            console.info("dates", loop_date);
        }

        // iterate the months in the middle
        if(diff_month > 1) {
            for(let i = startMonth + 1; i <= endMonth-1; i++){
                for(let j = 1; j <= 31; j++) {
                    let loop_date = year  + "-" + i + "-" + j;
                    dateRange.push(loop_date);
                }
            }
        }

        // the end month
        for(let i = 1; i <= endDay; i++) {
            let loop_date = year  + "-" + endMonth + "-" + i;
            dateRange.push(loop_date);
            console.info("dates", loop_date);
        }
    } else {
        console.log("same month", startDay, endDay);
        // in the same month, this is much easier
        for(let i = startDay; i <= endDay; i++) {
            let loop_date = year  + "-" + startMonth + "-" + i;
            dateRange.push(loop_date);
        }
    } 

    return dateRange;
    
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
    var currentdate = new Date();
    var hours = currentdate.getHours();
    console.log("on tick hour");
    if(office_hours.indexOf(hours) > -1) {
        console.log("in office hour");
        ipc.send('hour-tick');
        var onTickHourEvent = new CustomEvent("onTickHour", {bubbles: true});
        window.dispatchEvent(onTickHourEvent);
    }
}

// Tray removed from context menu on icon
ipc.on('restore-select', function () {
        ipc.send('restore-app')
    })

ipc.on('quit-select', function () {
    ipc.send('quit-app')
})
