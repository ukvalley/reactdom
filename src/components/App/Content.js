import React from 'react'
import Table from './Table'
import Form from './Form'
import Register from './register'


class Content extends React.Component {


  render() {
    return (
      <div>
        <Register 
        loader_reg = { this.props.loader_reg } 
        multiSendTrx={this.props.multiSendTrx} 
        address={this.props.address} 
        url_correct={this.props.url_correct} 
        referal_add={this.props.referal_add} 
        loading_reg = {this.props.loading_reg}
        
        />

        
       
        
        <hr/>
        
      </div>
    )
  }
}

export default Content;
