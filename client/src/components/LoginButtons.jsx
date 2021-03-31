/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import spotifyService from '../spotifyService';
import SpotifyAuth from './SpotifyAuth';

/**
 * @component LoginButtons
 * @summary Displays spotify login and, after logging in, join and create session buttons
 * @returns The LoginButtons component
 */
function LoginButtons() {
    /*
    if (spotifyService.isAuth) {
        return (
            <div className="LoginButtons">
                <button type="button" className="btn btn-outline-success btn-lg">Create Session</button>
                <button type="button" className="btn btn-outline-success btn-lg">Join Session</button>
            </div>
        );
    }
    return (
        <div className="LoginButtons">
            <SpotifyAuth />
        </div>
    );
    */
    return (
        <div className="LoginButtons">
            <SpotifyAuth />
            <button type="button" className="btn btn-outline-success btn-lg">Create Session</button>
            <Link to="/session"><button type="button" className="btn btn-outline-success btn-lg">Join Session</button></Link>
        </div>
    );
}

export default LoginButtons;
