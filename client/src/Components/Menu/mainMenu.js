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

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
      token: this.props.token,
      username: this.props.username,
      role: this.props.role
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () =>{
    localStorage.clear();
    this.setState({
      anchorEl: null,
      token: null,
      username: null,
      role: null,
    })
    this.props.logOut();
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
        {this.state.role!==null ? <MenuItem onClick={this.handleClose}>Movies</MenuItem> : null}
        {this.state.role!==null ? <MenuItem onClick={this.handleClose}>Profile</MenuItem> : null}
        {this.state.role==="admin" ? <MenuItem onClick={this.handleClose}>Admin page</MenuItem> : null }
        {this.state.role!==null ? <MenuItem onClick={this.handleLogout}>Logout</MenuItem> : null}
      </Menu>
      </div>
    );
  }
}

export default MainMenu;
