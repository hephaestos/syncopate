import React from 'react';

function User({ username, profPic }) {
    return (
        <div className="User">
            <img id="profPic" alt="User Profile" src={profPic} />
            <p id="username">{username}</p>
        </div>
    );
}

export default User;
