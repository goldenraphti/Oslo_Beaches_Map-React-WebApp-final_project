import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import Home from './Home'
import CreditsPage from './CreditsPage'

class App extends Component {
    render() {
        return (
          <div className="app">

                 <Route exact  path="/" render={() => (
                    <Home />
                )} />

                <Route path="/credits" render={() => (
                    <CreditsPage />
                )} />
          </div>
        )
    }
}

export default App;


