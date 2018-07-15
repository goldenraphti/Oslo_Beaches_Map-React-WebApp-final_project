 /* global google */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import BeachesList from './BeachesList'

class Home extends Component {
    
    state= {
        centerMap: {lat: 59.9028735, lng: 10.7248394},
        markers: [],
        beachesList:[{title: 'tjuvholmen', id:101, location: {lat: 59.906125, lng: 10.719755}},
                     {title: 'sørenga', id:102, location: {lat: 59.900957, lng: 10.751031}},
                     {title: 'hvervenbukta', id:103, location: {lat: 59.833907, lng: 10.77235}},
                     {title: 'langøyene', id:104, location: {lat: 59.871664, lng: 10.721499}},
                     {title: 'paradisbukta', id:105, location: {lat: 59.901971, lng: 10.665654}},
                     {title: 'hovedøya', id:106, location: {lat: 59.895011, lng: 10.725042}}
                    ],
        gMap: {}
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
        const map = new google.maps.Map(document.getElementById('map'), {
            center: this.state.centerMap,
            zoom: 13,
            styles: this.style.mapStyle,
        });
        
        const largeInfowindow = new google.maps.InfoWindow();
        
        this.generateMarkers(this.state.beachesList);
        this.showBeaches(map);
        this.setState({gMap:map});
    }

    generateMarkers = (locationsArray, map) => {
        
        let arrayMarkersForState = [];
        
        locationsArray.map( (location) => {

            // Get the position from the location array.
            const position = location.location;
            const title = location.title;
            // Create a marker per location, and put into markers array.
            const marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: location.id
            });


            // Push the marker to a new array of markers.
            arrayMarkersForState.push(marker);
            
//          // Create an onclick event to open the large infowindow at each marker.
//          marker.addListener('click', function() {
//            populateInfoWindow(this, largeInfowindow);
//          });
//            
//          // Two event listeners - one for mouseover, one for mouseout,
//          // to change the colors back and forth.
//          marker.addListener('mouseover', function() {
//            this.setIcon(highlightedIcon);
//          });
//          marker.addListener('mouseout', function() {
//            this.setIcon(defaultIcon);
//          });
        })
        
        this.setState({markers: arrayMarkersForState});
        
    }

      // This function will loop through the markers array and display them all.
    showBeaches = (gMap) => {
        const bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        this.state.markers.map( (marker) => {
            
          marker.setMap(gMap);
          bounds.extend(marker.position);
            
        });
        gMap.fitBounds(bounds);
      }

//      // This function populates the infowindow when the marker is clicked. We'll only allow
//      // one infowindow which will open at the marker that is clicked, and populate based
//      // on that markers position.
//    populateInfoWindow(marker, infowindow) {
//        // Check to make sure the infowindow is not already opened on this marker.
//        if (infowindow.marker == marker) {
//          // Clear the infowindow content to give the streetview time to load.
//          infowindow.setContent('');
//          infowindow.marker = marker;
//          // Make sure the marker property is cleared if the infowindow is closed.
//          infowindow.addListener('closeclick', function() {
//            infowindow.marker = null;
//          });
//          var streetViewService = new google.maps.StreetViewService();
//          var radius = 50;
//          // In case the status is OK, which means the pano was found, compute the
//          // position of the streetview image, then calculate the heading, then get a
//          // panorama from that and set the options
//          function getStreetView(data, status) {
//            if (status == google.maps.StreetViewStatus.OK) {
//              var nearStreetViewLocation = data.location.latLng;
//              var heading = google.maps.geometry.spherical.computeHeading(
//                nearStreetViewLocation, marker.position);
//                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
//                var panoramaOptions = {
//                  position: nearStreetViewLocation,
//                  pov: {
//                    heading: heading,
//                    pitch: 30
//                  }
//                };
//              var panorama = new google.maps.StreetViewPanorama(
//                document.getElementById('pano'), panoramaOptions);
//            } else {
//              infowindow.setContent('<div>' + marker.title + '</div>' +
//                '<div>No Street View Found</div>');
//            }
//          }
//          // Use streetview service to get the closest streetview image within
//          // 50 meters of the markers position
//          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
//          // Open the infowindow on the correct marker.
//          infowindow.open(map, marker);
//        }
//      }

    style = {
        
        mapStyle : [
            {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#e0efef"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#1900ff"
                    },
                    {
                        "color": "#c0e8e8"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 700
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#7dcdcd"
                    }
                ]
            }
        ]
    }

    filterBeaches = (selectedBeach) => {
        console.log('starting filterBeaches function','selectedBeach :', selectedBeach);
        console.log('allMarkers', this.state.markers);
        
        this.state.markers.map( (marker) => {
            marker.id == selectedBeach ? marker.setMap(this.state.gMap) : marker.setMap(null);
        })
        
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

                    <aside>
                        <BeachesList
                            beachesList={this.state.beachesList}
                            filterBeaches={this.filterBeaches}
                            showBeaches={this.showBeaches}
                            gMap={this.state.gMap}
                          />
                    </aside>
                </div>
                
            </div>

        )
    }

}

export default Home;