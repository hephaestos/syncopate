import React from 'react';

function SpotifyAuth({ spotifyService }) {
    return (
        <button
            type="button"
            className="btn login-btn"
            href={`${spotifyService.authEndpoint}?client_id=${spotifyService.clientId}&redirect_uri=${spotifyService.redirectUri}&scope=${spotifyService.scopes.join('%20')}&response_type=token&show_dialog=true`}
        >
            Login to Spotify
        </button>
    );
}

export default SpotifyAuth;
