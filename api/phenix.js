let config = require('../config')
let showPage = require('../page');
let async = require('async');
let moment = require('moment');
const {ABI} = require('../lop/config/abi');
const {ContractAddr} = require('../lop/config/contract');
let pagesize = 5;

exports.index =async function (req, res) {
    let page = req.query.page ? req.query.page : 1; //获取当前页数，如果没有则为1
    let url = req.originalUrl; //获取当前url，并把url中page参数过滤掉
    url = url.replace(/([?&]*)page=([0-9]+)/g, '');
    if (/[?]+/.test(url)) {
        url += '&';
    } else {
        url += '?';
    }
    let ps = (page-1)*pagesize;
    let list = await config.Phenix.find().sort({"createAt":-1}).limit(pagesize).skip(ps);
    let count = await config.Phenix.countDocuments();
    res.render('phenix', {
            phenixlist: list,
            page: showPage.show(url, count, pagesize, page),
        });
};

exports.add_startNewPhenix = async function(req , res){
    let startGoal = req.body.startGoal;
    let ph_arr = await config.Phenix.find({"phenixId":{$eq:null}});
    if(!ph_arr || ph_arr.length==0){
        let startNewPhenix_data = startNewPhenix(startGoal);
        let tx_id = await saveTransaction(req , startNewPhenix_data);
        let phenix = await config.Phenix({
            phenixId: "",
            roundNumber: "",
            startGoal: startGoal,
            refundRate: "",
            isCreated: false,
            state:""
        }).save()
        await config.Task({
            refId : phenix._id,
            txId : tx_id,
            type : "startNewPhenix"
        }).save()
    }
    
    res.redirect('/phenix');
}
exports.add_startNextRound = async function(req , res){
    let phenixIndex = req.body.phenixIndex;
    let endBlock  = req.body.endBlock;

    let startNextRound_data = startNextRound(phenixIndex,endBlock);
    let tx_id = await saveTransaction(req , startNextRound_data);
    let round = await config.Round.findOne({phenix:phenixIndex,endBlock:endBlock});
    
    await config.Task({
        refId : round._id,
        txId : tx_id,
        type : "startNextRound"
    }).save()
    res.redirect('/phenix');
}
exports.add_anounceNextRound = async function(req , res){
    let phenixId = req.body.phenixId;
    let maxInvest = req.body.maxInvest;
    let minInvest = req.body.minInvest;
    let endBlock = req.body.endBlock;
    let reInvestRate = req.body.reInvestRate;
    let anounceNextRound_data = anounceNextRound(maxInvest,minInvest,endBlock,reInvestRate,phenixId);
    let tx_id = await saveTransaction(req ,anounceNextRound_data );
    let round = await config.Round({
        phenix : phenixId,
        maxInvest : maxInvest,
        minInvest : minInvest,
        endBlock : endBlock,
        reInvestRate : reInvestRate
    }).save();
    
    await config.Task({
        refId : round._id,
        txId : tx_id,
        type : "anounceNextRound"
    }).save()
    res.redirect('/phenix');
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

function startNewPhenix(startGoal){
    let data =   config.web3.eth.abi.encodeFunctionCall({
            name: "startNewPhenix",
            type: 'function',
            inputs: [{
                        "name": "startGoal",
                        "type": "uint256"
                    }]
                }, [startGoal]);
    return data;
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