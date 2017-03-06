import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './modules/App';
import Overview from './modules/Overview';
import ToLinda from './modules/ToLinda';
import 'todomvc-app-css/index.css'

injectTapEventPlugin();

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
        <Route path="/overview" component={Overview}/>
        <Route path="/toLinda" component={ToLinda}/>
    </Router>
),document.getElementById('content'));