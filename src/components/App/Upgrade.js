import React, { Component, PropTypes } from 'react';
import { Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Content from './Content';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from 'utils';


const FOUNDATION_ADDRESS = 'TXqqHYESMNUUXms7YT9hDqAr1pdyzMig4E';
class Upgrade extends React.Component {
   constructor() {
    super();
  
    

     this.state = {

      tronWeb: {
                installed: false,
                loggedIn: false
            },

       value : '',
       url_correct : false,
       referal_add: null,
       get_id : '',
       trans_id: null,
       trans_data : null,
       sender_id : null,
       sender_status : false,
       upgrade_data : null,
       loading_reg : false,


        }


   this.multiSendTrx = this.multiSendTrx.bind(this);
    this.handleChange = this.handleChange.bind(this);
     this.login = this.login.bind(this);
    
  }

  async componentDidMount(){
  var id =  this.getQueryVariable('id');

  this.setState({get_id:id})
   
    this.get_transaction_data(id);


      this.setState({ loading: true })
        await new Promise(resolve => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready

            };



            if (tronWebState.installed) {
                this.setState({
                    tronWeb: tronWebState
                });

                return resolve();
            }

            let tries = 0;

            const timer = setInterval(() => {
                if (tries >= 10) {
                    const TRONGRID_API = 'https://api.trongrid.io';

                    window.tronWeb = new TronWeb(
                        TRONGRID_API,
                        TRONGRID_API,
                        TRONGRID_API
                    );

                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });

                    clearInterval(timer);
                    return resolve();
                }

                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;


                if (!tronWebState.installed)
                    return tries++;

                this.setState({
                    tronWeb: tronWebState
                });

                resolve();
            }, 100);
        });

        if (!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls
            // Directly overwrites the address object as TronLink disabled the
            // function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
                base58: FOUNDATION_ADDRESS
            };

            window.tronWeb.on('addressChanged', () => {
                if (this.state.tronWeb.loggedIn)
                    return;

                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true,
                        address: window.tronWeb.defaultAddress
                    }
                });
            });
        }
        await Utils.setTronWeb(window.tronWeb);

    console.log(this.state)
      
  }



   async upgrade_process(id)
    {




        const url = "https://www.bttbest.io/api/update_level_api?user_id="+id;
        console.log(url);
        const res = await fetch(url);

        const data1 = await res.json();
    
        this.setState({ data: data1 });
        this.setState({ dataFetched: true });
        this.setState({loading_reg:false})

        if (this.state.data.success == true) {
            Swal({
                title: this.state.data.message,
                type: 'success'
            });
        }

        else
        {
            Swal({
                title: this.state.data.message,
                type: 'error'
            });
        }

    }


 

  handleChange(event) {
    this.setState({value: event.target.value});
  }


     getQueryVariable(variable)
{
        var query = window.location.search.substring(1);
       console.log(query)//"app=article&act=news_content&aid=160990"
        var vars = query.split("&");
      //  console.log(vars) //[ 'app=article', 'act=news_content', 'aid=160990' ]
        for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                  //  console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
        if(pair[0] == variable){return pair[1];}
         }
         return(false);
}


 



          async  get_transaction_data(id)
    {
        const url = "https://www.bttbest.io/api/gettransaction?id="+id;
       
        const res = await fetch(url);
        const data1 = await res.json();

     

        if(data1.success == true)
        {
            this.setState({url_correct:true});
            this.setState({trans_data:data1});
         
           
         console.log("id",data1);
           

         if(this.state.trans_data.sender_id === window.tronWeb.defaultAddress.base58)
         {
            this.setState({sender_id: this.state.trans_data.sender_id})
            this.setState({sender_status: true})
           

            
            

         }
         else
         {

         }
        }

        else
        {
            this.setState({url_correct:false});
        }


    }


    async Upgrade_with_id()
    {

      if(this.state.loading_reg == true)
      {

        Swal({
                title: "Upgradation In Process Wait",
                type: 'error'
            });

      }

      else{
         
     
        const id = this.state.get_id;
        
      
        const url = "https://www.bttbest.io/api/update_level_get_data?id="+id;
        console.log(url);
       
        const res = await fetch(url,{

        });
        const data1 = await res.json();

        this.setState({upgrade_data : data1})

        console.log(data1);

         if(data1.success == true)
        {
            this.setState({url_correct:true});
       
            this.setState({referal_add:data1.address});

            this.setState({loading_reg:true});

            console.log(this.state);

             const pos_amt = parseInt((this.state.upgrade_data.data.pos_parent_amount*1000000),10);
             const placement_parent_amount = parseInt((this.state.upgrade_data.data.placement_parent_amount*1000000),10);


            const addr = [this.state.upgrade_data.data.pos_parent,this.state.upgrade_data.data.placement_parent];

            const  amount = [pos_amt, placement_parent_amount];

            const amount_total =  pos_amt +  placement_parent_amount;


             Utils.contract.transferTokenTest(addr, amount,1002000).send({
                feeLimit: 100000000,
                callValue: 0,
                tokenId: 1002000, 
                tokenValue : amount_total,
                shouldPollResponse: true,
                }).then(res => {
                   
                     this.Upgrade_with_id(this.state.get_id);
                   
                }).catch(err => {
                    console.log(err);
                    this.setState({loading_reg:false});
                    
                });
        }
          
      
        

        else
        {
            this.setState({url_correct:false});
            this.setState({loading_reg:true});
        }


        

        }
    }





     async login()
     {
       

      
         if(this.state.loading_reg == true)
      {

        Swal({
                title: "Upgradation In Process Wait",
                type: 'error'
            });

      }

      else{
       


        const my_address = window.tronWeb.defaultAddress.base58;
        const url = "https://www.bttbest.io/api/fetch_user?user_id="+my_address;

     
       
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


    

    multiSendTrx(_referral) {

        const my_address = window.tronWeb.defaultAddress.base58;
        const referral_address = _referral;

       


        this.register(_referral, my_address);





    }




  




    render() {



        if (!this.state.tronWeb.installed)
            return <TronLinkGuide / > ;

        if (!this.state.tronWeb.loggedIn)
            return <TronLinkGuide installed / > ;



        return (

        
           <div className = 'row oppc'>
            <div className = 'col-lg-12 text-center'>
            <h1 className="text-white"> BTTBEST < /h1> 

            <header></header>

          <div className="card oppac">
          <div className="card-body">
          <h6 className="text-white">My Tron Address </h6>
          <h4 className="text-white">{ window.tronWeb.defaultAddress.base58 }</h4>

        {   
        this.state.sender_status 
        ?

           <>


          <button className='btn btn-info m-3 btn-lg' onClick={this.Upgrade_with_id.bind(this)}> Upgrade </button>
        	 

            <button  className='btn btn-warning m-3 btn-lg' onClick={this.login}>Back To Dashboard</button> 

            </>

        :
            <>
            <h4 className="text-center text-red">Invalid Tronwallet</h4>
             <button className='btn btn-info m-3 btn-lg' onClick={this.Upgrade_with_id.bind(this)}> Upgrade </button>
             

            <button  className='btn btn-warning m-3 btn-lg' onClick={this.login}>Back To Dashboard</button>
            </>
        }


        {
            this.state.loading_reg ?
              <>
        <div className="col-lg-12 text-center">
  <Spinner animation="grow" variant="primary" />
  <Spinner animation="grow" variant="secondary" />
  <Spinner animation="grow" variant="success" />
  <Spinner animation="grow" variant="danger" />
  <Spinner animation="grow" variant="warning" />
  <Spinner animation="grow" variant="info" />
  <Spinner animation="grow" variant="light" />
  <Spinner animation="grow" variant="dark" /> 
  <h3 className="text-center text-white">Loading... Please Wait 2 Mins for Account Registration After Accepting Transfer Request</h3>
   </div>
   </>

 :
<></>
}

      
      </div>
      </div>

      </div>

      </div>
            
        );
    }
}

export default Upgrade;
