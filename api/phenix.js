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
    if(startGoal && startGoal>0){
        let startNewPhenix_data = startNewPhenix(startGoal);
        let tx_id = await saveTransaction(req , startNewPhenix_data);
        let phenix = await config.Phenix({
            phenixId: "",
            roundNumber: "",
            startGoal: config.utils.sub_zero(startGoal),
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
                    priority : 4,
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
                }, [config.utils.sub_zero(startGoal)]);
    return data;
} 
