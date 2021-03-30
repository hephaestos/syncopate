import React from 'react';
import Userbar from './Userbar';
import Navbar from './Navbar';
import Searchbar from './Searchbar';
import SongDisplay from './SongDisplay';
import Controls from './Controls';

/**
 * @component Session
 * @summary The session page once a user has joined/created a session
 * @description Provides the user with the abiltity to listen to a song
 * Contains the {@link Userbar}, {@link Navbar}, {@link SongDisplay},
 * {@link Controls}, and {@link Searchbar} components
 * @returns The Session component
 */
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
