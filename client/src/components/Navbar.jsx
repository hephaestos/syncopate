import React from 'react';
import Logo from './Logo';

/**
 * @component Navbar
 * @summary The navigation at the top of the session
 * @description Contains the logo, title, and any navigation functions
 * @returns The Navbar component
 */
function Navbar() {
    return (
        <div className="Navbar">
            <Logo />
            <h1>Syncopate</h1>
        </div>
    );
}

export default Navbar;
