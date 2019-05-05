import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import CreateView from './createView';


class CreateButton extends Component {
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
              Create User
        </Button>
        <CreateView ref={this.viewElement} />
      </div>
    );
  }
}

export default CreateButton;
