import React from 'react'
import {Link} from 'react-router'
import localStorage from 'localStorage'

import RaisedButton from 'material-ui/RaisedButton';
import {deepOrange500, cyan500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ActionAlarm from 'material-ui/svg-icons/action/alarm';
import ActionHistory from 'material-ui/svg-icons/action/history';
import CommunicationContactMail from 'material-ui/svg-icons/communication/contact-mail';
import NotificationPriorityHigh from 'material-ui/svg-icons/notification/priority-high';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {Card, CardHeader,CardTitle, CardText} from 'material-ui/Card';

const styles = {
  header: {
    textAlign: 'center',
    paddingTop: 0
  },
  container: {
    textAlign: 'left',
    paddingLeft: 20
  },
  time: {
    paddingTop: 5,
    width: 250
  },
  savebtn: {
    paddingTop: 10,
    paddingLeft: 20
  },
  title: {
    textAlign: 'centre',
    cursor: 'pointer'
  },
  sheetTitle: {
    paddingTop: 30,
    paddingLeft: 21
  },
  process: {
    paddingLeft: 25
  },
  btnSpan: {
    paddingLeft: 25
  },
  list: {
    paddingTop: 10,
    margin: 5
  },
  bottomNav: {
    paddingTop: 50,
    paddingBottom: 0
  }
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
    textColor: cyan500
  },
  appBar: {
    height: 50
  }
});

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobTime: 0.25,
      errorText: '',
      jobNameTextFieldValue: '',
      currentHour: '',
      curTotal: 0,
      slotCompletedPercent: 0,
      notificationOpen: false,
      missedTimeSlot: [],
      isUpdated: true
    };
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.onJobNameChange = this.onJobNameChange.bind(this);
    this.onClose = this
      .onClose
      .bind(this);
    this.onOverview = this
      .onOverview
      .bind(this);
    this.onSave = this
      .onSave
      .bind(this);
    this.getCurrentHour = this
      .getCurrentHour
      .bind(this);
    this.onNotificationClicked = this.onNotificationClicked.bind(this);
    this.onNotificationClose = this.onNotificationClose.bind(this);
  };

  componentWillMount() {
    
    // restore the states
    if(localStorage.getItem('curTotal') !== null) {
      let store_curTotal = localStorage.getItem('curTotal');
      store_curTotal = Number(store_curTotal);
      console.log("localStorage curTotal", store_curTotal);
      this.setState({curTotal : store_curTotal});
    }

    if(localStorage.getItem('slotCompletedPercent') !== null) {
      let store_slotCompletedPercent = localStorage.getItem('slotCompletedPercent');
      store_slotCompletedPercent = parseInt(store_slotCompletedPercent);
      console.log("localStorage store_slotCompletedPercent", store_slotCompletedPercent);
      this.setState({slotCompletedPercent : store_slotCompletedPercent});
    }

    if(localStorage.getItem('jobNameTextFieldValue') !== null) {
      this.setState({jobNameTextFieldValue : localStorage.getItem('jobNameTextFieldValue')});
    }

    if(localStorage.getItem('missedTimeSlot') !== null && localStorage.getItem('missedTimeSlot') !== "") {
      var ls_missTimeSlot = localStorage.getItem('missedTimeSlot');
      ls_missTimeSlot = ls_missTimeSlot.split(',');
      this.setState({missedTimeSlot : ls_missTimeSlot});
    }
  } 

  componentDidMount() {
    window.addEventListener('onTickHour', this.onTickHour.bind(this));
    
    if(this.state.missedTimeSlot.length > 0){
      let missedTimeSlots = this.state.missedTimeSlot;
      if(typeof missedTimeSlots === 'string' ) missedTimeSlots = [missedTimeSlots];
      var timeslot =  missedTimeSlots[0];
      this.setState({currentHour: timeslot});
    } else {
      this.setState({currentHour: this.getCurrentHour()});
    }
  }

  componentWillUnmount() {
    localStorage.setItem('curTotal', this.state.curTotal);
    localStorage.setItem('slotCompletedPercent', this.state.slotCompletedPercent);
    localStorage.setItem('jobNameTextFieldValue', this.state.jobNameTextFieldValue);
    localStorage.setItem('missedTimeSlot', this.state.missedTimeSlot);
  }

  /**
   * on tick hour event
   */
  onTickHour(event) {
    console.log("received tick hour");

    // if the current time slot is not filled, we push it into the missedTime array
    if(this.state.isUpdated) {
       // everything updated we 
      this.setState({currentHour: this.getCurrentHour()});
      this.setState({isUpdated: false});
      this.setState({curTotal: 0});
      this.setState({slotCompletedPercent: 0});
    } else {
      console.log("not updated");
      var missedTimeArr = this.state.missedTimeSlot;
      missedTimeArr.push(this.state.currentHour);
      this.setState({missedTimeSlot : missedTimeArr});
    }
  }

