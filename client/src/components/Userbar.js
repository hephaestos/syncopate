import React, { Component } from 'react'
import User from "./User"
class UserBar extends Component {
    render() {
        return (
            <div className="UserBar">
                <h3 className="UserBar__title">Users</h3>
                <hr></hr>
                <User profPic={"./images/logo.svg"} username={"Jacob Johnson"}/>
                <User profPic={"./images/mips.png"} username={"Jacob Johnson"}/>
            </div>
        )
    }
}

export default UserBar;