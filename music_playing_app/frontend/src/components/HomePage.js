import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import{ Grid, Button, ButtonGroup, Typography } from "@material-ui/core";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: null
        };
    }

    componentDidMount = () => {
        // make an async call when the components is mounted to check if the user is currently in a session
        let accepted = false;
        fetch('/api/in-room')
            .then(response => {
                if (response.ok) {
                    accepted = true;
                }
                return response.json()
            })
            .then(data => {
                if (accepted) 
                    this.setState({code: data.code});
            });
    }



    renderHomePage() {
        return(
            <Grid container spacing={3} align="center">
                <Grid item xs={12}>
                    <Typography variant="h3">Music Player </Typography>
                </Grid>
                < Grid item xs={12}>
                    <ButtonGroup variant="contained" color="primary">
                        <Button color="primary" to='/join' component={Link}>Join Room</Button>
                        <Button color="secondary" to='/create' component={Link}>Create Room</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    render () {
        return (<Router>
            <Switch>
                <Route exact path = '/' render={() => { 
                    return(this.state.code == null ? this.renderHomePage(): 
                        <Redirect to={`/room/${this.state.code}`}/>)
                }}/>
                <Route path = '/join' component={RoomJoinPage}></Route>
                <Route path = '/create' component={CreateRoomPage}></Route>
                <Route path = '/room/:roomCode' component={Room}></Route>
            </Switch>
        </Router>
    );
    }

}