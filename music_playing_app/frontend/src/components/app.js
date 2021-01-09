import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";

export default class App extends Component {
    // constructor for a react component
    constructor(props) {
        super(props);
    }

    // render to screen
    render() {
        return (
            <div>
                <HomePage />
            </div>
            
        );
    }
}

// get the app div which is stored in index.html
const appDiv = document.getElementById("app");

// render this app component to index.html
render(<App />, appDiv);