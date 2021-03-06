import React, { Component } from "react";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, Collapse } from "@material-ui/core"
import { Link } from "react-router-dom"
import { Alert } from '@material-ui/lab'
// import Button from "@material-ui/core/Button";
// import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
// import FormHelperText from "@material-ui/core/FormHelperText";
// import FormControl from "@material-ui/core/FormControl";
// import Radio from "@material-ui/core/Radio";
// import RadioGroup from "@material-ui/core/RadioGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";

export default class CreateRoomPage extends Component {
    defaultVotes = 2;
    constructor(props) {
        super(props);
        // create state variables for the input fields in create room depending on if update mode or not
        if (!this.props.update) {
            this.state = {
                guestCanPause: null,
                votesToSkip: this.defaultVotes,
                valid: false,
                title: 'Create a Room',
                errorMsg: "",
                successMsg: ""
            };
        }
        else {
            this.state = {
                guestCanPause: this.props.guestCanPause,
                votesToSkip: this.props.votesToSkip,
                valid: true,
                title: 'Update Room',
                errorMsg: "",
                successMsg: ""
            };
        }
    }

    // create an async function to check votes validity after set state
    handleVotesChange = async(e) => {
        // change the state when the votes are changed
        await this.setState({votesToSkip: e.target.value});
        
        // check if the current form is valid
        this.checkValid();
    }

    // create an async function to check guests validity after set state
    handleGuestsPauseChange = async(e) => {
        // change the state when the guest pauses
        await this.setState({guestCanPause: e.target.value === 'true' ? true: false})

        // log to console to check
        this.checkValid();
    }

    checkValid = () => {
        // check if the current form is valid
        if (this.state.votesToSkip != "" && this.state.guestCanPause !== null) {
            this.setState({valid: true});
        }
        // form is not valid
        else {
            this.setState({valid: false});
        }
    }

    handleCreateRoomClicked = () => {
        // ensure that there is sufficent data to create a room
        if (this.state.valid) {
        // make the request object and ensure that they match the serializer in the endpoints
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        }

        // send a fetch request to the api endpoint and redirect to the correct room page
        fetch('/api/create-room', requestOptions)
            .then(response => response.json())
            .then(data => this.props.history.push(`/room/${data.code}`));

        }
        
    }

    renderCreateButtons = () => {
        // show these buttons on create a room 
        return (
            <Grid container spacing={1} align="center">
                <Grid item xs={12}>
                    <Button 
                        color="primary" 
                        variant="contained" 
                        disabled={!this.state.valid}
                        onClick={this.handleCreateRoomClicked}>
                            Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button color="secondary" variant="contained" to='/' component={Link}>Return home</Button>
                </Grid>
            </Grid>
            );
    }

    renderUpdateButtons = () => {
        // show this button on update room 
        return (
            <Grid item xs={12}>
                    <Button 
                        color="primary" 
                        variant="contained" 
                        disabled={!this.state.valid}
                        onClick={this.handleUpdateRoomClicked}>
                            Update Room
                    </Button>
            </Grid>
        );
    }

    handleUpdateRoomClicked = () => {
         // ensure that there is sufficent data to update a room
         if (this.state.valid) {
            // make the request object and ensure that they match the serializer in the endpoints
            const requestOptions = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    votes_to_skip: this.state.votesToSkip,
                    guest_can_pause: this.state.guestCanPause, 
                    code: this.props.roomCode
                })
            }
    
            // send a fetch request to the api endpoint and redirect to the correct room page
            fetch('/api/change-settings', requestOptions)
                .then(response => {
                    if (response.ok) {
                        this.setState({ successMsg : "Room updated successfully"})
                    } 
                })
                .then(data => {
                    if (this.state.successMsg !== "Room updated successfully") {
                        this.setState({ errorMsg: data })
                    }
                    // refresh the info on the room page
                    this.props.updateCallback();
                });
    
            }
    }

    render () {
        return <Grid container spacing={1} alignItems="center" direction="column"> 
            <Grid item xs={12}>
                <Collapse in={this.state.errorMsg !== "" || this.state.successMsg !== ""} timeout={0}>
                    {this.state.successMsg !== "" ? 
                    (<Alert severity='success' onClose={() => this.setState({ successMsg: "" })}>{this.state.successMsg}</Alert>) 
                    : 
                    (<Alert severity='error' onClose={() => this.setState({ errorMsg: ""})}>{this.state.errorMsg}</Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h4'>
                    {this.state.title}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div>
                            Guest Controls of Playback State (Required)
                        </div>
                    </FormHelperText>
                    <RadioGroup 
                        row 
                        onChange={this.handleGuestsPauseChange} 
                        defaultValue={this.state.guestCanPause === null ? null: this.state.guestCanPause.toString()}
                    >
                        <FormControlLabel 
                            value="true" 
                            control={<Radio color="primary" />} 
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel 
                            value="false" 
                            control={<Radio color="secondary" />} 
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl>
                    <TextField 
                        type="number" 
                        defaultValue={this.defaultVotes} 
                        inputProps={{
                            min: 1,
                            max: 10,
                            style: { textAlign: 'center' }
                        }}
                        onChange={this.handleVotesChange}
                        value={this.state.votesToSkip}
                        error={this.votesToSkip === ""}
                    />
                    <FormHelperText>
                        <div>
                            Votes Required To Skip Song (Required)
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
                <Button 
                    color="primary" 
                    variant="contained" 
                    disabled={!this.state.valid}
                    onClick={this.handleCreateRoomClicked}>
                        Create A Room
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button color="secondary" variant="contained" to='/' component={Link}>Return home</Button>
            </Grid> */}
            {this.props.update? this.renderUpdateButtons() : this.renderCreateButtons()}
        </Grid>;
    }

}