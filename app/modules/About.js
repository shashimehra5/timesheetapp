import React from 'react'
import {Link} from 'react-router'

export default React.createClass({
    render() {
        return (
            <div> 
                <h2>About</h2>
                <ul>
                    <li><Link to='/about/reactjs/react-router'>React Router</Link></li>
                    <li><Link to="/about/facebook/react">React</Link></li>
                </ul> 
            </div>
        )
    }
})