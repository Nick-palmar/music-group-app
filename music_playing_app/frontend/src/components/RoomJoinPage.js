import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typedCode: "",
            error: ""
        };
    }

    handleWriteCode = (e) => {
        // change the typed code to the value inputted by the person
        this.setState({ 
            typedCode: e.target.value
        })
    }

    handleJoinRoomClicked = () => {
        // the person has entered a 6 digit code to join a room
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                code: this.state.typedCode
            })
        };

        // send a post request to the backend 
        fetch('/api/join-room', requestOptions)
            .then(response => {
                if (response.ok) {
                    // room code was valid; redirect to the room
                    this.props.history.push(`/room/${this.state.typedCode}`)
                } else {
                    // there was an error
                    this.setState({error: "Room not found"})
                }
            })
    }

    render () {
        return (
            <Grid container spacing={2} align="center">
                <Grid item xs={12}>
                    <Typography variant="h4">
                        Join a room
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        error={this.state.error !== ""}
                        label="Code"
                        placeholder="Enter your code"
                        type="text"
                        value={this.state.typedCode}
                        helperText={this.state.error === "" ? "Must be a 6 digit code": this.state.error}
                        variant="outlined"
                        onChange={this.handleWriteCode}
                    />
                </Grid>
                <Grid container spacing={10} direction="column" alignItems="center">
                    <Grid item xs={6}>
                        <Button
                            color="primary" 
                            variant="contained"
                            disabled={this.state.typedCode.length !== 6}
                            onClick={this.handleJoinRoomClicked}>
                            Join room   
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            color="secondary" 
                            variant="contained"
                            to = "/"
                            component={Link}>
                                Return home
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

}