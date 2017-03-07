import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
// import { createStore } from 'redux'
// import { Provider } from 'react-redux'

import App from './containers/App';
import Overview from './components/Overview';
import ToLinda from './components/ToLinda';

injectTapEventPlugin();

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
        <Route path="/overview" component={Overview}/>
        <Route path="/toLinda" component={ToLinda}/>
    </Router>
),document.getElementById('content'));