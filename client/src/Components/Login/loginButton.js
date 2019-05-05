import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import LoginView from './loginView';

//Component for rendering a list of users
class LoginButton extends Component {
  constructor(){
    super();
    this.state = {
    }
    this.viewElement = React.createRef();
  }

  openLogin = () => () => {
    this.viewElement.current.handleOpen();
  }

  render(){
    return (
      <div>
        <Button
              variant="contained"
              color="primary"
              style={{marginTop:"10px"}}
              onClick={this.openLogin()}
            >
              Log in
        </Button>
        <LoginView ref={this.viewElement} />
      </div>
    );
  }
}

export default LoginButton;
