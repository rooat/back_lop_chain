var express = require('express');
var { Phenix } = require('./../db');
var { ContractAddr } = require('./../config/contract')
var router = express.Router();

var Web3 = require('web3');
var net = require('net');
const eventLogHost = "https://etzscan.com/";
var web3 = new Web3('/home/ubuntu/.etherzero/geth.ipc', net);
const {ABI} = require('./../config/abi');
var phenixContract = new web3.eth.Contract(ABI, ContractAddr);
var avaliblePhenix = [];
setInterval(async() => {
  let max = -1;
  try {
    max = await phenixContract.methods.getMaxPhenixIndex().call();
  } catch(e) {

  }
  console.log(max);
  let from = 0;
  try {
    from = avaliblePhenix[avaliblePhenix.length - 1].index + 1
  } catch (e) {

  }
  console.log(from);
  for (let i = from; i <= max; i++) {
    let p = await phenixContract.methods.phenixes(i).call();
    if (p.state == 0) {
      p.index = i;
      avaliblePhenix.push(p);
    }
  }
  for (let i = 0; i < avaliblePhenix.length; i++) {
    let p = await phenixContract.methods.phenixes(avaliblePhenix[i].index).call();
    if (p.state == 2) {
      avaliblePhenix.splice(i, 1);
    }
  }
  console.log(avaliblePhenix);
}, 10000)

/* GET home page. */
router.get('/avaliblePhenix', async function(req, res, next) {
  res.json(avaliblePhenix);
});

router.get('/contract', async function(req, res, next) {
  res.json({ContractAddr: ContractAddr});
});

module.exports = router;
