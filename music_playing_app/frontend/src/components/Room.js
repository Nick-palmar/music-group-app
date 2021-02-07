import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";

export default class Room extends Component {
    constructor(props) {
        super(props);
        // state to check votes, if the guest can pause and if the current user is a host
        this.state = {
            votesToSkip: null,
            guestCanPause: null,
            isHost: null
        }
        // by default react passes the match which gives you how you accessd the url; from there params can be taken
        this.code = this.props.match.params.roomCode;

        // get the room information
        this.getRoomInfo();
    }

    getRoomInfo = () => {
        // set up the get request url
        const reqUrl = `/api/get-room?code=${this.code}`;

        // send a fetch get request to the endpoints for information on the room and set the information in the state
        fetch(reqUrl)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    votesToSkip: json.votes_to_skip,
                    guestCanPause: json.guest_can_pause,
                    isHost: json.is_host
                })
            })
        }


    render() {
        return <>
            <Typography variant="h3">{'Code: ' + this.code}</Typography>
            <Typography variant="h6">{'Votes to skip: ' + this.state.votesToSkip}</Typography>
            <Typography variant="h6">{'Guest can pause: ' + this.state.guestCanPause}</Typography>
            <Typography variant="h6">{'Host: ' + this.state.isHost}</Typography>
        </>
    }
}