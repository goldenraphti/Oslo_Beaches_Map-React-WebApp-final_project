 /* global google */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import BeachesList from './BeachesList'

class Home extends Component {
    
    state= {
        centerMap: {lat: 28.291564, lng: -16.62913},
        beachesList:['sørenga', 'tjuvholmen', 'hvervenbukta', 'langøyene', 'paradisbukta'],
    }

    getGoogleMaps() {
        // If we haven't already defined the promise, define it
        if (!this.googleMapsPromise) {
            this.googleMapsPromise = new Promise((resolve) => {
                // Add a global handler for when the API finishes loading
                window.resolveGoogleMapsPromise = () => {
                    // Resolve the promise
                    resolve(google);

                    // Tidy up
                    delete window.resolveGoogleMapsPromise;
                };

                // Load the Google Maps API
                const script = document.createElement("script");
                const API = 'AIzaSyDbAz1XXxDoKSU2nZXec89rcHPxgkvVoiw';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
                script.async = true;
                document.body.appendChild(script);
            });
        }

        // Return a promise for the Google Maps API
        return this.googleMapsPromise;
    }

    componentWillMount() {
        // Start Google Maps API loading since we know we'll soon need it
        this.getGoogleMaps();
    }

    componentDidMount() {
        // Once the Google Maps API has finished loading, initialize the map
        this.getGoogleMaps().then((google) => {
            this.initMap();
        });
    }

    initMap() {
        // Constructor creates a new map - only center and zoom are required.
        let map = new google.maps.Map(document.getElementById('map'), {
            center: this.state.centerMap,
            zoom: 9,
//            styles: styleMap,
        });
    }

    filterMarkers() {
        console.log('filterMarkers function executing');
    }

    render() {
        return (
            <div id="home-container">
                
                <nav>
                    <h1>Oslo Best Summer Beaches</h1>
                    
{ /* this is just a test, but must be re-placed inside the side bar, at its bottom, besire a link for Rferrand.com */ }
                    <div className="open-search">
                        <Link to="/credits">Credits</Link>
                    </div>
                    
                </nav>
                <div id="container-map-sidebar">
                    
                    <div id="map"></div>

                    <sidebar>
                        <BeachesList beachesList={this.state.beachesList} />
                    </sidebar>
                </div>
                
            </div>

        )
    }

}

export default Home;