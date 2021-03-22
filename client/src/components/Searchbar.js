import React, { Component } from 'react'
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