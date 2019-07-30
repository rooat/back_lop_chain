var express = require('express');
var router = express.Router();
var { Account, Masternode, Reward } = require('./../db');

/* GET users listing. */
router.get('/baseinfo', async function(req, res, next) {
  let address = req.query.address.toLowerCase();
  let account = await Account.findOne({address: address}).exec();
  if (address && account) {
    let account = await Account.findOne({address: address}).exec();
    let inviteNum = await Account.count({inviterCode: account.invideCode}).exec();
    let online = await Masternode.count({owner: account.address, state: 0}).exec();
    let unregister = await Masternode.count({owner: account.address, state: 1}).exec();
    res.json({inviteNum: inviteNum, inviteBy: account.inviterCode, inviteCode: account.invideCode, online:online, unregister: unregister});
  }else {
    res.json({inviteCode: 0});
  }
});

router.get('/minedetail', async function(req, res, next) {
  res.end()
})

router.get('/masternodesdetail', async function(req, res, next) {
  let address = req.query.address.toLowerCase();
  let state = req.query.state;
  let masternodes = [];
  if (state) {
    masternodes = await Masternode.find({owner: address, state: state}).exec();
  } else {
    masternodes = await Masternode.find({owner: address}).exec();
  }
  res.json(masternodes);
})

router.get('/reward', async function(req, res, next) {
  let address = req.query.address.toLowerCase();
  let num = req.query.num || 7;
  num = Number(num);
  if (address) {
    let rewards = await Reward.find({address: address}).limit(num).sort({createAt: -1});
    res.json(rewards);
  }else {
    res.end();
  }
})

module.exports = router;
