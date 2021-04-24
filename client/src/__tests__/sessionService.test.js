import sessionService from '../sessionService';

test('null session id', () => {
    expect(sessionService.getSessionId()).toBeUndefined();
});

test('create session', () => {
    sessionService.createSession();
    expect(sessionService.getSessionId()).not.toBeUndefined();
});

test('join session', () => {
    sessionService.createSession();
    expect(sessionService.getUsers()).not.toBeUndefined();
});
