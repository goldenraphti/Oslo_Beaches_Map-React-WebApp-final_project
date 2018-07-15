import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

class CreditsPage extends Component {


    render() {
        return (

            <div id="credits">this is the credit page
                <ul>
                    <li>SnizzyMaps</li>
                    <li>React</li>
                    <li>Google Maps API</li>
                </ul>
            </div>

        )
    }

}

export default CreditsPage;