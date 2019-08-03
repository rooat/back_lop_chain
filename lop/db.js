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
  updateAt : { type: Date,},
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
    leaderRewardLevel: {type: Number, default: 0},
    managerRewardRate: {type: Number, default: 0},
    historyDeposit: {type: Number, default: 0},
}
, { autoIndex: false }
);

Account.index({address: 1, index: 1}, {unique: true});

var Deposit = new Schema(
{
    address: {type: String, lowercase: true},
    index: {type: Number},
    amount: {type: String},
    createAt: { type: Date, default: Date.now },
});

var Withdraw = new Schema({
  address: {type: String, lowercase: true},
  index: {type: Number},
  amount: {type: Number},
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

module.exports.Account = mongoose.model('account', Account);
module.exports.Phenix = mongoose.model('phenix', Phenix);
module.exports.Reward = mongoose.model('reward', Reward);
module.exports.Deposit = mongoose.model('deposit', Deposit);
module.exports.Feed = mongoose.model('feed', Feed);
module.exports.Task = mongoose.model('task', Task);
module.exports.Log = mongoose.model('log', Log);
module.exports.Transaction = mongoose.model('transaction', Transaction);
module.exports.User = mongoose.model('user',User);
module.exports.Round = mongoose.model('round',Round);
module.exports.Notice = mongoose.model('notice',Notice);
//etzlop:etz123456@
mongoose.connect('mongodb://etzlop:etz123456@localhost:27017/lop', { useNewUrlParser: true, useFindAndModify:false });
mongoose.set('debug', false);
mongoose.set('useCreateIndex', true);
