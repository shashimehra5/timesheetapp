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

// import electron from 'electron';

// const ipc = electron.ipcRenderer;

let trayOn = false;

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

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 1};
    this.handleChange = this.handleChange.bind(this);
    this.handleMinimize = this.handleMinimize.bind(this);
  };
  
  handleChange (event, index, value) {
      this.setState({value});
  };

  handleMinimize(e) {
    // if (trayOn) {
    //   trayOn = false
    //   ipc.send('remove-tray')
    // } else {
    //   trayOn = true
    //   ipc.send('put-in-tray')
    // }
  };

  // handleChange={(event, index, value) => this.setState({value})};
  render() {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <div style={styles.header}>
                  <AppBar title={<span style={styles.title}>Timesheet</span>}
                    iconElementRight={<FlatButton id="mini" label="--" primary={true} onTouchTap={this.handleMinimize}/>}  />
            </div>
            <div style={styles.container}>
                    <div>
                        <h3>Job</h3>
                    </div>
                    <TextField hintText="Job Number/Name"/>
                    <br />
                </div>
                <div>
                  <div style={styles.sheetTitle}>
                  <h3>Time</h3>
                  </div>
                  <div style={styles.time}>
                  <DropDownMenu value={this.state.value} onChange={this.handleChange}>
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
                    <RaisedButton  label="Save"  secondary={true} />
                  </div>
                </div>
            </div>
        </MuiThemeProvider>
    );
  }
}
