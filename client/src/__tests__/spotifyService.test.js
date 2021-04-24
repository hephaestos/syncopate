import spotifyService from '../spotifyService';

test('authorization should work', () => {
    spotifyService.authorize();
    expect(spotifyService.isAuth()).toBeTrue();
});

test('authorization should get tokens', () => {
    spotifyService.authorize();
    expect(spotifyService.getAccessToken()).toBeTruthy();
});

test('authorization should get id', () => {
    spotifyService.authorize();
    expect(spotifyService.getId()).toBeTruthy();
});
