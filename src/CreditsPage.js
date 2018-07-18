import React, { Component } from 'react'
import './App.css'

class CreditsPage extends Component {


    render() {
        return (

            <div id="credits">
               <h2>Credits</h2>
               <p>Web-app built by <a href="https://rferrand.com">Raphaël Ferrand</a>, during the <a href="https://udacity.com">Udacity</a> front-end web development nanodegree
                <br/>To build up this web-app we have used several resources, so thank you to for their resources, libraries, or API:</p>
                   <ul>
                    <li>Google map color style from <a href="https://snazzymaps.com/">SnazzyMaps</a></li>
                    <li>Web app composed using <a href="https://reactjs.org/">React</a></li>
                    <li>Maps using <a href="https://cloud.google.com/maps-platform/">Google Maps API</a></li>
                    <li><a href="https://cloud.google.com/maps-platform/">Photos from <a href="https://foursquare.com">Foursquare</a> and its users</a></li>
                </ul>
            </div>

        )
    }

}

export default CreditsPage;