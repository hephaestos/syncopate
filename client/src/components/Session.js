import Userbar from "./Userbar";
import Navbar from "./Navbar";
import Searchbar from "./Searchbar";
import SongDisplay from "./SongDisplay"
import Controls from "./Controls"
import React, { Component } from "react";

class Session extends Component{
    render() {
        return(
            <div className="Session">
                <Userbar />
                <Navbar />
                <SongDisplay coverArt={"./images/birthofthecool.jpg"} artist={"Miles Davis"} songTitle="Move"/>
                <Controls />
                <Searchbar />
            </div>
        );
    }
}

export default Session;
