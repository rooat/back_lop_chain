"use strict"
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
var User = new Schema({
  username:String,
  password:String,
})

var Notice = new Schema({
  title : String,
  content : String,
  state : Number,
  updateAt : { type: Date},
  createAt : { type : Date ,  default: Date.now }
})

var Phenix = new Schema({
  phenixId: {type: Number, index: {unique: true}},
  startGoal: {type: Number},
  refundRate: {type: Number},
  state: {type: Number, default: 0},
  isCreated: {type: Boolean},
  endAt: { type: Date},
  createAt: { type: Date, default: Date.now },
})

var Round = new Schema(
{
  phenix: {type: Number},
  level: {type: Number},
  totalInvest: {type: String},
  goal: {type: String},
  maxInvest: {type: String},
  minInvest: {type: String},
  reInvest: {type: String},
  endBlock: {type: Number},
  state: {type: Number},
  reInvestRate: {type: Number},
  deployTime: { type: Date },
  deployState: {type: Number},
}
, { autoIndex: false }
);

Round.index({ phenix: 1, level: 1 }, { unique: true });

var Task = new Schema(
{
  refId: {type: Schema.Types.ObjectId},
  txId: {type: Schema.Types.ObjectId},
  type: {type: String},
});

var Account = new Schema(
{
    address: {type: String, lowercase: true}, // todo vaildation
    index: Number,
    inviteCode: {type: Number, index: {unique: true}},
    inviterCode: {type: Number},
    investAmount: {type: Number, default: 0},
    // leaderRewardLevel: {type: Number, default: 0},
    // managerRewardRate: {type: Number, default: 0},
    historyDeposit: {type: Number, default: 0},
    historyWithdraw: {type: Number, default: 0},
    // isVIP: {type: Boolean, default: false},
    levelParam: {type: Number, default: 0},
    achievement: {type: Number, default: 0},
    offerAchievement: {type: Number, default: 0},
}
, { autoIndex: false }
);

Account.index({address: 1, index: 1}, {unique: true});

var Deposit = new Schema(
{
    address: {type: String, lowercase: true},
    index: {type: Number},
    amount: {type: String},
    txHash: String,
    createAt: { type: Date, default: Date.now },
});

var Withdraw = new Schema({
  address: {type: String, lowercase: true},
  index: {type: Number},
  amount: {type: Number},
  txHash: String,
  createAt: { type: Date, default: Date.now },
});

var Feed = new Schema({
  address: {type: String, lowercase: true},
  index: {type: Number},
  phenix: {type: Number},
  joinRound: {type: Number},
  stopRound: Number,
  amount: {type: String},
  createAt: { type: Date, default: Date.now },
});

var Reward = new Schema({
  address: {type: String, lowercase: true},
  index: {type: Number},
  phenix: {type: Number},
  amount: {type: Number},
  roundIndex: Number,
  fromIndex: Number,
  isTaken: {type: Boolean, default: false},
  createAt: { type: Date, default: Date.now },
})

var Transaction = new Schema({
  data: {type: String},
  value: {type: String},
  sender: {type: String},
  address: {type: String},
  txhash: {type: String},
  state: {type: Number, default: 0},
  receipt: {
    status: Boolean,
    blockHash: String,
    blockNumber: Number,
    transactionIndex: Number,
    // from: String,
    cumulativeGasUsed: Number,
    gasUsed:Number,
    logs: [{
      data: String,
      topics: [String],
      logIndex: Number,
      // transactionIndex: Number,
      // transactionHash: String,
      // blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
      // blockNumber: 1234,
      // address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
    }]
  },
  priority: {type: Number, default: 0},  //交易排序
  createAt: { type: Date, default: Date.now },
})

var Log = new Schema({
  txHash: {type: String},
  type: {type: String},
  blockNumber: {type: Number},
  methodTopic: String,
  topics: {type: [String]},
  data: {type: String},
})

var Award = new Schema({ //动态奖励
  inviteCode: {type: Number},
  phenix: {type: Number},
  roundIndex: Number,
  type: String,
  state: {type: Number, default: 0},
  amount: {type: Number, default: 0},
  createAt: { type: Date, default: Date.now },
}, { autoIndex: false })
Award.index({inviteCode: 1, phenix: 1, roundIndex: 1, type:1}, {unique: true});
//etzlop:etz123456@
var gameConn = mongoose.createConnection('mongodb://etzlop:etz123456@localhost:27017/lop', { useNewUrlParser: true, useFindAndModify:false, useCreateIndex: true });
gameConn.set('debug', false);
module.exports.Account = gameConn.model('account', Account);
module.exports.Phenix = gameConn.model('phenix', Phenix);
module.exports.Reward = gameConn.model('reward', Reward);
module.exports.Deposit = gameConn.model('deposit', Deposit);
module.exports.Withdraw = gameConn.model('withdraw', Withdraw);
module.exports.Feed = gameConn.model('feed', Feed);
module.exports.Task = gameConn.model('task', Task);
module.exports.Log = gameConn.model('log', Log);
module.exports.Transaction = gameConn.model('transaction', Transaction);
module.exports.User = gameConn.model('user',User);
module.exports.Round = gameConn.model('round',Round);
module.exports.Notice = gameConn.model('notice',Notice);
module.exports.Award = gameConn.model('award',Award);
//etzlop:etz123456@
// mongoose.connect();
// gameConn.set('debug', false);
// mongoose.set('useCreateIndex', true);
