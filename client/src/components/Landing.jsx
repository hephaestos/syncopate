import React from 'react';
import LoginButtons from './LoginButtons';
import UserDisplay from './UserDisplay';

/**
 * @component Landing
 * @summary The landing page when users first come to the site
 * @description This landing page provides the ability to log in to your spotify account,
 * and then create or join a session
 * @returns The Landing component
 */
function Landing() {
    return (
        <div className="Landing">
            <div className="row">
                <div className="col">
                    <div className="header">
                        <div className="container-header-sm">
                            <img src="..\images\logo.png" alt="logo" />
                            <h1>Syncopate</h1>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <UserDisplay />
                </div>
            </div>
            <div className="container-buttons-lg">
                <p className="font-weight-normal">Listen to Spotify together from anywhere in the world.</p>
                <p className="font-weight-normal">
                    Click below to log in through Spotify and get started listening
                    with all of your friends...
                </p>
                <LoginButtons />
            </div>
        </div>
    );
}

export default Landing;
