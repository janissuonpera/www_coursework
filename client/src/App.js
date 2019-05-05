import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Users from './Components/Users/users';
import LoginButton from './Components/Login/loginButton'

class App extends Component {
  render(){
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 style={{marginTop:"0px"}}>Welcome to <br/>the Movie Club <br/>homepage!</h1>

        <h2>If you already have an account, you can log in here:</h2>
        <LoginButton />
      </div>
    );
  }
}

export default App;
