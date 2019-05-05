import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class LoginView extends Component {
  constructor(){
    super();
    this.state = {
      open: false,
      username: "",
      password: "",
      JWT: ""
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  //Uses fetch post to send new user data to REST API. Receives JWT as response
  //and stores it in the local storage.
  handleJoin = (e) => {
    var data = {username: this.state.username, password: this.state.password}
    e.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(response => {
      if(response.status!==200){
        alert("User creation failed. Please, try again!");
      }
      if(response.message === "New user created!"){
        alert("User created successfully!");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("User creation failed. Please, try again!");
    });
    this.handleClose();
  }

  handleTextChange = (e) => {
    this.setState({[e.target.id]: e.target.value });
  }

  render(){
    return (
      <div>
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To join the movie club site, please enter your desired information!
          </DialogContentText>
          <TextField
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            value={this.state.username}
            onChange={this.handleTextChange}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            value={this.state.password}
            onChange={this.handleTextChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleJoin} color="primary">
            Create user
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
  }
}

export default LoginView;
