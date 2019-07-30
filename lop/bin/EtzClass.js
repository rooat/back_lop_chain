
var Web3 = require('web3');
var net = require('net');
var {Transaction} = require('../db');
var web3 = new Web3('/home/ubuntu/.etherzero/geth.ipc', net);
//var web3 = new Web3("http://etzrpc.org");
const {ContractAddr } = require('./../config/contract');
const {accounts } = require('./../config/accounts');
var {Power} = require('./../util/power');
web3.extend(Power)


class EtzClass{
  constructor() {
    this.txArr = []
    this.nonce=0;
    this.status = false;
    this.sendTask;
    this.isCollecting = false;
  }

  start() {
    console.log("sendTx....started !")
    setInterval(async function(){
      if(this.txArr.length==0){
        this.txArr = await Transaction.find({state:0}).sort({'priority':1}).exec();
        console.log("===",this.txArr.length)
        clearInterval(this.sendTask);
        this.sendTask = setInterval(this.sendProcess.bind(this), 2000)
      }
    }.bind(this),3000)
    setInterval(this.collectReceipt.bind(this), 3000);
  }

  async sendProcess(){
      if(this.txArr && this.txArr.length!=0){
          let tx = this.txArr.pop();
          await Transaction.updateOne({"_id":tx._id},{$set:{state:4}}).exec();
          await this.sendTx(tx);
      }else{
        console.log("pow or arr invalid")
      }

  }

  async sendTx(tx){
      try {
          console.log("nonce--",this.nonce)
          let gasss = await web3.eth.getGasPrice();
          let power = await web3.etz.getPower(tx.sender)
          console.log("power=",power);
          power = web3.utils.fromWei(String(power), 'gwei')
          if(power>636902){
            let nonce = await web3.eth.getTransactionCount(tx.sender, "pending");
            console.log("nonce==",nonce)
            var txObject = await web3.eth.accounts.signTransaction({
              from:tx.sender,
              to: tx.address,
              data: tx.data,
              gasPrice: gasss,
              gasLimit: '0x9770',
              nonce: nonce,
              value:tx.value
            }, "0x"+accounts.get(tx.sender))//accounts.get(tx.sender)
            this.nonce = Number(this.nonce)+1;
            web3.eth.sendSignedTransaction(txObject.rawTransaction)
              .once('transactionHash', this.onSended(tx._id))
              .once('error', this.onError(tx._id))
            await this.onSended(tx._id)(null);
          }
      } catch (e) {
          console.log("first err:",e);
          return null;
      }
    }

   onSended(e_id){
     return async (hash) => {
       await Transaction.updateOne({"_id":e_id},{$set:{txhash:hash,state:1}}).exec();
     }
    }

   onError(e_id){
     var doerror = async (error) => {
       console.log("error:",error);
       await Transaction.updateOne({"_id":e_id},{$set:{state:3}}).exec();
     }
     return doerror;
    }

    async collectReceipt() {
      if (this.isCollecting) {
        return;
      }
      let transactions = await Transaction.find({txhash:{ $ne: null }, state:1}).exec();
      console.log('receipt length: '+ transactions.length)
      let blockNumber = await web3.eth.getBlockNumber();
      for (var i = 0; i < transactions.length; i++) {
        this.isCollecting = true;
        try {
          let receipt = await web3.eth.getTransactionReceipt(transactions[i].txhash);
          // console.log(receipt)
          // console.log("receipt---",receipt)
          if (receipt.blockNumber + 5 > blockNumber) {
            continue;
          }
          if (receipt.status == true) {
            console.log(transaction[i])
            await Transaction.updateOne({"_id":transactions[i]._id},{receipt:receipt,state:2}).exec();
          } else if (receipt.status == false) {
            await Transaction.updateOne({"_id":transactions[i]._id},{receipt:receipt,state:3}).exec();
          }
        } catch (e) {
          console.log(e);
        }
        this.isCollecting = false;
      }
    }
}

var etz = new EtzClass()
etz.start()
