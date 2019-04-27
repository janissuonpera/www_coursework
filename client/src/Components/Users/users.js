import React, { Component } from 'react';
//import './users.css';

class Users extends Component {
  constructor(){
    super();
    this.state = {
      customers: []
    }
  }

  componentDidMount(){
    fetch('/api/users')
    .then(res => res.json())
    .then(users => this.setState({users}));
  }

  render(){
    return (
      <div>
        <h2> Users </h2>
      </div>
    );
  }
}

export default Users;
