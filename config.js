// var Web3 = require('web3')
var {User,Phenix,Round,Task,Account,Deposit,Withdraw,Reward,Transaction,Log,Notice,Award} = require('./lop/db');

const logger = require('./logs/logger.js')
const utils = require('./utils/utils')


// const rpc = 'http://etzrpc.org'
// const web3 = new Web3(rpc)

var controllerAdd = "xxx";//控制者地址
var controllerPrivate = "xx";//控制者私钥

var tokenAddress= "0xbc923f769f56493230fdc45db5ca43742862fb20";//合约地址

const token = require('./contract/tokenABI.json');


//var sender = "0xdCb25d3710645C2fe3Fd7e04601De50bD54ed124";
var sender = "0xDfaB41faf59A7235cB9c4574D5aE4ca0FD5227D3"

var Web3 = require('web3');
var net = require('net');
 var web3 = new Web3('/home/ubuntu/.etherzero/geth.ipc', net);

 //  var  web3 = new Web3('http://etzrpc.org');
//contract test = "0x14b0469cc515096164ac499d08fee263105129ce"
//sender test = "0xDfaB41faf59A7235cB9c4574D5aE4ca0FD5227D3"
module.exports = {

    utils,
    web3,
    
    tokenAddress,

    User,
    User,
    Phenix,
    Round,
    Task,
    Account,
    Deposit,
    Withdraw,
    Reward,
    Transaction,
    Log,
    Notice,
    Award,

    controllerAdd,
    
    controllerPrivate,
    logger,
    sender
}
  