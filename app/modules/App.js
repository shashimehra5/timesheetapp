import React, {Component} from 'react'
import { Link } from 'react-router'

import RaisedButton from 'material-ui/RaisedButton';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class App extends Component {
  constructor(props, context) {
    super(props, context);
  };
  render() {
    return(
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <h1>Timesheet App</h1>
          <RaisedButton  label="Save"  secondary={true} />
        </div>
      </MuiThemeProvider>
    ) 
  }
}

export default App;
