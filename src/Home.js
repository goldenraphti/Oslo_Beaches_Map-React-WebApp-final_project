 /* global google */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactDOM from 'react-dom'
import './App.css'
import BeachesList from './BeachesList'
import GmapStyle from './GmapStyle'

//const gm_authFailure = err => console.log('yaaay');

class Home extends Component {
    
    state= {
        centerMap: {lat: 59.9028735, lng: 10.7248394},
        markers: [],
        beachesList:[{title: 'tjuvholmen', id:101, location: {lat: 59.906125, lng: 10.719755} , foursquareID : '522ef63211d25e58949693a2'},
                     {title: 'sørenga', id:102, location: {lat: 59.900957, lng: 10.751031}, foursquareID: '53c0f4fe498e2e581dceec59'},
                     {title: 'hvervenbukta', id:103, location: {lat: 59.833907, lng: 10.77235} , foursquareID: '4bcae6c1937ca5939f9ca892'},
                     {title: 'langøyene', id:104, location: {lat: 59.871664, lng: 10.721499} , foursquareID: '4b0588b5f964a52046d522e3'},
                     {title: 'paradisbukta', id:105, location: {lat: 59.901971, lng: 10.665654} , foursquareID: '4b86892bf964a520788e31e3'},
                     {title: 'hovedøya', id:106, location: {lat: 59.895011, lng: 10.725042} , foursquareID: '4c31b9a1213c2d7f2652345d'}
                    ],
        gMap: {},
        largeInfoWindow: {} ,
        sidebarDisplayClass: 'aside-hidden',
        sidebarMenuText:'☰',
        markerToDisplay:{},
        dropdownText:'',
        gMapDisplayClasses: {
            altClass: 'hidden',
            gMapClass: ''
        }
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
        this.getGoogleMaps()
            .then((google) => {
                this.initMap();
            })
        
        this.addEventListenersForThePage();
        this.updateDropdownMenu();
        
        this.checkifGoogleMapsReached();
    }

