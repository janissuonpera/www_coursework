import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class ProfileView extends Component {
  constructor(props){
    super(props);
    var username = this.props.username;
    var role = this.props.role;
    this.state = {
      username: username || "",
      password: "",
      role: role || "",
      cardname: "",
      cardnum: "",
      expdate: "",
      cvv: "",
    }
  }


  //Handle changes in text fields
  handleTextChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  //Update username to db
  changeUsername = (e) => {
    var data = {username: this.state.username}
    e.preventDefault();
    fetch('/api/users/'+this.props.username, {
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
      this.props.updateData(this.state.username);
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Update failed! Please, try again!");
    });
  }

  //Update new password to db
  changePassword = (e) => {
    var data = {password: this.state.password}
    e.preventDefault();
    fetch('/api/users/'+this.props.username, {
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
      this.props.updateData(this.state.username);
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Update failed! Please, try again!");
    });
  }

  payFee = () =>{
    var data = {cardname: this.state.cardname,
                cardnum: this.state.cardnum,
                expdate: this.state.expdate,
                cvv: this.state.expdate}

    fetch('/api/users/'+this.props.username, {
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
      this.props.updateData(this.state.username);
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Update failed! Please, try again!");
    });
  }

  deleteUser = () => {
    fetch('/api/users/'+this.props.username, {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token
      }
    })
    .then(res => res.json())
    .then(response => {
      alert(response.message);
      this.props.logOut();
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Update failed! Please, try again!");
    });
  }

  render(){
    return (
      <div>
        <TextField
          margin="dense"
          id="username"
          label="Username"
          type="text"
          value={this.state.username}
          onChange={this.handleTextChange}
        />
        <Button
              variant="contained"
              color="primary"
              style={{marginTop:"25px", marginLeft:"5px"}}
              onClick={this.changeUsername}
            >
              Change username
        </Button>
        <br/>
        <TextField
          margin="dense"
          id="password"
          label="Password"
          type="password"
          value={this.state.password}
          onChange={this.handleTextChange}
        />
        <Button
              variant="contained"
              color="primary"
              style={{marginTop:"25px", marginLeft:"5px"}}
              onClick={this.changePassword}
            >
              Change password
        </Button>
        <br/>
        <h2>Your current role is {this.state.role}</h2>
        {this.props.payed ? <h2>You have payed your membership fee.</h2> : <h2>You have NOT payed your membership fee.</h2>}
        <br/>
        <div hidden={this.props.payed}>
          <TextField
            margin="dense"
            id="cardname"
            label="Name on card"
            type="text"
            value={this.state.cardname}
            onChange={this.handleTextChange}
          />
          <br/>
          <TextField
            margin="dense"
            id="cardnum"
            label="Card number"
            type="text"
            value={this.state.cardnum}
            onChange={this.handleTextChange}
          />
          <br/>
          <TextField
            margin="dense"
            id="expdate"
            label="Expiry date"
            type="text"
            value={this.state.expdate}
            onChange={this.handleTextChange}
          />
          <br/>
          <TextField
            margin="dense"
            id="cvv"
            label="cvv"
            type="text"
            value={this.state.cvv}
            onChange={this.handleTextChange}
          />
          <br/>
          <Button
                variant="contained"
                color="primary"
                style={{marginTop:"25px", marginLeft:"5px"}}
                onClick={this.payFee}
              >
                Pay now
          </Button>
        </div>
        <Button
              variant="contained"
              color="secondary"
              style={{marginTop:"25px", marginLeft:"5px"}}
              onClick={this.deleteUser}
            >
              DELETE USER
        </Button>
      </div>
    );
  }
}

export default ProfileView;
