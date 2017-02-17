import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import App from './modules/App';
// import About from './modules/About';
// import AboutMe from './modules/AboutMe';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// render(<Router/>, document.getElementById('app'))

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
    </Router>
),document.getElementById('content'));