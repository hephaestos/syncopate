import React from 'react';

function Landing() {
    return (
        <div className="Landing">
            <div className="row">
                <div className="col">
                    <div className="header">
                        <div className="container-header">
                            <img src="..\images\logo.png" alt="logo" />
                            <h1>Syncopate</h1>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="header2">
                        <div className="container-header2">
                            <img src="..\images\spotify_icon.png" alt="spotify" />
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
                <button type="button" className="btn btn-outline-success btn-lg">Create Session</button>
                <button type="button" className="btn btn-outline-success btn-lg">Join Session</button>
            </div>
        </div>
    );
}

export default Landing;
