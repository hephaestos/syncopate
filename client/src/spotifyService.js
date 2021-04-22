/* eslint-disable camelcase */
import sessionService from './sessionService';

let access_token;
let refresh_token;
let isAuth = false;
let id;

export default {
    getAccessToken() {
        return access_token;
    },
    getId() {
        return id;
    },
    isAuth() {
        return isAuth;
    },
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
