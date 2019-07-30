// var Web3 = require('web3')
var {User,Phenix,Round,Task,Account,Deposit,Withdraw,Reward,Transaction,Log,Notice} = require('./lop/db');

const logger = require('./logs/logger.js')
const utils = require('./utils/utils')


// const rpc = 'http://etzrpc.org'
// const web3 = new Web3(rpc)

var controllerAdd = "xxx";//控制者地址
var controllerPrivate = "xx";//控制者私钥

var tokenAddress= "0xbc923f769f56493230fdc45db5ca43742862fb20";//合约地址

const token = require('./contract/tokenABI.json');

const instanceToken =new new Web3(rpc).eth.Contract(token,tokenAddress);

var sender = "0xdCb25d3710645C2fe3Fd7e04601De50bD54ed124";

var Web3 = require('web3');
var net = require('net');
var web3 = new Web3('/home/ubuntu/.etherzero/geth.ipc', net);

module.exports = {

    utils,
    web3,
    
    tokenAddress,
    instanceToken,

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

    controllerAdd,
    
    controllerPrivate,
    logger,
    sender
}
  