/**
 * @author Brandon T, Taylor R., Remy M., Jacob J., Daniel F.
 * @version 0.0.1
 * @description Provides spotify functionality to components.
 */
import sessionService from './sessionService';

/** Access token for the Spotify API */
let access_token;
/** Refresh token for obtaining a new access token */
let refresh_token;
/** Whether the auth flow has been completed or not */
let isAuth = false;
/** Spotify ID of the current user */
let id;

export default {
    /**
     * @summary Getter for access token
     * @returns Spotify access token
     */
    getAccessToken() {
        return access_token;
    },

    /**
     * @summary Getter for access token
     * @returns Spotify access token
     */
    getId() {
        return id;
    },

    /**
     * @summary Getter for access token
     * @returns Spotify access token
     */
    isAuth() {
        return isAuth;
    },

    /**
     * @summary Gets the Spotify token from the url and retrieves the users id
     */
    authorize() {
        if (!access_token) {
            access_token = localStorage.getItem('spotify_access_token');

            if (!access_token) {
                const hash = window.location.hash
                    .substring(1)
                    .split('&')
                    .reduce((initial, item) => {
                        const out = initial;
                        if (item) {
                            const parts = item.split('=');
                            out[parts[0]] = decodeURIComponent(parts[1]);
                        }
                        return out;
                    }, {});

                window.location.hash = '';
                access_token = hash.access_token;
                refresh_token = hash.refresh_token;
                if (access_token) {
                    localStorage.setItem('spotify_access_token', access_token);
                }
                if (refresh_token) {
                    localStorage.setItem('spotify_refresh_token', refresh_token);
                }
            }

            isAuth = !!access_token;
        }
        if (isAuth) {
            sessionService.getSpotifyId(access_token, (res) => {
                id = res;
                console.log(id);
            });
        }
    },
};
