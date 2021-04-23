import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import Userbar from './Userbar';
import Searchbar from './Searchbar';
import spotifyService from '../spotifyService';

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
                    <div className="col col-xs-9">
                        <SpotifyPlayer
                            token={spotifyService.getAccessToken()}
                            uris={['spotify:track:4cOdK2wGLETKBW3PvgPWqT']}
                            autoPlay
                        />
                    </div>
                    <div className="col col-md-2 col-xs-3"><Searchbar /></div>
                </div>
            </div>
        </div>
    );
}

export default Session;
