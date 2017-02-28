import React from 'react'
import { Link } from 'react-router'

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

const styles = {
  header: {
    textAlign: 'center',
    paddingTop: 0,
  },
  container: {
    textAlign: 'left',
    paddingTop: 20,
    paddingLeft: 20,
  },
  time: {
    width: 250,
  },
  savebtn: {
    paddingTop: 50,
    paddingLeft: 150,
  },
  title: {
    textAlign: 'centre',
    cursor: 'pointer',
  },
  sheetTitle: {
    paddingTop:30,
    paddingLeft: 21,
  },
  btnSpan: {
	  paddingLeft:10,
  }
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
    textColor: cyan500,
  },
  appBar: {
    height: 50,
  },
});

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { jobTime: 0.15, errorText: '', jobNameTextFieldValue: '', currentHour: '9am'};
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.onJobNameChange = this.onJobNameChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOverview = this.onOverview.bind(this);
	  this.onSave = this.onSave.bind(this);
	  this.getCurrentHour = this.getCurrentHour.bind(this);
  };

  getCurrentHour () {
	var currentdate = new Date();
	var hours = currentdate.getHours(); 
	var hours = (hours+24)%24; 
	var mid='am';
	if(hours==0){
	    hours=12;
	} else if(hours>12) {
	    hours=hours%12;
	    mid='pm';
	}
  
  var premid='am';
  var preHour = currentdate.getHours() - 1;
  if(preHour==0){
	    preHour=12;
	} else if(preHour>12) {
	    preHour=preHour%12;
	    premid='pm';
	}

	var curHour = preHour + premid + '-' + hours + mid;
	return curHour;
  }
  
  handleDropDownChange (event, index, jobTime) {
      this.setState({jobTime: jobTime});
  };

  onJobNameChange(event) {
    if (event.target.value == "") {
      
    } else {
      this.setState({ errorText: '', jobNameTextFieldValue: event.target.value })
    }
  };

onClose(event) {
    this.setState({ errorText: '' })

    //dispatch a custom event to instruct electron put the main window into the tray
    var trayEvent = new CustomEvent("putTray", { detail: { 
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
	if(this.state.jobNameTextFieldValue == "") {
      this.setState({ errorText: 'Empty Job Name' })
	} else {
      this.setState({ errorText: '' })
      var date = new Date();
      var selyear = date.getUTCFullYear();
      var selmonth = date.getUTCMonth()+1;
      var seldate = date.getUTCDate();
      var fullyear = selyear +'-'+ selmonth+'-'+seldate;
	    var saveEvent = new CustomEvent("onSave", { detail: {
		    currentDate: fullyear,
        currentTime: this.getCurrentHour(),
		    jobName: this.state.jobNameTextFieldValue, 
		    jobTime: this.state.jobTime
		},
    bubbles: true
	  });
	event.currentTarget.dispatchEvent(saveEvent)
    }
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
                  <AppBar title={<span style={styles.title}>Timesheet</span>} 
                                       iconElementRight={<FlatButton containerElement={<Link to="/overview" />} 
                                                                     label="Overview"/>} onClick={this.onOverview}/>
            </div>
            <div style={styles.container}>
                    <div>
                        <h3>Job</h3>
                    </div>
                    <TextField hintText="Job Number/Name"
                               name="jobName"
							   id="jobNameField"
                               value={this.state.jobNameTextFieldValue}
                               errorText= {this.state.errorText}
                               onChange={this.onJobNameChange.bind(this)} />
                    <br />
                </div>
                <div>
                  <div style={styles.sheetTitle}>
                    <h3 id="timeArrange">Time @ {this.getCurrentHour()}</h3>
                  </div>
                  <div style={styles.time}>
                  <DropDownMenu value={this.state.jobTime} onChange={this.handleDropDownChange}>
                      <MenuItem value={0.15} primaryText="0.15" />
					  <MenuItem value={0.20} primaryText="0.20" />
                      <MenuItem value={0.30} primaryText="0.30" />
                      <MenuItem value={0.45} primaryText="0.45" />
                      <MenuItem value={1} primaryText="1" />
                  </DropDownMenu>
                  </div>

            <div style={styles.savebtn}>
				  	  <span style={styles.btnSpan}>
				  		  <RaisedButton id="saveBtn"  label="Save"  secondary={true} onClick={this.onSave}/>
					    </span>
					    <span style={styles.btnSpan}>
                  <RaisedButton id="closeBtn"  label="Close"  secondary={true} onClick={this.onClose}/>
					    </span>
            </div>
          </div>
        </div>
        </MuiThemeProvider>
    );
  }
}

