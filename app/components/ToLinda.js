import React from 'react'
import {Link} from 'react-router'

import { DateRange } from 'react-date-range';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {blue500, yellow600} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    mainDiv: {
        paddingLeft: 10,
        paddingTop: 10,
        textColor: blue500
    }
};

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: yellow600,
        textColor: blue500
    },
    appBar: {
        height: 50
    }
});

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null
        };
        this.onDateRangeSelect = this.onDateRangeSelect.bind(this);
        this.onSend = this.onSend.bind(this);
    };


    onDateRangeSelect(range) {
        var startDateObj = range.startDate;
        var endDateObj = range.endDate;
        var startDate = startDateObj.year() + '-' + startDateObj.month() + '-' + startDateObj.date();
        var endDate = endDateObj.year() + '-' + endDateObj.month() + '-' + endDateObj.date();
        this.setState({startDate: startDate, endDate: endDate});
        console.log(startDate, endDate);
    }

    onSend(event) {

        var dateRangeEvent = new CustomEvent("onSendLinda", {
            detail: {
                startDate: this.state.startDate,
                endDate: this.state.endDate
            },
            bubbles: true
        });
        var tolinda = this.refs.tolinda;
        tolinda.dispatchEvent(dateRangeEvent);
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div id="tolinda" ref="tolinda" style={styles.mainDiv}>
                    <div>
                        <div>
                            <RaisedButton containerElement={< Link to = "/" />}
                                          label="Back" 
                                          onClick={this.onEmailBack}/>
                        </div>
                        <p>Select a date range and send to Linda:</p>
                        <div>
                             <DateRange onInit={this.onDateRangeSelect} 
                                       onChange={this.onDateRangeSelect}
                                       calendars={1}/>
                        </div>
                    </div>
                    <div>
                        <FlatButton id="sendLinda" 
                                    ref="sendLinda" 
                                    label="Send to Linda" 
                                    onClick={this.onSend}/>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}