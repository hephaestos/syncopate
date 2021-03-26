class SpotifyService {
    constructor() {
        this.authEndpoint = 'https://accounts.spotify.com/authorize';
        this.clientId = 'f91290ac20d049f683b9dc9c7785fa21';
        this.redirectUri = 'http://localhost:3000';
        this.scopes = [
            'streaming',
            'user-read-email',
            'user-read-private',
        ];
    }

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

        this.token = hash.access_token;
    }
}

export default SpotifyService;
