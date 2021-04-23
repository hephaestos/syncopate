/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import spotifyService from '../spotifyService';
import sessionService from '../sessionService';
import SpotifyAuth from './SpotifyAuth';
import Form from './Form';
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
            show: false,
        };
        this.createSession = this.createSession.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
    }

    componentDidMount() {
        if (!spotifyService.isAuth()) {
            spotifyService.authorize();
            this.setState(() => ({
                isAuth: spotifyService.isAuth(),
            }));
        }
        console.log(spotifyService.getAccessToken());
    }

    toggleForm() {
        const { show } = this.state;
        this.setState({ show: !show });
    }

    createSession() {
        sessionService.createSession();
    }

    render() {
        const { isAuth, show } = this.state;
        if (isAuth) {
            return (
                <div className="LoginButtons">
                    <Link to="/session"><button type="button" onClick={this.createSession} className="btn btn-outline-success btn-lg">Create Session</button></Link>
                    <button type="button" onClick={this.toggleForm} className="btn btn-outline-success btn-lg">Join Session</button>
                    {show && <Form />}
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