    addEventListenersForThePage = () => {
        
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
            styles: < GmapStyle />,
        });
        
        this.generateMarkers(this.state.beachesList, this.populateInfoWindow);
        this.showBeaches(map);
        this.setState({gMap:map});
        
        // execute following ONLY if reached GooGleMaps (does not matter if authentification worked or failed)
        // display the google map only if google map was reached
        //place the function here if want to execute a function only if initMap as executed while, i.e if Google Maps was reach (but not necesarily authetificated)
        this.checkifGoogleMapsReached();
        
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
        this.updateDropdownMenu();
    }

      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
    populateInfoWindow = (marker) => {
        
        const infowindow = this.state.largeInfoWindow;
        
        
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            
            // starts fetching and filling content for inside infow window
            const contentFromFoursquare = this.fetchContentFromFoursquare(marker);
            
            this.setState({markerToDisplay: marker});

        }
    }
    
    acessibilityLaunchPopulateInfoWindow = (beach) => {
        
        this.state.markers.map( marker =>{
            marker.id === beach.beach.id ? this.populateInfoWindow(marker) : null ;
        })
        
    }

    // fetch the content from API for corresponding beach, and return it to be used inside infoWindow
    fetchContentFromFoursquare = (marker) => {
                
        // will need to insert venue ID, date
        fetch(`https://api.foursquare.com/v2/venues/${this.getVenueID(marker)}/photos?&client_id=ILWSI2AZCVIV23EZ4ARYGUTDGD0KQGSFLMYAYUIXSBRUQCUM&client_secret=L1KGWTLJ3UIGVRWKA2HX2WATFNPBZFVM4RTKQMRRINLQCDHV&v=${this.getTodayDateYYYYMMSS()}`)
        .then(response => response.json() )
        .then(response => {
            this.fillInfoWindow(this.foursquareSyntaxResponse(response));
        })
        .catch(err => {
            console.log(err);
            this.fillInfowWindowFetchFailure();
        })
        
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
    
    fillInfoWindow = (contentFromFoursquare) => {
                    
            const marker = this.state.markerToDisplay;
            // retrieves infos from the fetchContentFromFoursquare to insert it inside the window, such as photo + name author + from forsquare and link
            const title = '<h4>' + marker.title + '</h4>';
            const photoContent = `<img class="image-info-window" src=${contentFromFoursquare.photo} alt="photo from ${marker.title}beach, from Foursquare, taken by ${contentFromFoursquare.author}">`;
            const author = `<p>by ${contentFromFoursquare.author}</p>`;
            const link = '<a href="https://foursquare.com">from Foursquare</a>';
            const contentToAdd = title + photoContent + author + link;
        
            const infowindow = this.state.largeInfoWindow;
            
            infowindow.setContent('<div class="info-window">' + contentToAdd  + '</div>');
            infowindow.open(this.state.gMap, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick',function(){
                infowindow.marker = null;
            });
    }
    
    fillInfowWindowFetchFailure = () => {
        
                    
            const marker = this.state.markerToDisplay;
            // retrieves infos from the fetchContentFromFoursquare to insert it inside the window, such as photo + name author + from forsquare and link
            const title = '<h4>' + marker.title + '</h4>';
//            const link = '<a href="foursquare.com">from Foursquare</a>';
            const text = '<p class="failure-info-text">For some technical issues, the content could not be loaded from <a href="foursquare.com">Foursquare</a>, sorry for the unconvenience</p>';
        
            const infowindow = this.state.largeInfoWindow;
            
            infowindow.setContent('<div class="info-window">' + text  + '</div>');
            infowindow.open(this.state.gMap, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick',function(){
                infowindow.marker = null;
            });
    } 

    filterBeaches = (selectedBeach) => {
        
        this.state.markers.map( (marker) => {
            // keep the == and not === since depending of if click on select or in list it will return the id in string or number, so must be a flexible equality, no strict equaity
            marker.id == selectedBeach ? marker.setMap(this.state.gMap) : marker.setMap(null);
            marker.id == selectedBeach ? marker.animation = google.maps.Animation.BOUNCE : null;
            marker.id == selectedBeach ? this.populateInfoWindow(marker) : null;
        })
        
        this.updateDropdownMenu();
        
    }
    
    updateDropdownMenu = () => {
        
        let selectedBeach = this.state.markers.filter(marker => marker.map !== null);
        selectedBeach.length === 1 ? this.setState({dropdownText:selectedBeach[0].title}) : this.setState({dropdownText:'Select a beach...'});
        
    }
    
        // tests if init map has produced a map, even a not connected one. If not, degrade gracefully + console log the error   
    checkifGoogleMapsReached = () => {
        window.setTimeout( () => {
            
            // if keys length > 0, it means google maps was reached, so hide error message and display map
            Object.keys(this.state.gMap).length > 0 ? this.planGoogleMapsReached() : null;
            // if keys length === 0, it means google maps was not (yet ?) reached, so display error message, and console log problem
            Object.keys(this.state.gMap).length === 0 ? this.planGoogleMapsNotReached() : null;
        }, 1000);

    }
    
    planGoogleMapsReached = () => {
        Object.keys(this.state.gMap).length > 0 && this.state.gMapDisplayClasses.altClass === 'flex' && this.state.gMapDisplayClasses.gMapClass === 'hidden'? this.setState({gMapDisplayClasses :  { altClass: 'hidden', gMapClass: ''}}) : null;
    }
    
    planGoogleMapsNotReached = () => {
        this.setState({gMapDisplayClasses :  { altClass: 'flex', gMapClass: 'hidden'}});
        console.log('Google Maps API could not be reached, it seems to be a network problem')
    }
    
    gm_authFailure = () => {

        // not working, should try to find other ways to identify and select dom element with reactjs
        document.getElementById('gmap-fail-alternative').setAttribute('class', 'flex');
        document.getElementById('map').setAttribute('class', 'hidden');
        console.log('The app could not connect to google');

    };
    

    render() {
        return (
            <div id="home-container">
                
                <nav>
                    <h1>Oslo Best Summer Beaches</h1>
                    
                <button id="sidebar-hamburger" aria-label="Opens up or hide sidebar to filter beaches" tabIndex="0" className="link menu">{this.state.sidebarMenuText}</button>
                    
                </nav>
                <div id="container-map-sidebar">
                    
                    <div id="gmap-fail-alternative" className={this.state.gMapDisplayClasses.altClass}>
                        <p>Sorry for the unconvenience. <br/>We could not import the map from Google Maps API, for some unfortunate reasons. You can try to refresh the page. If the problem persists, please reach us and we'll ensure to fix it up as soon as possible.</p>
                    </div>
                   
                    <div id="map" className={this.state.gMapDisplayClasses.gMapClass}>
                    </div>

                    <aside  className={this.state.sidebarDisplayClass}>
                        <BeachesList
                            beachesList={this.state.beachesList}
                            filterBeaches={this.filterBeaches}
                            showBeaches={this.showBeaches}
                            gMap={this.state.gMap}
                            dropdownText={this.state.dropdownText}
                            acessibilityLaunchPopulateInfoWindow={this.acessibilityLaunchPopulateInfoWindow}
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