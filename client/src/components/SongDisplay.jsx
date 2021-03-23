import React, { Component } from 'react'
class SongDisplay extends Component {
    render(){
        return(
            <div className="SongDisplay">
                <img id="albumArt" src={this.props.coverArt}/>
                <p id="songName">{this.props.songTitle}</p>
                <p id="artist">{this.props.artist}</p>
            </div>
        )
    }
}
export default SongDisplay;