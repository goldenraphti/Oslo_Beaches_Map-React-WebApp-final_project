import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

const BeachesList = (props) => {

    const beachesList = props.beachesList;
    
    return (

        <div id="beaches-list">
                <h2>Beach list</h2>
                <select>
                    <option>Sørenga</option>
                    <option>Tjuvholmen</option>
                    <option>Paradisbukta</option>
                    <option>Langøyene</option>
                    <option>Hvervenbukta</option>
                </select>
                <ul>
                    {beachesList.map( (beach) => (
                        <li key={beach}>{beach}</li>
                    ))}
                </ul>
        </div>

    )

}

export default BeachesList;