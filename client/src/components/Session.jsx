import React from 'react';
import Userbar from './Userbar';
import SongDisplay from './SongDisplay';

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
            <div className="container-fluid fill">
                <div className="row">
                    {/* <div className="col"><Navbar /></div> */}
                </div>
                <div className="row">
                    <div className="col col-1 d-none d-md-block"><Userbar /></div>
                    <div className="col col-12 col-md-11"><SongDisplay songTitle="Move" artist="Miles Davis" coverArt="/images/birthofthecool.jpg" /></div>
                </div>
            </div>
        </div>
    );
}

export default Session;
