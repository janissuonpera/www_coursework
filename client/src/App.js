import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Users from './Components/Users/users';
import LoginButton from './Components/Login/loginButton'
import CreateButton from './Components/CreateUser/createButton';
import MainMenu from './Components/Menu/mainMenu';

class App extends Component {
  state = {
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
  };

  componentDidMount(){

  }

  getJWT = (token) => {
    var jwt = require("jsonwebtoken");
    var decoded = jwt.decode(token);
    this.setState({token: token, username:decoded.username, role:decoded.role})
    localStorage.setItem("token", token);
    localStorage.setItem("username", decoded.username);
    localStorage.setItem("role", decoded.role);
  }

  logOut = () => {
    this.setState({
      token: null,
      username: null,
      role: null,
    })
  }

  render(){
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />

        <MainMenu token={this.state.token} username={this.state.username} role={this.state.role} logOut={this.logOut}/>

        <h1 style={{marginTop:"0px"}}>Welcome to <br/>the Movie Club <br/>homepage!</h1>

        {this.state.token===(null) ? <h2 style={{marginBottom:"5px"}}>If you already have an account, you can log in here:</h2> : null }
        {this.state.token===(null) ? <LoginButton getJWT={this.getJWT}/> : null}
        <br/>
        {this.state.token===(null) ? <h2 style={{marginBottom:"5px"}}>If you dont have an account, you can create one here:</h2> : null }
        {this.state.token===(null) ? <CreateButton/> : null}

      </div>
    );
  }
}

export default App;
