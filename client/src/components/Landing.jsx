import React from 'react';
import LoginButtons from './LoginButtons';

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
                        <div className="container-header">
                            <img src="logo.png" alt="logo" />
                            <h1>Syncopate</h1>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="header2">
                        <div className="container-header2">
                            <img src="spotify_icon.png" alt="spotify" />
                            <h1>User:</h1>
                            <h2>test_user</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-buttons">
                <p className="font-weight-normal">Listen to Spotify together from anywhere in the world.</p>
                <p className="font-weight-normal">
                    Click &quot;Create Session&quot; to log in through Spotify or
                    &quot;Join Session&quot; to join an existing room...
                </p>
                <LoginButtons />
            </div>
        </div>
    );
}

export default Landing;
