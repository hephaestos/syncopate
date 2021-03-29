import React from 'react';
import Userbar from './Userbar';
import Navbar from './Navbar';
import Searchbar from './Searchbar';
import SongDisplay from './SongDisplay';
import Controls from './Controls';

function Session() {
    return (
        <div className="Session">
            <Userbar />
            <Navbar />
            <SongDisplay coverArt="./images/birthofthecool.jpg" artist="Miles Davis" songTitle="Move" />
            <Controls />
            <Searchbar />
        </div>
    );
}

export default Session;
