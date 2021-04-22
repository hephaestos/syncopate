import React from 'react';
import Controls from './Controls';
/**
 * @component SongDisplay
 * @summary Displays the album art, title, and artist of the current song
 * @returns The SongDisplay component
 */
function SongDisplay({ coverArt, songTitle, artist }) {
    return (
        <div className="SongDisplay">
            <img id="albumArt" alt="Album Art" src={coverArt} />
            <p id="songName">{songTitle}</p>
            <p id="artist">{artist}</p>
            <Controls />
        </div>
    );
}

export default SongDisplay;
