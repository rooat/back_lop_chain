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
    let count = await config.Award.countDocuments({phenix:phenixId,roundIndex:level});
    let balance = await config.web3.eth.getBalance(config.awardSender);
    let waitSend = await config.Award.countDocuments({"phenix":phenixId,"roundIndex":level,"state":0});
    let list_t = await config.Award.find({phenix:phenixId,roundIndex:level,state:{$ne:2}});
    if(list_t && list_t.length>0){
        for(var y=0;y<list_t.length;y++){

            let flag = await validCreateState(list_t[y]._id,"leaderaward","levelaward");
                if(flag==3){
                  //  list[y].state = 4;
                    await config.Award.update({"_id":list_t[y]._id},{$set:{"state":0}})
                }else if(flag==1){
                    await config.Award.update({"_id":list_t[y]._id},{$set:{"state":1}})
                }else if(flag==2){
                    await config.Award.update({"_id":list_t[y]._id},{$set:{"state":2}})
                }
        }
    }
    let list = await config.Award.find({phenix:phenixId,roundIndex:level}).sort({"state":1,"amount":-1}).limit(pagesize).skip(ps);
   
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
async function validCreateState(id,type1,type2){
    let task_create = await config.Task.find({"refId":id,$or:[{"type":type1},{"type":type2}]});
    if(task_create && task_create.length>0){
        for(var ak=0;ak<task_create.length;ak++){
            let txxs = await config.Transaction.findOne({"_id":task_create[ak].txId});
            if(txxs){
                if(txxs.state == 1 || txxs.state==0){
                    return 1;
                }else if(txxs.state==2){
                    return 2;
                }
                //    if(txxs.txhash && txxs.txhash.length==66){
                //        let recept = await config.web3.eth.getTransactionReceipt(txxs.txhash);
                //        if(recept.status){
                //            return 2;
    
    		    //         }
                //     }
                
            }
        }
    }
    return 3
}

exports.send_award = async function(req, res){
    let phenixId = req.body.phenixId;
    let level  = req.body.level;
    if(phenixId && level){
        let datas   = await config.Award.find({phenix:phenixId,roundIndex:level,state:0})
        if(datas && datas.length>0){
            for(var i =0;i<datas.length;i++){
                let accounts = await config.Account.findOne({"inviteCode":datas[i].inviteCode})
                if(accounts && accounts.address && accounts.address.length==42){
                    let tx_id = await saveTransaction(config.web3.utils.toWei(String(datas[i].amount*0.98),'ether'),accounts.address);
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
