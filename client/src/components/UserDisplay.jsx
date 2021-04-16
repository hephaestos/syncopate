import React, { Component } from 'react';
import spotifyService from '../spotifyService';

/**
 * @component UserDisplay
 * @summary Displays the currently logged in user
 * @returns The UserDisplay component
 */
class UserDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: spotifyService.isAuth(),
        };
    }

    render() {
        const { isAuth } = this.state;
        if (isAuth) {
            return (
                <div className="header2">
                    <div className="container-header2">
                        <img src="..\images\spotify_icon.png" alt="spotify" />
                        <h1>User:</h1>
                        <h2>{spotifyService.getUserData()}</h2>
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default UserDisplay;
