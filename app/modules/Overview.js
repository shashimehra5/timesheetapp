import React from 'react'
import {Link} from 'react-router'

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500, yellow600} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    mainDiv: {
	    paddingLeft: 10,
    },
    titleSpan: {
        width: 120,
	    paddingLeft:10,
        paddingTop:10,
    },
    titleDiv: {
        width: 300,
	    paddingLeft: 10,
        paddingTop:20,
    }
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: yellow600,
    textColor: blue500,
  },
  appBar: {
    height: 50,
  },
});

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { controlledDate: Date()};
    this.onDateSelect = this.onDateSelect.bind(this);
    this.onBack = this.onBack.bind(this);
  };

  onDateSelect(event, date) {
    this.setState({
      controlledDate: date,
    });
    console.info("date:", date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate());
    var selyear = date.getUTCFullYear();
    var selmonth = date.getUTCMonth()+1;
    var seldate = date.date.getUTCDate();
    var fullyear = selyear +'-'+ selmonth+'-'+seldate;
    // dispatch event to renderer process that a new date has been selected
    var dateEvent = new CustomEvent("onDateSelected", {detail: {selectDate: fullyear}, bubbles: true});
	event.currentTarget.dispatchEvent(backEvent)
  };

  onBack(event) {
    var backEvent = new CustomEvent("onBack", {bubbles: true});
	event.currentTarget.dispatchEvent(backEvent)
  }

  render() {
        return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div id="overview" style={styles.mainDiv}>
                <div style={styles.titleDiv}>
                    <div style={styles.titleSpan}>
                        <RaisedButton containerElement={<Link to="/" />} label="Back" onClick={this.onBack}/>
                    </div>
                    <div style={styles.titleSpan}>
                        <DatePicker id="datePicker" 
                                    hintText=" Select A Date to Display"
                                    value={this.state.controlledDate}
                                    onChange={this.onDateSelect} />
                    </div>
                </div>
                <div id="jobList">
                  
                </div>
            </div>
        </MuiThemeProvider>
        )
    }
}