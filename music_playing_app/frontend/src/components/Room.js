import React, { Component } from "react";

export default class Room extends Component {
    constructor(props) {
        super(props);
        // state to check votes, if the guest can pause and if the current user is a host
        this.state = {
            votesToSkip: null,
            guestCanPause: null,
            isHost: null
        }
        
    }

    render() {
        return <>
            
        </>
    }
}