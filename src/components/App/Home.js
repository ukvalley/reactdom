import React from 'react';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from 'utils';
import Swal from 'sweetalert2';
import Register from './register';
import header from './header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';



import './App.scss';

const FOUNDATION_ADDRESS = 'TXqqHYESMNUUXms7YT9hDqAr1pdyzMig4E';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            loading: false,
            isRegisterred: false,
            error: null,
            dataFetched: false,
            data: null,
            owner:null,
            isLoggedin:false,
            user_data:null,
            tronrate:null,
            loading_reg:false,
            url_referral:null,
            url_correct:false,
            referal_add:null,


            tronWeb: {
                installed: false,
                loggedIn: false
            },
        }

       
        this.multiSendTrx = this.multiSendTrx.bind(this)

    }

    async componentDidMount() {





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
        
       
        this.setState({ loading: false })
       
        this.get_coin_rate();
        const referal = this.getQueryVariable('referal');
        if(referal != false)
        {
            this.setState({url_referral:referal});
            this.getSponcerAddress(referal);
        }


       


    }


   



     startRegisterEventListener() {
        Utils.contract.multiSendTrx().watch((err,result) => {

            if (err) {
                return console.log('Failed to bind the event', err);
            }

            else
            {
               
            //    console.log(result);
               

            }

           

        });

    }


     getQueryVariable(variable)
{
        var query = window.location.search.substring(1);
      //  console.log(query)//"app=article&act=news_content&aid=160990"
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
        const url = "https://www.trondesire.io/api/getsponcer?id="+id;
      //  console.log(url);
        const res = await fetch(url);
        const data1 = await res.json();

        if(data1.success == true)
        {
            this.setState({url_correct:true});
         //   console.log(this.state.url_correct);
            this.setState({referal_add:data1.address});
          //  console.log(this.state.referal_add);
        }

        else
        {
            this.setState({url_correct:false});
        }


    }


   

   



    async register(referral_address, user_id) {

      if(this.state.loading_reg == true)
      {

        Swal({
                title: "Already In Process Wait",
                type: 'error'
            });

      }

      else
      {

        const url = "https://www.bttbest.io/api/register_data_api?sponcer_id="+ referral_address +"&user_id=" + user_id;
        console.log(url);
        const res = await fetch(url);

        const data1 = await res.json();
    
        this.setState({ data: data1 });
        this.setState({ dataFetched: true });
         this.setState({loading_reg:true});
         //   console.log(this.state.loading_reg);


      

        if (this.state.data.success == true) {

            const addr = [this.state.data.data.cf_address];


            this.get_coin_rate();
            const trx_rate = parseFloat(this.state.tronrate,10);

          

            const cf_amt = this.state.data.data.cf_amt;
           // const og_amt = this.state.data.data.og_amt;
          //  const admin_amt = this.state.data.data.admin_amt;

          // const cf_amt = 2;
         //  const og_amt = 0.1;
         //  const admin_amt = 0.1;
           
            const trx_cf_amt = parseInt((cf_amt*1000000),10);
          //  const trx_og_amt = parseInt((og_amt*1000000),10);
           // const trx_admin_amt = parseInt((admin_amt*1000000),10);
           
         


           const  amount = [trx_cf_amt];




            const totalValue = trx_cf_amt;
         
         


            

            Utils.contract.transferTokenTest(addr, amount,1002000).send({
                feeLimit: 100000000,
                callValue: 0,
                tokenId: 1002000, 
                tokenValue: amount,
                shouldPollResponse: true,
                
                }).then(res => {
                    this.register_process(user_id);
                     
                   
                }).catch(err => {
                    console.log(err);
                    this.setState({loading_reg:false});
                    this.failed_payment(user_id);
                });
        }

        else{
            this.setState({loading_reg:false});
            Swal({
                title: this.state.data.message,
                type: 'error'
            });

        }

      }

       

    }


    async register_process(user_id)
    {




        const url = "https://www.bttbest.io/api/register_api?user_id="+user_id;
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



    async get_coin_rate()
    {
        
        const url = "https://min-api.cryptocompare.com/data/price?fsym=usd&tsyms=trx";
      
        const res = await fetch(url);
         const data1 = await res.json();
        
         this.setState({tronrate:data1.TRX});

    }

   async failed_payment(user_id)
    {
        const url = "https://www.bttbest.io/api/deleteuser?user_id="+user_id;
       
        const res = await fetch(url);
         const data1 = await res.json();
        this.setState({ data: data1 });
        this.setState({ dataFetched: true });
         if (this.state.data.success == true) 
         {
            Swal({
                title: this.state.data.message,
                type: 'error'
            });
         }
    }

   async activate_user(user_id)
    {
        const url = "https://www.bttbest.io/api/activateuser?user_id="+user_id;
     
        const res = await fetch(url);
         const data1 = await res.json();
         this.setState({ data: data1 });
         this.setState({ dataFetched: true });
         if (this.state.data.success == true) 
         {
            Swal({
                title: this.state.data.message,
                type: 'success'
            });
         }

    }









    multiSendTrx(_referral) {

        const my_address = window.tronWeb.defaultAddress.base58;
        const referral_address = _referral;

       


        this.register(_referral, my_address);





    }


   async login(){
       
        if(this.state.loading_reg == true)
      {

        Swal({
                title: "Registration In Process Wait",
                type: 'error'
            });

      }

      else
      {


        const my_address = window.tronWeb.defaultAddress.base58;
        const url = "https://www.bttbest.io/api/fetch_user?user_id="+my_address;

     //   console.log(url);
       
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



    multiSendTrx_demo(e) {
        const address = ['TVWFvKMqVPymmDhn8hPHuB95UkKjVpBCGn','TXk8MdS9Umc5qivAUfEAYTGPv7v66RJrYX'];
        let amt1 = 5000000;
        let amt2 = 10000000;
        const totalValue = amt1 + amt2;

        let amount = [amt1, amt2];

     

        Utils.contract.multisendEther(address, amount).send({
            shouldPollResponse: true,
            callValue: totalValue
        }).then(res => Swal({
            title: 'Vote Casted',
            type: 'success'
        })).catch(err => Swal({
            title: 'Vote Failed',
            type: 'error'

        }));

    }

   


    render() {

        if (!this.state.tronWeb.installed)
            return <TronLinkGuide / > ;

        if (!this.state.tronWeb.loggedIn)
            return <TronLinkGuide installed / > ;

        return ( <div className = 'row oppc'>
            <div className = 'col-lg-12 text-center'>
            <h1 className="text-white"> BTTBEST < /h1> 

            <header></header>

            {
                this.state.loading ?
              <>
  <Spinner animation="grow" variant="primary" />
  <Spinner animation="grow" variant="secondary" />
  <Spinner animation="grow" variant="success" />
  <Spinner animation="grow" variant="danger" />
  <Spinner animation="grow" variant="warning" />
  <Spinner animation="grow" variant="info" />
  <Spinner animation="grow" variant="light" />
  <Spinner animation="grow" variant="dark" /> 
  <h3 className="text-center text-white">Loading...</h3>
   </>
 :
                    <Register
                multiSendTrx = { this.multiSendTrx }
                login = {this.login}
                loader_reg = { this.state.loader_reg }
                address = { window.tronWeb.defaultAddress.base58 }
                url_correct = {this.state.url_correct}
                referal_add = {this.state.referal_add}
                loading_reg = {this.state.loading_reg}
                />

            } 
            </div> 
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
        );
    }
}

export default Home;