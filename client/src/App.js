import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Users from './Components/Users/users';

class App extends Component {
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Users />
      </header>
      </div>
    );
  }
}

export default App;
