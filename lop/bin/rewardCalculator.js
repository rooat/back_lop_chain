var Web3 = require('web3');
var net = require('net');
var web3 = new Web3('http://etzrpc.org');
var {Power} = require('./../util/power');
// console.log(web3.currentProvider);
var power = Power(web3.currentProvider);

power.getPower('0x763edBB7A33c2D9Ed6775D5b24225A469673BE99').then(console.log);
