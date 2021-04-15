import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import spotifyService from '../spotifyService';
import SpotifyAuth from './SpotifyAuth';

/**
 * @component LoginButtons
 * @summary Displays spotify login and, after logging in, join and create session buttons
 * @returns The LoginButtons component
 */
class LoginButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: spotifyService.isAuth(),
        };
    }

    componentDidMount() {
        if (!spotifyService.isAuth()) {
            spotifyService.authorize();
            this.setState(() => ({
                isAuth: spotifyService.isAuth(),
            }));
        }
    }

    render() {
        const { isAuth } = this.state;
        if (isAuth) {
            return (
                <div className="LoginButtons">
                    <button type="button" className="btn btn-outline-success btn-lg">Create Session</button>
                    <Link to="/session"><button type="button" className="btn btn-outline-success btn-lg">Join Session</button></Link>
                </div>
            );
        }
        return (
            <div className="LoginButtons">
                <SpotifyAuth />
            </div>
        );
    }
}

export default LoginButtons;
