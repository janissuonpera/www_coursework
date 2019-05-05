import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AdminView extends Component {
  constructor(props){
    super(props);
    var username = this.props.username;
    var role = this.props.role;
    this.state = {
      open: false,
      username: username || "",
      password: "",
      role: role || "",
      users: [],
      pos: -1
    }
  }

  componentDidMount(){
    fetch('/api/users')
    .then(res => res.json())
    .then(response => {
      this.setState({
        users: response.users
      });
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Fetch failed! Please, try again!");
    });
  }


  //Handle changes in text fields
  handleTextChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  //Update username to db
  changeUsername = () => {
    var data = {username: this.state.username}
    fetch('/api/users/'+this.state.users[this.state.pos].username, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token
      }
    })
    .then(res => res.json())
    .then(response => {
      alert(response.message);
      this.setState({
        users: this.state.users.map((user, i) => {
          if(i===this.state.pos){
            user.username = this.state.username
          } return user;
        })
      })
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Update failed! Please, try again!");
    });
  }

  //Update new password to db
  changeRole = () => {
    var data = {role: this.state.role}
    fetch('/api/users/'+this.state.users[this.state.pos].username, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token
      }
    })
    .then(res => res.json())
    .then(response => {
      alert(response.message);
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Update failed! Please, try again!");
    });
  }

  handleOpen = username => {
    var pos = this.state.users.map(user=>{return user.username}).indexOf(username);
    this.setState(
      {
        open: true,
        pos: pos,
        username:this.state.users[pos].username,
        role: this.state.users[pos].role
      });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleEdit = () => {
    this.changeUsername();
    this.changeRole();
    this.handleClose();
  }

  deleteUser = username => {
    var pos = this.state.users.map(user=>{return user.username}).indexOf(username);
    fetch('/api/users/'+this.state.users[pos].username, {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token
      }
    })
    .then(res => res.json())
    .then(response => {
      alert(response.message);
      this.setState({
        users: this.state.users.filter((_, i) => i !== pos)
      });
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Update failed! Please, try again!");
    });
  }

  render(){
    const users = this.state.users.map(user=>{
      return <li style={{marginBottom:"40px"}}key={user.username}>
                <b>Username:</b> {user.username}
                <Button
                      variant="contained"
                      color="primary"
                      style={{marginTop:"5px", marginLeft:"10px"}}
                      onClick={()=>this.handleOpen(user.username)}
                    >
                      Edit user
                </Button>
                <Button
                      variant="contained"
                      color="secondary"
                      style={{marginTop:"5px", marginLeft:"10px"}}
                      onClick={()=>this.deleteUser(user.username)}
                    >
                      DELETE USER
                </Button>
             </li>
    })
    return (
      <div>
        <ul>
          {users}
        </ul>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit user</DialogTitle>
          <DialogContent>
            <DialogContentText>
              In this dialog, you can edit users' information!
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
              id="role"
              label="Role"
              type="text"
              fullWidth
              value={this.state.role}
              onChange={this.handleTextChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleEdit} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AdminView;
