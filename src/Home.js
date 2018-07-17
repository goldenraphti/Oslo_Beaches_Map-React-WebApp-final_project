 /* global google */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import BeachesList from './BeachesList'
import InfoWindow from './InfoWindow'
import ReactDOM from 'react-dom';

class Home extends Component {
    
    state= {
        centerMap: {lat: 59.9028735, lng: 10.7248394},
        markers: [],
        beachesList:[{title: 'tjuvholmen', id:101, location: {lat: 59.906125, lng: 10.719755}},
                     {title: 'sørenga', id:102, location: {lat: 59.900957, lng: 10.751031}, foursquareID: '53c0f4fe498e2e581dceec59'},
                     {title: 'hvervenbukta', id:103, location: {lat: 59.833907, lng: 10.77235}},
                     {title: 'langøyene', id:104, location: {lat: 59.871664, lng: 10.721499}},
                     {title: 'paradisbukta', id:105, location: {lat: 59.901971, lng: 10.665654}},
                     {title: 'hovedøya', id:106, location: {lat: 59.895011, lng: 10.725042}}
                    ],
        gMap: {},
        largeInfoWindow: {} ,
        sidebarDisplayClass: 'aside-hidden',
        sidebarMenuText:'☰'
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
        
        this.addEventListenersForThePage();
    }

    addEventListenersForThePage = () => {

        const aside = document.getElementsByTagName('aside');
        
        // TODO: should I use 'click' or 'mousedown' ?
        document.getElementById("sidebar-hamburger").addEventListener('click', () => {
            // should toggle the class aside-hidden to hide or show the sidebar when clicking the hamburger button
            this.state.sidebarDisplayClass === '' ? this.setState({sidebarDisplayClass: 'aside-hidden'}) : this.setState({sidebarDisplayClass: ''});
            this.state.sidebarDisplayClass === '' ? this.setState({sidebarMenuText: '▶'}) : this.setState({sidebarMenuText: '☰'});
        });
    }

    initMap() {
        // Constructor creates a new map - only center and zoom are required.
        const map = new google.maps.Map(document.getElementById('map'), {
            center: this.state.centerMap,
            zoom: 13,
            styles: this.style.mapStyle,
        });
        
        this.generateMarkers(this.state.beachesList, this.populateInfoWindow);
        this.showBeaches(map);
        this.setState({gMap:map});
    }

    generateMarkers = (locationsArray, populateInfoWindow, largeInfoWindow) => {
        
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
            
                    
            const setlargeInfoWindow = new google.maps.InfoWindow();
            this.setState({largeInfoWindow : setlargeInfoWindow });
            
          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this);
          });
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

      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
    populateInfoWindow = (marker) => {
        
        //in the future want to externalize the fcontent of the infoWindow in a separate component
        const InfoWindowComponent = <InfoWindow marker={marker} />;
        
        const infowindow = this.state.largeInfoWindow;
        
        
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            
            // starts fetching and filling content for inside infow window
            console.log(this.fillContentInInfoWindow(marker));
            
            // TODO: retrieves infos from the fillContentInInfoWindow to insert it inside the window, such as photo + name author + from forsquare and link
            console.log()
            
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(this.state.gMap, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick',function(){
                infowindow.marker = null;
            });
        }
    }

    // fetch the content from API for corresponding beach, and return it to be used inside infoWindow
    fillContentInInfoWindow = (marker) => {
                
        // will need to insert venue ID, date
        fetch(`https://api.foursquare.com/v2/venues/${this.getVenueID(marker)}/photos?&client_id=ILWSI2AZCVIV23EZ4ARYGUTDGD0KQGSFLMYAYUIXSBRUQCUM&client_secret=L1KGWTLJ3UIGVRWKA2HX2WATFNPBZFVM4RTKQMRRINLQCDHV&v=${this.getTodayDateYYYYMMSS()}`)
        .then(response => response.json() )
        .then(response => {
            console.log(response);
            console.log(this.foursquareSyntaxResponse(response));
        })
        .catch(err => console.log(err))
        
    }
    
    getTodayDateYYYYMMSS = () => {
        
        const todaysDate = new Date();

        var yyyy = todaysDate.getFullYear().toString();
        var mm = (todaysDate.getMonth()+1).toString();
        var dd  = todaysDate.getDate().toString();

        var mmChars = mm.split('');
        var ddChars = dd.split('');

        return yyyy + (mmChars[1]?mm:"0"+mmChars[0]) + (ddChars[1]?dd:"0"+ddChars[0]);
    }
    
    getVenueID = (marker) => {
        
        let clickedVenueID;
                
        this.state.beachesList.map( (beach) => {
            // take the clicked marker, compare its id to the beaches of beachesList, and retrieve the corresponding Foursquare venueID
            marker.title == beach.title ? clickedVenueID = beach.foursquareID : null;
        })
        return clickedVenueID;
    }
    
    foursquareSyntaxResponse = (response) => {
        
        let foursquareInfos = {
            photo:'',
            author:''
        };
        
        const firstPhoto = response.response.photos.items[0];
        const responsePrefix = (response) => firstPhoto.prefix;
        const responseSuffix = (response) => firstPhoto.suffix;
        const responseSizeHeight = (response) => firstPhoto.height;
        const responseSizeWidth = (response) => firstPhoto.width;
        
        foursquareInfos.photo = responsePrefix(response) + responseSizeWidth(response) + 'x' + responseSizeHeight(response) + responseSuffix(response);
        
        foursquareInfos.author = firstPhoto.user.firstName + ' ' + firstPhoto.user.lastName;
        
        return foursquareInfos;
    }
    
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
        
        this.state.markers.map( (marker) => {
            // keep the == and not === since depending of if click on select or in list it will return the id in string or number, so must be a flexible equality, no strict equaity
            marker.id == selectedBeach ? marker.setMap(this.state.gMap) : marker.setMap(null);
            
        })
        
    }

    render() {
        return (
            <div id="home-container">
                
                <nav>
                    <h1>Oslo Best Summer Beaches</h1>
                    
                <h3 id="sidebar-hamburger" className="link menu">{this.state.sidebarMenuText}</h3>
                    
                </nav>
                <div id="container-map-sidebar">
                    
                    <div id="map"></div>

                    <aside  className={this.state.sidebarDisplayClass}>
                        <BeachesList
                            beachesList={this.state.beachesList}
                            filterBeaches={this.filterBeaches}
                            showBeaches={this.showBeaches}
                            gMap={this.state.gMap}
                          />
                    <div className="open-search">
                        <Link to="/credits">Credits</Link>
                    </div>
                    </aside>
                </div>
                
            </div>

        )
    }

}

export default Home;