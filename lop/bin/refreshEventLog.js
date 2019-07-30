var Web3 = require('web3');
var net = require('net');
var {Account, Log, Deposit, Withdraw, } = require('../db');
var {requestFromExplorer} = require('./../util/request');
const { RoundEndHash, RegisterHash, DepositHash, WithdrawHash, CreateRewardHash, TakeRewardHash, DeployBlock, ContractAddr } = require('./../config/contract');
const { ABI } = require('./../config/abi');
const eventLogHost = "https://etzscan.com/";
var web3 = new Web3('/root/.etztest/geth.ipc', net);
var appContract = new web3.eth.Contract(ABI, ContractAddr);
const RUN_INTERVAL = 10000;
const NewMasterNodeEventParam = ['address','bytes8','uint256'];
const JoinCommunityEventParam = ['bytes8', 'uint256'];
const BlockDelay = 5;

class RefreshNodeTask {
  constructor() {
    this.grabbedBlock = DeployBlock;
  }

  run() {
    setInterval(this.refresh.bind(this), RUN_INTERVAL)
  }

  async refresh() {
    await this.gatherEventLog();
    // await this.gatherNodeState();
  }

  // async gatherNodeState() {
  //   let masternodes = await Masternode.find({state: {$in: [0, 1]}}).exec();
  //   let curblock = await web3.eth.getBlockNumber();
  //   for (let i = 0; i < masternodes.length; i++) {
  //     // let expired = await appContract.methods.isExpired(masternodes[i].masternodeId).call();
  //     let expiredBlock = await appContract.methods.getExpiredBlock(masternodes[i].masternodeId).call();
  //     // console.log(expiredBlock.toNumber());
  //     expiredBlock = expiredBlock.toNumber()
  //     await Masternode.updateOne({masternodeId: masternodes[i].masternodeId}, {expireAtBlock: expiredBlock}).exec();
  //     let masterNode = await appContract.methods.masterNodeList(masternodes[i].masternodeId).call();
  //     if (!masterNode.isValid) {
  //       await Masternode.updateOne({masternodeId: masternodes[i].masternodeId}, {state: 2}).exec();
  //       let account = await Account.findOneAndUpdate({address: masterNode.owner.toLowerCase()}, { $inc: { masternodeAmount: -1 } });
  //       // if (masterNode.community != 0) {
  //       //   await Community.updateOne({id: account.community}, { $inc: { masternodeAmount: -1 } })
  //       // }
  //     } else if (curblock > expiredBlock && masternodes[i].state == 0) {
  //       await Masternode.updateOne({masternodeId: masternodes[i].masternodeId}, {state: 1}).exec();
  //     } else if (curblock < expiredBlock && masternodes[i].state == 1) {
  //       await Masternode.updateOne({masternodeId: masternodes[i].masternodeId}, {state: 0}).exec();
  //     }
  //   }
  //   // for (let i = 0; i < masternodes.length; i++) {
  //   //   let expiredBlock = await appContract.methods.getExpiredBlock(masternodes[i].masternodeId).call();
  //   //   await Masternode.updateOne({masternodeId: masternodes[i].masternodeId}, {expireAtBlock: expiredBlock}).exec();
  //   // }
  // }

  async gatherEventLog() {
    if (this.grabbedBlock == DeployBlock) {
      let latest = await Log.find({}).limit(1).sort({blockNumber: -1}).exec();
      if (latest && latest.length) {
        this.grabbedBlock = latest[0].blockNumber + 1;
      }
    }
    let curblock = await web3.eth.getBlockNumber();
    if (curblock - BlockDelay > this.grabbedBlock) {
      let result = await requestFromExplorer(this.grabbedBlock, curblock - BlockDelay);
      for (let i = 0; i < result.result.length; i++) {
        try {
          await this.saveData(result.result[i]);
          switch (result.result[i].topics[0]) {
            case DepositHash:

              break;
            case RegisterHash:

              break;
            default:

          }
        } catch (e) {
          console.error(e);
        }
      }
      this.grabbedBlock = curblock - BlockDelay + 1
    }
  }

  async saveData(data) {
    data.methodTopic = data.topics[0];
    let log = new Log(data);
    await log.save();
  }

  // async requestFromExplorer(fromBlock, toBlock, topics) {
  //   let url = `${eventLogHost}publicAPI?module=logs&action=getLogs&address=${ContractAddr}&fromBlock=${fromBlock}&toBlock=${toBlock}&topics=${topics}`;
  //   console.log(url);
  //   return await req({url: url})
  // }
}

var task = new RefreshNodeTask()
task.run()
// async function test() {
//   var a = new RefreshNodeTask();
//   let curblock = await web3.eth.getBlockNumber();
//   let result = await a.requestFromExplorer(19608992, curblock, MasterNodeCreatedHash);
//   console.log(result);
// }
// test()
