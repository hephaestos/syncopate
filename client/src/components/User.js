import React, { Component } from 'react'
import "./User.scss";
class User extends Component {
render(){
    return(
        <div className="User">
            <img id="profPic"src = {this.props.profPic}/>
            <p id="username">{this.props.username}</p>
        </div>
    )     
}
}

export default User;