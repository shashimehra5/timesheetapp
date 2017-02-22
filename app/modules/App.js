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
    paddingLeft: 200,
  },
  title: {
    textAlign: 'centre',
    cursor: 'pointer',
  },
  sheetTitle: {
    paddingLeft: 21,
  },
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

class JobNameField extends React.Component {
  constructor(props) {
    super(props)
    this.state = { errorText: '', value: props.value }
  }
  onChange(event) {
    if (event.target.value == "") {
      this.setState({ errorText: 'Empty Job Name' })
    } else {
      this.setState({ errorText: '' })
    }
  }
  render() {
    return (
      <TextField hintText="Job Number/Name"
        name="jobName"
        errorText= {this.state.errorText}
        onChange={this.onChange.bind(this)}
      />
    )
  }
}

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {jobTime:                1, 
                  errorText:             '', 
                  jobNameTextFieldValue: ''};
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.onJobNameChange = this.onJobNameChange.bind(this);
    this.onSave = this.onSave.bind(this);
  };
  
  handleDropDownChange (event, index, jobTime) {
      this.setState({jobTime: jobTime});
  };

  onJobNameChange(event) {
    if (event.target.value == "") {
      this.setState({ errorText: 'Empty Job Name' })
    } else {
      this.setState({ errorText: '',
                      jobNameTextFieldValue: event.target.value })
    }
  };

  onSave(event) {
    if(this.state.jobNameTextFieldValue == "") {
      this.setState({ errorText: 'Empty Job Name' })
    } else {
      this.setState({ errorText: '' })

      //dispatch a custom event to instruct electron put the main window into the tray
      // alert('A name was submitted: ' + event.currentTarget.nodeName);
      event.currentTarget.dispatchEvent(new Event('tray'))
      // alert('A name was submitted: ' + this.state.jobNameTextFieldValue);
    }
      event.preventDefault();
  }

  render() {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <div style={styles.header}>
                  <AppBar title={<span style={styles.title}>Timesheet</span>}  />
            </div>
            <div style={styles.container}>
                    <div>
                        <h3>Job</h3>
                    </div>
                    <TextField hintText="Job Number/Name"
                               name="jobName"
                               value={this.state.jobNameTextFieldValue}
                               errorText= {this.state.errorText}
                               onChange={this.onJobNameChange.bind(this)} />
                    <br />
                </div>
                <div>
                  <div style={styles.sheetTitle}>
                  <h3>Time</h3>
                  </div>
                  <div style={styles.time}>
                  <DropDownMenu value={this.state.jobTime} onChange={this.handleDropDownChange}>
                      <MenuItem value={1} primaryText="0.25" />
                      <MenuItem value={2} primaryText="0.5" />
                      <MenuItem value={3} primaryText="0.75" />
                      <MenuItem value={4} primaryText="1" />
                      <MenuItem value={5} primaryText="2" />
                      <MenuItem value={6} primaryText="3" />
                      <MenuItem value={7} primaryText="7.5" />
                  </DropDownMenu>
                  </div>

                  <div style={styles.savebtn}>
                    <RaisedButton id="saveBtn"  label="Save"  secondary={true} onClick={this.onSave}/>
                  </div>
                </div>
            </div>
        </MuiThemeProvider>
    );
  }
}

