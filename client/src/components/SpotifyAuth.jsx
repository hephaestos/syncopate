import React from 'react';
import spotifyService from '../spotifyService';

/**
 * @component SpotifyAuth
 * @summary Redirects the user to spotify to log authorize their account
 * @returns The SpotifyAuth component
 */
function SpotifyAuth() {
    return (
        <a
            href={`${spotifyService.authEndpoint}?client_id=${spotifyService.clientId}&redirect_uri=${spotifyService.redirectUri}&scope=${spotifyService.scopes.join('%20')}&response_type=token&show_dialog=true`}
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
