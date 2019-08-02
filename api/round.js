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
    let count = await config.Round.countDocuments({phenix:phenixId});
    
    if(phenixId && phenixId>0&& maxInvest && maxInvest>0 && minInvest &&maxInvest>0&& endBlock &&endBlock>0&& reInvestRate  && reInvestRate>0){
        if(reInvestRate>10000){
            return res.send({"resp":"reInvestRate 在0-10000之间"})
        }
        if(Number(reInvestRate)>0 && count<2){
            return res.send({"resp":"前两轮，reInvestRate 该值需为0"})
        }
        let isValidPhenix = await config.Round.findOne({"phenix":phenixId,"state":3})
        if(!isValidPhenix){

            let round = await config.Round.findOne({state:0,phenix:phenixId});
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
                    maxInvest: Number(maxInvest).toFixed(4),
                    minInvest: Number(minInvest).toFixed(4),
                    endBlock: endBlock,
                    reInvestRate: reInvestRate,
                    deployState: 0,
                }).save();
                
                await config.Task({
                    refId : round._id,
                    txId : tx_id,
                    type : "anounceNextRound"
                }).save()
                return res.send({"resp":"success"});
            }
            return res.send({"resp":"有未结束Round"});
        }
        return res.send({"resp":"该仓位已结束，请创建新仓位，并开始轮次 ！"});
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
        let current_block = await config.web3.eth.getBlockNumber();
        if(rounds.endBlock>Number(current_block)){
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
        return res.send({"resp":"change_endblock"})
    }
    return res.send({"resp":"failure"});
}
exports.add_currentRoundSucceed = async function(req , res){
    let _id = req.body.id;
    if(_id){
        let rounds = await config.Round.findOne({_id:_id});
        let phenixId = rounds.phenix;
        if( rounds.state == 0 && rounds.deployState==2) {
            let current_block = await config.web3.eth.getBlockNumber();
            let data ="";
            let state = 0
            let type ;
            let flag = false
            if(Number(rounds.goal)==Number(rounds.totalInvest)){
                data =  currentRoundSucceed(phenixId);
                state = 1;
                type ="currentRoundSucceed"
                flag= true
            }else  if(rounds.endBlock<current_block){
                data =  currentRoundFail(phenixId)
                state = 3;
                type="currentRoundFail"
                flag=true
            }
            if(flag){
                let tx_id = await saveTransaction(req , data);
                await config.Round.update({_id:_id},{$set:{"deployState":state}});
                await config.Task({
                    refId : _id,
                    txId : tx_id,
                    type :type 
                }).save()
                return res.send({"resp":"success"})
            }
            return res.send({"resp":"暂时无法结束，请稍后..."})
        }
    }
    return res.send({"resp":"failure"});
  }

exports.edit_block = async function(req, res){
    let id = req.body.id;
    let block  = req.body.endBlock;
    if(id&&block){
        let round = await config.Round.findOne({"_id":id});
        if(round){
            await config.Round.update({"_id":id},{$set:{"endBlock":block}});
            return res.send({"resp":"success"}); 
        }
    }
    return res.send({"resp":"failure"})
}


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
            }, [config.utils.sub_zero(maxInvest),config.utils.sub_zero(minInvest),endBlock,reInvestRate,phenixId]);
    return data
}
