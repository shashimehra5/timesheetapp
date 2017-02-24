import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './modules/App';
import Overview from './modules/Overview';

injectTapEventPlugin();

// render(<Router/>, document.getElementById('app'))

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
        <Route path="/overview" component={Overview}/>
    </Router>
),document.getElementById('content'));