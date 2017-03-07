import React from 'react'
import {Link} from 'react-router'

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
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

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
    width: 250
  },
  savebtn: {
    paddingTop: 20,
    paddingLeft: 200
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
    paddingTop: 15,
    margin: 5
  },
  bottomNav: {
    paddingTop: 45,
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
      currentHour: '9am',
      curTotal: 0,
      slotCompleted: 0
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
  };

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

  handleDropDownChange(event, index, jobTime) {
    this.setState({jobTime: jobTime});
  };

  onJobNameChange(event) {
    this.setState({errorText: '', jobNameTextFieldValue: event.target.value})
  };

  onClose(event) {
    this.setState({errorText: ''})

    //dispatch a custom event to instruct electron put the main window into the tray
    var trayEvent = new CustomEvent("putTray", {
      detail: {
        currentTime: this.getCurrentHour(),
        jobName: this.state.jobNameTextFieldValue,
        jobTime: this.state.jobTime
      },
      bubbles: true
    });
    event.currentTarget.dispatchEvent(trayEvent)
    this.state.jobNameTextFieldValue = "";
    event.preventDefault();
  }

  // save data to local
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
          currentTime: this.getCurrentHour(),
          jobName: this.state.jobNameTextFieldValue,
          jobTime: this.state.jobTime
        },
        bubbles: true
      });
      event.currentTarget.dispatchEvent(saveEvent);

      // count the total time of the current hour saved
      console.log("state before cur total", this.state.curTotal);
      console.log("state job time", this.state.jobTime);
      var curTotal = this.state.curTotal + this.state.jobTime;
      this.setState({curTotal: curTotal});
      console.log("state cur total", this.state.curTotal);
      console.log("after cur total", curTotal);
      // if the current saved total time is more than 1 hour 
      // we close the window

      // set the progress circle
      var slotCompletePerfectage = (curTotal > 1) ? 100 : curTotal * 100;
      this.setState({slotCompleted: slotCompletePerfectage});

      if(curTotal >= 1) {
          var trayEvent = new CustomEvent("putTray", { bubbles: true});
          event.currentTarget.dispatchEvent(trayEvent);
          this.setState({curTotal: 0});
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

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id="app">
          <div style={styles.header}>
            <AppBar
              title={<span style = { styles.title }> Timesheet </span>}
              />
          </div>
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
                 <div id="timeArrange" >{this.getCurrentHour()} </div>
              </ListItem>
          </List>
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
          
          <div style={styles.process}>
            <CircularProgress
                    mode="determinate"
                    value={this.state.slotCompleted}
                    size={35}
                    thickness={5}
                  />
          </div>

            <div style={styles.savebtn}>
              <RaisedButton id="saveBtn" label="Save" secondary={true} onClick={this.onSave}/>
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
