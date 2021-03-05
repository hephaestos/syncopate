import React, { Component } from 'react'
import "./Searchbar.scss";
class Searchbar extends Component {
render () {
    return(
        <div className="Searchbar">
            <input type="text" placeholder="Search for a song"/>
        </div>
    )
}
}

export default Searchbar;