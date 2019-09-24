// var Web3 = require('web3')
var {User,Phenix,Round,Task,Account,Deposit,Withdraw,Reward,Transaction,Log,Notice,Award,Feed} = require('./lop/db');

const logger = require('./logs/logger.js')
const utils = require('./utils/utils')


// const rpc = 'http://etzrpc.org'
// const web3 = new Web3(rpc)

var controllerAdd = "xxx";//控制者地址
var controllerPrivate = "xx";//控制者私钥

var tokenAddress= "0xc0c60e6cdb0a59d6ef611c763e207e7bd00fed84";//合约地址

const token = require('./contract/tokenABI.json');

var sender = "0xbD9e55d54928b21b1a79385E9F5f78373a04B744"
var awardSender = "0xf9353Ef28086d088612e41Ea6882F321Ac9D6b80"

// var sender = "0xdCb25d3710645C2fe3Fd7e04601De50bD54ed124";
// var sender = "0xDfaB41faf59A7235cB9c4574D5aE4ca0FD5227D3"
// var awardSender = "0x00a5C755C8a359c3113B842486Ffd197AF0B92fB"

var Web3 = require('web3');
var net = require('net');
 var web3 = new Web3('/home/ubuntu/.etherzero/geth.ipc', net);

  // var  web3 = new Web3('http://etzrpc.org');
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
    Feed,

    controllerAdd,
    
    controllerPrivate,
    logger,
    awardSender,
    sender
}
  