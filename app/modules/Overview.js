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
    this.state = { controlledDate: null};
    this.onDateSelect = this.onDateSelect.bind(this);
  };

  onDateSelect(event, date) {
    this.setState({
      controlledDate: date,
    });
  };

  render() {
        return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div id="overview" style={styles.mainDiv}>
                <div style={styles.titleDiv}>
                    <div style={styles.titleSpan}>
                        <RaisedButton containerElement={<Link to="/" />} label="Back"/>
                    </div>
                    <div style={styles.titleSpan}>
                        <DatePicker hintText=" Select A Date to Display"
                                    value={this.state.controlledDate}
                                    onChange={this.onDateSelect} />
                    </div>
                </div>
            <List>
                <Subheader inset={true}>10am</Subheader>
                <ListItem
                  leftAvatar={<Avatar icon={<ActionAssignment />} />}
                  primaryText="ZZFF9998"
                  secondaryText="0.15"
                />
                <ListItem
                  leftAvatar={<Avatar icon={<ActionAssignment />} />}
                  primaryText="ZZFF9999"
                  secondaryText="0.35"
                />
                <ListItem
                  leftAvatar={<Avatar icon={<ActionAssignment />} />}
                  primaryText="ZZFF9990"
                  secondaryText="0.20"
                />
            <Subheader inset={true}>11am</Subheader>
                <ListItem
                  leftAvatar={<Avatar icon={<ActionAssignment />} />}
                  primaryText="ZZFF9998"
                  secondaryText="0.15"
                />
                <ListItem
                  leftAvatar={<Avatar icon={<ActionAssignment />} />}
                  primaryText="ZZFF9999"
                  secondaryText="0.35"
                />
                <ListItem
                  leftAvatar={<Avatar icon={<ActionAssignment />} />}
                  primaryText="ZZFF9990"
                  secondaryText="0.20"
                />
            </List>
            
            
            </div>
        </MuiThemeProvider>
        )
    }
}