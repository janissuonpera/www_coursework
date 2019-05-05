import React, { Component } from 'react';

class MoviePage extends Component {
  state = {
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
    view: ""
  };

  componentDidMount(){
  }

  changeView = (newView) => {
    console.log(newView);
  }

  render(){
    return (
      <div>
      <h1>Owner's favourite movies:</h1>
        <ul>
          <li>Lord of the Rings: Return of the King</li>
          <li>The Godfather</li>
          <li>Seven</li>
          <li>Interstellar</li>
          <li>American History X</li>
          <li>Gladiator</li>
          <li>The departed</li>
        </ul>
      </div>
    );
  }
}

export default MoviePage;
