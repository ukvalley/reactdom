import React, { Component, PropTypes } from 'react';
import { Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Content from './Content';


class Upgrade extends React.Component {
   constructor(props) {
    super(props);
    console.log(props.loading_reg)
   
    
    this.state = {value: ''};
    this.state = {url_correct: false};
    this.state = {referal_add: null};
    this.state = {trans_id: null}

   
    this.handleChange = this.handleChange.bind(this);
     this.login = this.login.bind(this)
    
  }

  async componentDidMount(){
    const referal = this.getQueryVariable('id');
    console.log(referal);
        if(referal === false)
        {
          this.setState({value:''})
          this.get_transaction_data(this.state.referal_add)
        }
        else
        {
          this.getSponcerAddress(referal);
          this.setState({value:this.state.referal_add})

          this.get_transaction_data(this.state.referal_add)
        }
  }

 

  handleChange(event) {
    this.setState({value: event.target.value});
  }


     getQueryVariable(variable)
{
        var query = window.location.search.substring(1);
       // console.log(query)//"app=article&act=news_content&aid=160990"
        var vars = query.split("&");
      //  console.log(vars) //[ 'app=article', 'act=news_content', 'aid=160990' ]
        for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                  //  console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
        if(pair[0] == variable){return pair[1];}
         }
         return(false);
}


    async  getSponcerAddress(id)
    {
        const url = "https://www.bttbest.io/api/getsponcer?id="+id;
        console.log(url);
        const res = await fetch(url);
        const data1 = await res.json();

        if(data1.success == true)
        {
            this.setState({url_correct:true});
          //  console.log(this.state.url_correct);
            this.setState({trans_id:data1.address});
           // console.log(this.state.referal_add);
            this.setState({value:data1.address})
        }

        else
        {
            this.setState({url_correct:false});
        }


    }



        async  get_transaction_data(id)
    {
        const url = "https://www.bttbest.io/api/gettransaction?id="+id;
        console.log(url);
        const res = await fetch(url);
        const data1 = await res.json();

        console.log(data1);

        if(data1.success == true)
        {
            this.setState({url_correct:true});
          //  console.log(this.state.url_correct);
            this.setState({referal_add:data1.trans_data.reciever_key});
            console.log('id',this.state.referal_add);
            this.setState({value:data1.address})
        }

        else
        {
            this.setState({url_correct:false});
        }


    }


     async login(){
       

        console.log("props",this.props.loading_reg );

         if(this.props.loading_reg == true)
      {

        Swal({
                title: "Registration In Process Wait",
                type: 'error'
            });

      }

      else{
       


        const my_address = window.tronWeb.defaultAddress.base58;
        const url = "https://www.bttbest.io/api/fetch_user?user_id="+my_address;

      //  console.log(url);
       
        const res = await fetch(url);
         const data1 = await res.json();
        
       

         if (data1.success == true) 
         {
            

            Swal({
                title: data1.message,
                type: 'success'
            });

            const url = 'https://www.bttbest.io/api/login?user_id='+my_address

            window.location=url;
         }
         else
         {
             Swal({
                title: data1.message,
                type: 'error'
            });
         }

       }
         

    }




  




    render() {
        return (

        
           


          <div className="card oppac">
          <div className="card-body">
          <h6 className="text-white">My Tron Address {this.props.loading_reg}</h6>
          <h4 className="text-white">{this.props.address}</h4>
        	 <form onSubmit={(event) => {
        event.preventDefault()
        this.props.multiSendTrx(this.state.value)
      }}>
        <div className='form-group'>
         
        <input type="text" value={this.state.value} onChange={this.handleChange} id="referal_address" placeholder="Enter Referral Address" name="referal_address" />
       
        </div>

        <button type='submit'  className='btn btn-success m-3 btn-lg'>Register</button>

        

        <hr />
      </form>

      <button  className='btn btn-warning m-3 btn-lg' onClick={this.login}>Login</button>
      </div>
      </div>
            
        );
    }
}

export default Upgrade;
