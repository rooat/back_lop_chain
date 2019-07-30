var {Phenix, Transaction, Task} = require('../db');
var {requestFromExplorer} = require('./../util/request');
var Web3 = require('web3');
var net = require('net');
const {ContractAddr} = require('./../config/contract');
const {ABI} = require('./../config/abi');
var startNewPhenixJsonInterface, anounceNextRoundJsonInterface, startNextRoundJsonInterface;
const eventLogHost = "https://etzscan.com/";
var web3 = new Web3('/root/.etztest/geth.ipc', net);
var phenixContract = new web3.eth.Contract(ABI, ContractAddr);
const RUN_INTERVAL = 10000;
// const PhenixCreateEventParam = ['bytes8', 'uint256'];
for (var i = 0; i < ABI.length; i++) {
  if (ABI[i].name == "startNewPhenix" && ABI[i].type == "function") {
    startNewPhenixJsonInterface = ABI[i];
  } else if (ABI[i].name == "anounceNextRound" && ABI[i].type == "function") {
    anounceNextRoundJsonInterface = ABI[i];
  } else if (ABI[i].name == "startNextRound" && ABI[i].type == "function") {
    startNextRoundJsonInterface = ABI[i];
  }
}

class PhenixTask { // 生成需要执行的transactions加入数据库
  constructor() {
  }

  async run() {
    await updatePhenix();
    await updateRound();
  }

  async updatePhenix() {
    let willCreatePhenix = await Phenix.find({phenixId:null}).exec();
    for (var i = 0; i < willCreatePhenix.length; i++) {
      let task = await Task.findOne({refId: willCreatePhenix[i]._id, type: "startNewPhenix"}).exec()
      let tx = await Transaction.findById(task.txId).exec();
      if (tx.state == 2) {
        var data = JSON.parse(tx.receipt.logs[0]).data;
        await Phenix.updateOne({_id: willCreatePhenix[i]._id}, {phenixId: web3.eth.abi.decodeParameters(['uint256'], data)}).exec()
      }
    }
  }

  async updateRound() {
    let ongoingPhenix = await Phenix.find({phenixId:{ $ne: null }, state: 0}).exec();
    for (let i = 0; i < ongoingPhenix.length; i++) {
      let ongoingRounds = await Round.find({phenix: ongoingPhenix[i].phenixId, state: {$in: [0, 1]}}).exec();
      for (let k = 0; k < ongoingRounds.length; k++) {
        let ongoingRound = ongoingRounds[k];
        try {
          let round = await phenixContract.methods.getRound(ongoingPhenix[i].phenixId, ongoingRound.level).call();
          // if (ongoingRounds[k].state != round.state) {
          await Round.updateOne({phenix: ongoingPhenix[i].phenixId}, round).exec();
          if (round.state == 3) {
            await Phenix.updateOne({phenixId: ongoingPhenix[i].phenixId}, {state : 2}).exec();
          }
          // }
        } catch (e) {
          console.log(e);
        }
      }
      // let maxRoundId = await phenixContract.methods.getMaxRoundIndex(ongoingPhenix[i].phenixId).call();
      // let ongoingRounds = await Round.findOne({phenix: ongoingPhenix[i].phenixId, state: 0}).sort({level: -1}).exec();
      // ongoingRounds = ongoingRounds || {level: 0};
      // for (let i = ongoingRounds.level; i <= maxRoundId; i++) {
      //   let round = await phenixContract.methods.getRound(ongoingPhenix[i].phenixId, i).call();
      //   Object.assign(round, {phenix: ongoingPhenix[i].phenixId, level: i, deployState: 2});
      //   await Round.updateOne({phenix: ongoingPhenix[i].phenixId, level: i}, round, {upsert: true}).exec();
      //   if (round.state == 3) {
      //     await Phenix.updateOne({phenixId: ongoingPhenix[i].phenixId}, {state : 2}).exec();
      //   }
      // }
    }
  }
}

var task = new PhenixTask()
setInterval(task.run.bind(task), RUN_INTERVAL)
