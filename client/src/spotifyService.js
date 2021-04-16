const authUrl = 'https://accounts.spotify.com';
const authEndpoint = `${authUrl}/authorize`;
const clientId = 'f91290ac20d049f683b9dc9c7785fa21';
const redirectUri = 'http://localhost:3000';
const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
];
let token;
let isAuth = false;

export default {
    authEndpoint,
    clientId,
    redirectUri,
    scopes,
    isAuth() {
        return isAuth;
    },
    authorize() {
        if (!token) {
            token = localStorage.getItem('spotify_token');

            if (!token) {
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
                token = hash.access_token;
                if (token) {
                    localStorage.setItem('spotify_token', token);
                }
            }

            isAuth = !!token;
        }
    },
};
