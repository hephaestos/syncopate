import React, { Component } from 'react'
import Logo from "./Logo"
class Navbar extends Component {
    render(){
        return(
            <div className="Navbar">
                <Logo />
                <h1>Syncopate</h1>
            </div>
        )
    }
}

export default Navbar;