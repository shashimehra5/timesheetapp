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
    width: 50,
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
  };
  handleChange (event, index, value) {
      this.setState({value});
  };

  // handleChange={(event, index, value) => this.setState({value})};
  render() {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <div style={styles.header}>
                  <AppBar title={<span style={styles.title}>Timesheet</span>}
                    iconElementRight={<FlatButton label="Save" />}  />
            </div>
            <div style={styles.container}>
                    <div>
                        <h3>Job</h3>
                    </div>
                    <TextField hintText="Job Number/Name"/>
                    <br />
                    {/*<RaisedButton  label="Save"  primary={true} />*/}
                </div>
                <div>
                  <div style={styles.sheetTitle}>
                  <h3>Time</h3>
                  </div>
                  <div style={styles.time}>
                  <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                      <MenuItem value={1} primaryText="0.25 hour" />
                      <MenuItem value={2} primaryText="0.5 hour" />
                      <MenuItem value={3} primaryText="0.75 hour" />
                      <MenuItem value={4} primaryText="1 hour" />
                      <MenuItem value={4} primaryText="1.5 hours" />
                      <MenuItem value={5} primaryText="2 hours" />
                      <MenuItem value={6} primaryText="2.5 hours" />
                      <MenuItem value={7} primaryText="3 hours" />
                      <MenuItem value={8} primaryText="3.5 hours" />
                      <MenuItem value={9} primaryText="4 hours" />
                      <MenuItem value={10} primaryText="4.5 hours" />
                      <MenuItem value={11} primaryText="5 hours" />
                      <MenuItem value={12} primaryText="5.5 hours" />
                      <MenuItem value={13} primaryText="6 hours" />
                      <MenuItem value={14} primaryText="6.5 hours" />
                      <MenuItem value={15} primaryText="7 hours" />
                      <MenuItem value={16} primaryText="7.5 hours" />
                  </DropDownMenu>
                  </div>
                </div>
            </div>
        </MuiThemeProvider>
    );
  }
}
