import React from 'react';

/**
 * @component Searchbar
 * @summary Lets the user search for songs
 * @returns The Searchbar component
 */
function Searchbar() {
    return (
        <div className="Searchbar">
            <input type="text" placeholder="Search for a song" />
        </div>
    );
}

export default Searchbar;
