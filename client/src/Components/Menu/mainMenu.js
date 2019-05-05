import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class MainMenu extends Component {
  constructor(){
    super();
    this.state = {
      anchorEl: null,
      token: null,
      username: null,
      role: null
    }
  }

  //Opens menu
  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
      token: this.props.token,
      username: this.props.username,
      role: this.props.role
    });
  };

  //Closes menu
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  //Logs user out. Clears everything from localStorage and resets all states
  handleLogout = () =>{
    localStorage.clear();
    this.setState({
      anchorEl: null,
      token: null,
      username: null,
      role: null,
    })
    //Resets state in parent as well
    this.props.logOut();
  }

  //Renders front page
  handleFP = () =>{
    this.props.changeView("frontpage");
  }

  //Renders a list of movies
  handleMovies = () =>{
    this.props.changeView("moviepage");
  }

  //Renders a list of movies
  handleProfile = () =>{
    this.props.changeView("profilepage");
  }

  //Renders page for managing users
  handleAdmin = () =>{
    this.props.changeView("adminpage");
  }

  render(){
    const { anchorEl } = this.state;
    return (
      <div>
      <Button
        aria-owns={anchorEl ? 'menu' : undefined}
        aria-haspopup="true"
        onClick={this.handleClick}
        variant="contained"
        color="primary"
        style={{marginRight:"650px"}}
      >
        Open Menu
      </Button>
      <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
        <MenuItem onClick={this.handleFP}>Front Page</MenuItem>
        {this.state.role!==null ? <MenuItem onClick={this.handleMovies}>Movies</MenuItem> : null}
        {this.state.role!==null ? <MenuItem onClick={this.handleProfile}>Profile</MenuItem> : null}
        {this.state.role==="admin" ? <MenuItem onClick={this.handleAdmin}>Admin page</MenuItem> : null }
        {this.state.role!==null ? <MenuItem onClick={this.handleLogout}>Logout</MenuItem> : null}
      </Menu>
      </div>
    );
  }
}

export default MainMenu;
