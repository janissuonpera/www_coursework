import React, { Component } from 'react';
//import './users.css';


//Component for rendering a list of users
class Users extends Component {
  constructor(){
    super();
    this.state = {
      count: 0,
      users: []
    }
  }

  componentDidMount(){
    fetch('/api/users')
    .then(res => res.json())
    .then(data => this.setState({users: data.users, count: data.count}));
  }

  render(){
    return (
      <div>
        <h2> Users </h2>
        <ul>
          {this.state.users.map(user =>
            <li key={user.username}>{user.username}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Users;
