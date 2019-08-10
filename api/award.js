let config = require('../config')
let showPage = require('../page');
let async = require('async');
let moment = require('moment');
const {ABI} = require('../lop/config/abi');
const {ContractAddr} = require('../lop/config/contract');
let pagesize = 30

exports.index =async function (req, res) {
    let phenixId = req.query.phenixId;
    let level = req.query.level;
    let page = req.query.page ? req.query.page : 1; //获取当前页数，如果没有则为1
    let url = req.originalUrl; //获取当前url，并把url中page参数过滤掉
    url = url.replace(/([?&]*)page=([0-9]+)/g, '');
    if (/[?]+/.test(url)) {
        url += '&';
    } else {
        url += '?';
    }
    let ps = (page-1)*pagesize;
    let list = await config.Award.find({phenix:phenixId,roundIndex:level}).sort({"state":1,"amount":-1}).limit(pagesize).skip(ps);
    let count = await config.Award.countDocuments({phenix:phenixId,roundIndex:level});
    let balance = await config.web3.eth.getBalance(config.awardSender);
    let waitSend = await config.Award.countDocuments({"phenix":phenixId,"roundIndex":level,"state":0});
    if(list && list.length>0){
        for(var y=0;y<list.length;y++){
            let tas = await config.Task.findOne({"refId":list[y]._id})
            if(tas){
                let tx = await config.Transaction.findOne({"_id":tas.txId})
                if(tx){
                    if(tx.state==3){
                        await config.Task.remove({"_id":tas._id});
                        await config.Transaction.remove({"_id":tx._id});
                    }else{
                        list[y].state = tx.state;
                    }
                }
            }
        }
    }
   
    res.render('award', {
            address : config.awardSender,
            balance:balance,
            awardlist: list,
            phenixId : phenixId,
            level : level,
            btnstate : waitSend,
            page: showPage.show(url, count, pagesize, page),
        });
};

exports.send_award = async function(req, res){
    let phenixId = req.body.phenixId;
    let level  = req.body.level;
    if(phenixId && level){
        // let awardTask = await config.Task.find({$or:[{"type":"leaderaward"},{"type":"levelaward"}]})
        // if(awardTask && awardTask.length>0){
        //     for(var x=0;x<awardTask.length;x++){
        //         let tx_id = awardTask[x].txId;
        //         let tx = await config.Transaction.find({"_id":tx_id});
        //         if(tx.state==1){
        //             return res.send({"resp":"发放奖励进行中"})
        //         }
        //     }
        // }
        let datas   = await config.Award.find({phenix:phenixId,roundIndex:level,state:0})
        if(datas && datas.length>0){
            for(var i =0;i<datas.length;i++){
                let accounts = await config.Account.findOne({"inviteCode":datas[i].inviteCode})
                if(accounts){
                    let tx_id = await saveTransaction(config.web3.utils.toWei(String(datas[i].amount),'ether'),accounts.address);
                    await config.Task({
                        refId : datas[i]._id,
                        txId : tx_id,
                        type : datas[i].type+"award"
                    }).save();
                    await config.Award.update({"_id":datas[i]._id},{$set:{"state":1}});
                }
            }
            return res.send({"resp":"发放奖励进行中"})
        }
    }
    return res.send({"resp":"failure"})
}



async function saveTransaction(value,address){
    let tx = await config.Transaction({
                    value : value,
                    sender : config.awardSender,
                    address : address,
                }).save()
    return tx._id;
}