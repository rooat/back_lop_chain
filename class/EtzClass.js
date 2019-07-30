var config = require('../config');


class EtzClass{
  constructor(){
    this.sendArr = []
    this.nonce=0;
    this.status = false;
  }

  start(){
    let that = this;
    setInterval(async function(){
      
      if(that.sendArr.length==0){
        that.nonce = await config.web3.eth.getTransactionCount(config.controllerAdd)
        that.sendArr = await config.withdrawData.find({state:0,endtime:{$gte:0}}).sort({'timestamps':-1});
        console.log("make data len...",that.sendArr.length)
      }else{
        that.sendFun()
        console.log("sending,,,waiting...",that.sendArr.length)
      }
    },3000)
    
  }
  async sendFun(){

      var power = await config.web3.eth.getPower(config.controllerAdd)
      power = config.web3.utils.fromWei(power, 'gwei')  
      if(power>63690002 && this.sendArr.length>0){
        console.log("current len ---",this.sendArr.length)
          if(!this.status){
            let withdraw = this.sendArr.pop();
            this.status = true;
            await config.withdrawData.updateOne({"_id":withdraw._id},{$set:{state:4}});
            this.sendTx_token(withdraw._id,withdraw.data);
            this.sendFun()
          }
      }else{
        console.log("pow or arr invalid")
      }
    
  }

  async sendTx_token(id,datas){
  
      try {
          
          console.log("nonce--",this.nonce)
          let gasss = await config.web3.eth.getGasPrice();
          var txObject = await config.web3.eth.accounts.signTransaction({
              from:config.controllerAdd,
              to: config.tokenAddress,
              data: datas,
              gasPrice: gasss,
              gasLimit: '0x9770',
              nonce: this.nonce,
              value:0
          }, "0x"+config.controllerPrivate)
          this.nonce = Number(this.nonce)+1;
          config.web3.eth.sendSignedTransaction(txObject.rawTransaction)
          .once('transactionHash', this.onSended(id))
            .once('confirmation', this.onSuccess(id))
            .once('error', this.onError(id))
      } catch (e) {
          console.log("first err:",e);
          return null;
      }
    }

   onSended(e_id){
     return async (hash) => {
        console.log("pending-hash--",hash)
       await config.withdrawData.updateOne({"_id":e_id},{$set:{txhash:hash,state:1}});
     }
    }

   onSuccess(e_id){
     var dosucess =async (confNumber, receipt) => {
       let hash = receipt.transactionHash;
       console.log("success hash:",hash)
       this.status = false;
       await config.withdrawData.updateOne({"_id":e_id},{$set:{txhash:hash,state:2,endtime:new Date().getTime()}});
       
     }
     return dosucess

    }


   onError(e_id){
     var doerror = async (error) => {
       console.log("error:",error)
       await config.withdrawData.updateOne({"_id":e_id},{$set:{state:3}});
     }
     return doerror
    }
}

var etz = new EtzClass()
etz.start()



