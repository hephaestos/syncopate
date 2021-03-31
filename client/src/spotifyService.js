const authEndpoint = 'https://accounts.spotify.com/authorize';
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
    isAuth,
    authorize() {
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

        // eslint-disable-next-line no-unused-vars
        token = hash.access_token;
        isAuth = true;
    },
};
