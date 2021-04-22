/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import sessionService from '../sessionService';
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
        this.createSession = this.createSession.bind(this);
    }

    componentDidMount() {
        if (!spotifyService.isAuth()) {
            spotifyService.authorize();
            this.setState(() => ({
                isAuth: spotifyService.isAuth(),
            }));
        }
        console.log(spotifyService.access_token);
        console.log(spotifyService.refresh_token);
    }

    createSession() {
        sessionService.createSession();
        return <Redirect to="/session/" />;
    }

    render() {
        const { isAuth } = this.state;
        if (isAuth) {
            return (
                <div className="LoginButtons">
                    <Link to="/session"><button type="button" onClick={this.createSession} className="btn btn-outline-success btn-lg">Create Session</button></Link>
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
