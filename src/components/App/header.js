import React, { Component, PropTypes } from 'react';

class Header extends React.Component {
   constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  


    render() {
        return (


          <></>
        
            
        );
    }
}

export default Header;
