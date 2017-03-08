import React from 'react'
import {Link} from 'react-router'

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {blue500, yellow600} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';

const styles = {
    mainDiv: {
        paddingLeft: 10
    },
    titleSpan: {
        width: 120,
        paddingLeft: 10,
        paddingTop: 10
    },
    titleDiv: {
        width: 300,
        paddingLeft: 10,
        paddingTop: 20
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
            controlledDate: null,
            listData: []
        };
        this.onDateSelect = this.onDateSelect.bind(this);
        this.onBack = this.onBack.bind(this);
    };

    componentDidMount() {
         window.addEventListener('onGenOverview', this.onGenOverview.bind(this));
    }

    onGenOverview(event) {
         var data = event.detail.data;
         console.log("on gen event", data);
         this.setState({listData: data});
    }

    createListItem(jobName, jobTime) {
        let comp =  (<ListItem leftAvatar={<Avatar icon={<ActionAssignment />} />} 
                               primaryText={jobName}
                               secondaryText={jobTime} />)
        console.log("create list item", comp);
        return comp;
    }

    createSubHeader(key) {
        let curTime = key["curTime"];
        var comp = <Subheader inset={true}>{curTime}</Subheader>
        console.log("subheader", comp);
        return comp
    }

    createSubList(value) {
        var jobDetails = value["jobDetails"];
        var comp = jobDetails.map(function(jobObj) {
                        console.log("map job details: ", jobObj);
                        this.createListItem(jobObj.jobName, jobObj.jobTime);
                    }.bind(this));
        console.log("gen sub list", comp);
        return comp;
    }

    createListSection(data) {
        console.log("create gen list:", this.state.listData);
        if(this.state.listData.length > 0) {
            // var comp =  this.state.listData.map(this.createSubHeader);
            let comp =  this.state.listData.map(this.createSubList.bind(this));
            console.log("component", comp);
            return comp;
        }
    }

    createList() {
        return <List> {this.createListSection()} </List>
    }

    onDateSelect(event, date) {
        this.setState({controlledDate: date});
        console.info("date:", date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
        var selyear = date.getUTCFullYear();
        var selmonth = date.getUTCMonth() + 1;
        var seldate = date.getUTCDate();
        var fullyear = selyear + '-' + selmonth + '-' + seldate;
        // dispatch event to renderer process that a new date has been selected
        var dateEvent = new CustomEvent("onDateSelected", {
            detail: {
                selectDate: fullyear
            },
            bubbles: true
        });
        var ov = this.refs.overview;
        ov.dispatchEvent(dateEvent)
    };

    onBack(event) {
        var backEvent = new CustomEvent("onBack", {bubbles: true});
        event.currentTarget.dispatchEvent(backEvent)
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div id="overview" ref="overview" style={styles.mainDiv}>
                    <div style={styles.titleDiv}>
                        <div style={styles.titleSpan}>
                            <RaisedButton
                                containerElement={< Link to = "/" />}
                                label="Back"
                                onClick={this.onBack}/>
                        </div>
                        <div style={styles.titleSpan}>
                            <DatePicker
                                id="datePicker"
                                hintText=" Select A Date to Display"
                                value={this.state.controlledDate}
                                onChange={this.onDateSelect}
                                container="inline"/>
                        </div>
                    </div>
                    <div id="jobList" ref="jobList">{this. createList()}</div>
                </div>
            </MuiThemeProvider>
        )
    }
}