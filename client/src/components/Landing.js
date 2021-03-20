import React, { Component } from "react";

class Landing extends Component{
    render() {
        return(
            <div className="bg">
                <div className="row">
                <div className="col">
                    <div className="header">
                    <div className="container-header">
                        <img src="logo.png" alt="logo" />
                        <h1>Syncopate</h1>
                    </div>
                    </div>
                </div>
                <div class="col">
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
                <p className="font-weight-normal">Click "Create Session" to log in through Spotify or
                    "Join Session" to join an existing room...
                </p>
                <button type="button" className="btn btn-outline-success btn-lg">Create Session</button>
                <button type="button" className="btn btn-outline-success btn-lg">Join Session</button>
                </div>
            </div>
        );
    }
}

export default Landing;