/**
 * get the current time in "12am-1pm" format
 */
  getCurrentHour() {
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

/**
 * job time change handler
 */
  handleDropDownChange(event, index, jobTime) {
    this.setState({jobTime: jobTime});
  };

/**
 * job name change handler
 */
  onJobNameChange(event) {
    this.setState({errorText: '', jobNameTextFieldValue: event.target.value})
  };

/**
 * put the app to tray
 */
  onClose(event) {
    this.setState({errorText: ''})

    //dispatch a custom event to instruct electron put the main window into the tray
    var trayEvent = new CustomEvent("putTray", {
      detail: {
        // currentTime: this.getCurrentHour(),
        jobName: this.state.jobNameTextFieldValue,
        jobTime: this.state.jobTime
      },
      bubbles: true
    });
    event.currentTarget.dispatchEvent(trayEvent)
    this.state.jobNameTextFieldValue = "";
    event.preventDefault();
  }

  /**
   * save data to local
   */ 
  onSave(event) {
    if (this.state.jobNameTextFieldValue == "") {
      this.setState({errorText: 'Empty Job Name'})
    } else {
      this.setState({errorText: ''})
      var date = new Date();
      var selyear = date.getUTCFullYear();
      var selmonth = date.getUTCMonth() + 1;
      var seldate = date.getUTCDate();
      var fullyear = selyear + '-' + selmonth + '-' + seldate;
      
      // request renderer process to save json file
      var saveEvent = new CustomEvent("onSave", {
        detail: {
          currentDate: fullyear,
          currentTime: this.state.currentHour,
          jobName: this.state.jobNameTextFieldValue,
          jobTime: this.state.jobTime
        },
        bubbles: true
      });
      var saveBtn = event.currentTarget;
      saveBtn.dispatchEvent(saveEvent);

      // count the total time of the current hour saved
      var curTotal = this.state.curTotal + this.state.jobTime;
      this.setState({curTotal: curTotal});

      // if the current saved total time is more than 1 hour 
      // we close the window

      // set the progress circle
      var slotCompletePerfectage = (curTotal > 1) ? 100 : curTotal * 100;
      this.setState({slotCompletedPercent: slotCompletePerfectage});

      if(curTotal >= 1) {

          // check missed time slot
          if(this.state.missedTimeSlot.length > 0){
            let missedTimeArr = this.state.missedTimeSlot.slice();
            missedTimeArr.shift();
            if(missedTimeArr.length > 0) {
              this.setState({currentHour: missedTimeArr[0]});
            } else {
              this.setState({currentHour: this.getCurrentHour()});
            }
            
            this.setState({missedTimeSlot: missedTimeArr});
            this.setState({curTotal: 0});
            this.setState({slotCompletedPercent: 0});
          } else {
            var trayEvent = new CustomEvent("putTray", { bubbles: true});
            setTimeout(function(event){  
              saveBtn.dispatchEvent(trayEvent);
              this.setState({curTotal: 0});
              this.setState({slotCompletedPercent: 0});
              this.setState({isUpdated: true});
            }.bind(this), 500);
          }
      }
    }

    // reset
    this.state.jobNameTextFieldValue = "";
    event.preventDefault();
  }

  // display overview page
  onOverview(event) {
    var ovEvent = new CustomEvent("onOverview", {bubbles: true});
    event.currentTarget.dispatchEvent(ovEvent)
  }

  //notification
  onNotificationClicked(event) {
    this.setState({notificationOpen: true, anchorEl: event.currentTarget});
  }

  // notification close
  onNotificationClose(event) {
    this.setState({notificationOpen: false});
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id="app">
          <div style={styles.header}>
            <AppBar
              title={<span style = { styles.title }> Timesheet </span>}
              />
          </div>
          <div style={{width: '75%', display: 'inline-block'}}>
              <List>
                  <ListItem 
                      disabled={true}
                      leftAvatar={
                        <Avatar
                          icon={<ActionAlarm />}
                          size={30}
                          backgroundColor={cyan500}
                        />
                      }
                    >
                     <div id="timeArrange" >{this.state.currentHour} </div>
                  </ListItem>
              </List>
          </div>
          <div style={{width: '25%', display: 'inline-block'}}>
              <Badge
                badgeContent={this.state.missedTimeSlot.length}
                secondary={true}
                badgeStyle={{top: 20, right: 20}}
                >
                <IconButton tooltip="Notifications" onClick={this.onNotificationClicked}>
                  <NotificationsIcon />
                </IconButton>
              </Badge>
              <Popover
                 open={this.state.notificationOpen}
                 anchorEl={this.state.anchorEl}
                 anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                 targetOrigin={{horizontal: 'left', vertical: 'top'}}
                 onRequestClose={this.onNotificationClose}
                 animation={PopoverAnimationVertical}
               >
                 <Card>
                   <CardHeader
                      title={(this.state.missedTimeSlot.length > 0) ? "Time Missed" : "Well Done"}
                      subtitle={(this.state.missedTimeSlot.length > 0) ? (this.state.missedTimeSlot.length + " hours") : "Your timesheet is up-to-date."} 
                      avatar={<NotificationPriorityHigh/>}
                    />
                 </Card>
               </Popover>
          </div>
          
          <div style={styles.container}>
            <TextField
              hintText="Job Number/Name"
              name="jobName"
              id="jobNameField"
              value={this.state.jobNameTextFieldValue}
              errorText={this.state.errorText}
              onChange={this
              .onJobNameChange
              .bind(this)}/>
            <br/>
          </div>
          <div>
            
            <div style={styles.time}>
              <DropDownMenu value={this.state.jobTime} onChange={this.handleDropDownChange}>
                <MenuItem value={0.25} primaryText="0.25 hour"/>
                <MenuItem value={0.5} primaryText="0.5 hour"/>
                <MenuItem value={0.75} primaryText="0.75 hour"/>
                <MenuItem value={1} primaryText="1 hour"/>
              </DropDownMenu>
            </div>

            <div style={styles.savebtn}>
              <span style={{width: '70%', display: 'inline-block', paddingTop: 15}}>
                 <CircularProgress
                    mode="determinate"
                    value={this.state.slotCompletedPercent}
                    size={30}
                    color={deepOrange500}
                    thickness={5}
                  />
              </span>
              <span style={{width: '30%', display: 'inline-block'}}>
                <RaisedButton id="saveBtn" label="Save" secondary={true} onClick={this.onSave}/>
              </span>
            </div>     

          </div>

          <div style={styles.bottomNav}>
            <Paper zDepth={1}>
              <BottomNavigation>
                <BottomNavigationItem
                  label="Recorded Timesheet"
                  icon={<ActionHistory/>}
                  containerElement = { <Link to = "/overview"/>}
                  onTouchTap={this.onOverview}
                />
                <BottomNavigationItem
                  label="Email Timesheet to Linda"
                  icon={<CommunicationContactMail/>}
                  containerElement = { <Link to = "/toLinda"/>}
                />
              </BottomNavigation>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
