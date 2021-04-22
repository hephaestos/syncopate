import React from 'react';

/**
 * @component SpotifyAuth
 * @summary Redirects the user to spotify to log authorize their account
 * @returns The SpotifyAuth component
 */
function SpotifyAuth() {
    return (
        <a
            href="http://localhost:4000/login"
        >
            <button
                type="button"
                className="btn btn-lg btn-outline-success login-btn"
            >
                Login to Spotify
            </button>
        </a>
    );
}

export default SpotifyAuth;
