import React from 'react';

function SongDisplay({ coverArt, songTitle, artist }) {
    return (
        <div className="SongDisplay">
            <img id="albumArt" alt="Album Art" src={coverArt} />
            <p id="songName">{songTitle}</p>
            <p id="artist">{artist}</p>
        </div>
    );
}

export default SongDisplay;
