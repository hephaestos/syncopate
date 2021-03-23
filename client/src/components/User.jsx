import React, { Component } from 'react'
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