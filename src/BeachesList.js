import React from 'react'
import './App.css'

const BeachesList = (props) => {

    const beachesList = props.beachesList;
    
    const filterBeaches = props.filterBeaches;
    
    return (

        <form id="beaches-list">
                <h2>Beach list</h2>
                <select onChange={e => filterBeaches(e.target.value)}  aria-label="Filter the beach selecting one in this dropdown menu" tabindex="-1" id="filter-beach-dropdown" name="filter-beach-dropdown" value="select-beach">
                   <option value="select-beach" disabled>{props.dropdownText}</option>
                   {beachesList.map( (beach) => (
                        <option value={beach.id} key={beach.id}>{beach.title}</option>
                    ))}
                </select>
                <ul>
                    {beachesList.map( (beach) => (
                        <li key={beach.id}  onClick={e => filterBeaches(beach.id)} ><a href="#">{beach.title}</a>                                                                                                                                                                                                            </li>
                    ))}
                </ul>
            <div id="clear-filters" className="link" role="button" onClick={e => props.showBeaches(props.gMap)} ><a href="#">Show them all</a></div>
        </form>

    )

}

export default BeachesList;