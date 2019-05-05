import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

//Component for rendering a list of users
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

  //Uses fetch post to send user login data to REST API. Receives JWT as response
  //and stores it in the local storage.
  handleLogIn = (e) => {
    var data = {username: this.state.username, password: this.state.password}
    e.preventDefault();
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(response => {
      this.setState({JWT:response.JWT})
      console.log("JWT saved to local storage");
      localStorage.setItem("token", response.JWT);
      if(response.Error){
        alert("Log in failed. Please, try again!");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Log in failed. Please, try again!");
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
        <DialogTitle id="form-dialog-title">Log in</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To log into the movie club site, please enter your log in information!
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
          <Button onClick={this.handleLogIn} color="primary">
            Log in
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
  }
}

export default LoginView;
