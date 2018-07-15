import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

const BeachesList = (props) => {

    const beachesList = props.beachesList;
    
    const filterBeaches = props.filterBeaches;
    
    return (

        <form id="beaches-list">
                <h2>Beach list</h2>
                <select onChange={e => filterBeaches(e.target.value)}  aria-label="Filter the beach selecting one in this dropdown menu" id="filter-beach-dropdown" name="filter-beach-dropdown" value="select-beach">
                   <option value="select-beach" disabled>Select a beach...</option>
                   {beachesList.map( (beach) => (
                        <option value={beach.id} key={beach.id}>{beach.title}</option>
                    ))}
                </select>
                <ul>
                    {beachesList.map( (beach) => (
                        <li key={beach.id}  onClick={e => filterBeaches(beach.id)} >{beach.title}</li>
                    ))}
                </ul>
                <div id="clear-filters" onClick={e => props.showBeaches(props.gMap)} >Show them all</div>
        </form>

    )

}

export default BeachesList;