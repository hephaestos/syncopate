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
            <h3 className="UserBar__title">Users</h3>
            <hr />
            <User profPic="./images/logo.svg" username="Jacob Johnson" />
            <User profPic="./images/mips.png" username="Jacob Johnson" />
        </div>
    );
}

export default UserBar;
