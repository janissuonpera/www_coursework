import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginButton from './Components/Login/loginButton'
import CreateButton from './Components/CreateUser/createButton';
import MainMenu from './Components/Menu/mainMenu';
import MovieView from './Components/Movies/movieView';
import ProfileView from './Components/Profile/profileView';
import AdminView from './Components/AdminPage/adminView';

class App extends Component {
  state = {
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
    membership_payed: localStorage.getItem("payed"),
    view: "frontpage"
  };

  componentDidMount(){

  }

  //Gets JWT token from log in button / log in view
  getJWT = (token) => {
    var jwt = require("jsonwebtoken");
    var decoded = jwt.decode(token);
    this.setState({token: token, username:decoded.username, role:decoded.role, membership_payed:decoded.payed})
    localStorage.setItem("token", token);
    localStorage.setItem("username", decoded.username);
    localStorage.setItem("role", decoded.role);
    localStorage.setItem("payed", decoded.payed);
  }

  //Resets states. Called in child component mainMenu.js when clicking log out in menu
  logOut = () => {
    localStorage.clear();
    this.setState({
      token: null,
      username: null,
      role: null,
      membership_payed: null,
      view: "frontpage"
    })
  }

  //Render a different view. Parameter comes from menu item
  changeView = (newView) => {
    this.setState({
      view: newView
    });
  }

  //Updates all user data in state
  updateData = (username) => {
    fetch('/api/users/'+username)
    .then(res => res.json())
    .then(response => {
      this.setState({
        username: response.user.username,
        role: response.user.role,
        membership_payed: response.user.membership_payed,
        token: response.user.JWT
      });
      localStorage.setItem("username", response.user.username);
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("token", response.user.JWT);
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Fetch failed! Please, try again!");
    });
  }

  render(){
    return (
      <div className="App">
        <div className="MainView">
          <img src={logo} className="App-logo" alt="logo" />

          <MainMenu token={this.state.token}
                    username={this.state.username}
                    role={this.state.role}
                    logOut={this.logOut}
                    changeView={this.changeView}
          />
        <div hidden={this.state.view!=="frontpage"} className="FrontPage">
            <h1 style={{marginTop:"0px"}}>Welcome to <br/>the Movie Club <br/>homepage!</h1>

            {this.state.token===(null) ? <h2 style={{marginBottom:"5px"}}>If you already have an account, you can log in here:</h2> : null }
            {this.state.token===(null) ? <LoginButton getJWT={this.getJWT}/> : null}
            <br/>
            {this.state.token===(null) ? <h2 style={{marginBottom:"5px"}}>If you dont have an account, you can create one here:</h2> : null }
            {this.state.token===(null) ? <CreateButton/> : null}

          </div>

        </div>

        <div hidden={this.state.view!=="moviepage"} className="MoviePage">
          <MovieView />
        </div>

        <div hidden={this.state.view!=="profilepage"} className="MoviePage">
          <ProfileView
            username={this.state.username}
            token={this.state.token}
            role={this.state.role}
            payed={this.state.membership_payed}
            key={this.state.token}
            updateData={this.updateData}
            logOut={this.logOut}
          />
        </div>

        <div hidden={this.state.view!=="adminpage"} className="AdminPage">
          <AdminView
            token={this.state.token}
            updateData={this.updateData}
          />
        </div>
      </div>
    );
  }
}

export default App;
