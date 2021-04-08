import React from 'react';

/**
 * @component User
 * @param username The name to display for the user
 * @param profilePic The profile picture of the user
 * @example <User username="Lionel Richie" profilePic="../image/allnight.jpg" />
 * @returns The User component
 */
function User({ username, profPic }) {
    return (
        <div className="User">
            <img id="profPic" alt="User Profile" src={profPic} />
            <p id="username">{username}</p>
        </div>
    );
}

export default User;
