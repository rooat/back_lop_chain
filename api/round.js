let config = require('../config')
let showPage = require('../page');
let async = require('async');
let moment = require('moment');
const {ABI} = require('../lop/config/abi');
const {ContractAddr} = require('../lop/config/contract');
let pagesize = 5;

exports.index =async function (req, res) {
    let phenixId = req.query.phenixId;
   
    let page = req.query.page ? req.query.page : 1; //获取当前页数，如果没有则为1
    let url = req.originalUrl; //获取当前url，并把url中page参数过滤掉
    url = url.replace(/([?&]*)page=([0-9]+)/g, '');
    if (/[?]+/.test(url)) {
        url += '&';
    } else {
        url += '?';
    }
    let ps = (page-1)*pagesize;
    let list = await config.Round.find({phenix:phenixId}).sort({"level":-1}).limit(pagesize).skip(ps);
    let count = await config.Round.countDocuments({phenix:phenixId});
    let blockNumber = await config.web3.eth.getBlockNumber();
    res.render('round', {
            block_number:blockNumber,
            roundlist: list,
            phenixId : phenixId,
            page: showPage.show(url, count, pagesize, page),
        });
};


exports.add_anounceNextRound = async function(req , res){
    let phenixId = req.body.phenixId;
    let maxInvest = req.body.maxInvest;
    let minInvest = req.body.minInvest;
    let endBlock = req.body.endBlock;
    let reInvestRate = req.body.reInvestRate;
    let round = await config.Round.findOne({state:0,phenix:phenixId});
    if(phenixId && maxInvest && minInvest && endBlock && reInvestRate ){
        if(!round){
            let anounceNextRound_data = anounceNextRound(maxInvest,minInvest,endBlock,reInvestRate,phenixId);
            let tx_id = await saveTransaction(req ,anounceNextRound_data );
            let max_level = await config.Round.find({phenix:phenixId}).sort({"level":-1}).limit(1);
            let level =0;
            if(max_level && max_level.length>0){
                level = max_level[0].level;
                level = Number(level)+1;
            }
            let round = await config.Round({
                phenix: phenixId,
                level: level,
                maxInvest: maxInvest,
                minInvest: minInvest,
                endBlock: endBlock,
                reInvestRate: reInvestRate,
                deployState: 0,
                deployTime : ""
            }).save();
            
            await config.Task({
                refId : round._id,
                txId : tx_id,
                type : "anounceNextRound"
            }).save()
            return res.send({"resp":"success"})
        }
        return res.send({"resp":"有未结束Round"})
    }
    return res.send({"resp":"Params Invalid"})
}

exports.add_startNextRound = async function(req , res){
    let _id = req.body.id;
    let rounds = await config.Round.findOne({_id:_id});
    let task = await config.Task.findOne({"refId":_id});
    if(task && rounds){
        let phenixId = rounds.phenix
        let tx_id = task.txId;
        let txtr  = await config.Transaction.findOne({"_id":tx_id});
        if(txtr.state==2){
            let startNextRound_data = startNextRound(phenixId,rounds.endBlock);
            let tx_id = await saveTransaction(req , startNextRound_data);
            await config.Round.update({_id:_id},{$set:{"state":0,"deployState":2,"deployTime":Date.now()}})
            await config.Task({
                refId : _id,
                txId : tx_id,
                type : "startNextRound"
            }).save()
            return res.send({"resp":"success"})
        }
        return res.send({"resp":"Round创建中..."})
    }
    return res.send({"resp":"failure"});
}
exports.add_currentRoundSucceed = async function(req , res){
    let _id = req.body.id;
    let phenixId = req.body.phenixId;
    let rounds = await config.Round.findOne({_id:_id});
    let level = rounds.level;
    if( rounds.state == 0 && rounds.deployState==2) {
        let current_block = await config.web3.eth.getBlockNumber();
        let data ="";
        let state = 0
        let type ;
        let flag = false
        if(Number(rounds.goal)==Number(rounds.totalInvest)){
            data =  currentRoundSucceed(rounds.phenix);
            state = 1;
            type ="currentRoundSucceed"
            flag= true
        }else  if(rounds.endBlock<current_block){
            data =  currentRoundFail(rounds.phenix)
            state = 3;
            type="currentRoundFail"
            flag=true
        }
        if(flag){
            let tx_id = await saveTransaction(req , data);
            await config.Round.update({_id:_id},{$set:{"deployState":state}})
            let phenixId = rounds.phenix;
            await config.Task({
                refId : _id,
                txId : tx_id,
                type :type 
            }).save()
            return res.send({"resp":"success"})
        }
        return res.send({"resp":"开启中..."})
    }
    return res.send({"resp":"failure"});
  }


exports.edit = function (req, res) {
    let id = req.query.id; //获取当前页数，如果没有则为1

    async.series({
        one: function (done) {
            test.index("select * from heshe_admin_role where id = "+id, function (list) {
                done(null, list);
            });
        }
    }, function (error, result) {
        res.render('role_edit', {
            role: result.one[0]
        });
    })
};

exports.update = function (req, res) {
    let id = req.body.id;
    let name = req.body.name;
    let auths = req.body.auths;

    async.series({
        one: function (done) {
            test.index("UPDATE `heshe_admin_role` SET `name` = '" + name + "',`auths` = '" + auths + "' WHERE `id` = " + id, function (list) {
                done(null, list);
            });
        }
    }, function (error, result) {
        res.redirect('/role');
    });
};

exports.delete = function (req, res) {
    let id = req.query.id;

    async.series({
        one: function (done) {
            test.index("DELETE FROM `heshe_admin_role` WHERE `id` = " + id, function (list) {
                done(null, list);
            });
        }
    }, function (error, result) {
        res.redirect('/role');
    });
};

async function saveTransaction(req,data){
    let tx = await config.Transaction({
                    data : data,
                    sender : config.sender,
                    address : ContractAddr,
                }).save()
    return tx._id;
}

function startNextRound(phenixIndex,endBlock){
    let data =   config.web3.eth.abi.encodeFunctionCall({
        name: "startNextRound",
        type: 'function',
        inputs: [{
                    "name": "phenixIndex",
                    "type": "uint256"
                },
                {
                    "name": "endBlock",
                    "type": "uint256"
                }]
            }, [phenixIndex,endBlock]);
    return data;
}
function currentRoundSucceed(phenixIndex){
    let data =   config.web3.eth.abi.encodeFunctionCall({
        name: "currentRoundSucceed",
        type: 'function',
        inputs: [{
                "name": "phenixIndex",
                "type": "uint256"
            }]
            }, [phenixIndex]);
    return data;
}
function currentRoundFail(phenixIndex){
    let data =   config.web3.eth.abi.encodeFunctionCall({
        name: "currentRoundFail",
        type: 'function',
        inputs: [{
                "name": "phenixIndex",
                "type": "uint256"
            }]
            }, [phenixIndex]);
    return data;
}

function anounceNextRound(maxInvest,minInvest,endBlock,reInvestRate,phenixId){
    let data = config.web3.eth.abi.encodeFunctionCall({
        name: "anounceNextRound",
        type: 'function',
        inputs: [{
                "name": "max",
                "type": "uint256"
                },
                {
                    "name": "min",
                    "type": "uint256"
                },
                {
                    "name": "endBlock",
                    "type": "uint256"
                },
                {
                    "name": "reInvestRate",
                    "type": "uint256"
                },
                {
                    "name": "phenixIndex",
                    "type": "uint256"
                }]
            }, [maxInvest,minInvest,endBlock,reInvestRate,phenixId]);
    return data
}