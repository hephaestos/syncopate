import React from 'react';
import User from './User';

/**
 * @component UserBar
 * @summary A sidbar displaying all the users in the current session
 * @returns The Userbar component
 */
function UserBar() {
    return (
        <div className="UserBar">
            <h3 className="UserBar__title">Room Code:</h3>
            <h2 className="roomCode">4 bit 9d api+e+6 </h2>
            <hr />
            <User profPic="./images/logo.svg" username="Jacob Johnson" />
            <User profPic="./images/mips.png" username="Jacob Johnson" />
        </div>
    );
}

export default UserBar;
