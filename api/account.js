let config = require('../config')
let showPage = require('../page');
let async = require('async');
let moment = require('moment');
const {ABI} = require('../lop/config/abi');
const {ContractAddr} = require('../lop/config/contract');
let pagesize = 30;

exports.index =async function (req, res) {
    let inviteCode = req.query.inviteCode;
    let option = {};
    if(inviteCode){
        option ={"inviteCode":inviteCode}
    }
    let page = req.query.page ? req.query.page : 1; //获取当前页数，如果没有则为1
    let url = req.originalUrl; //获取当前url，并把url中page参数过滤掉
    url = url.replace(/([?&]*)page=([0-9]+)/g, '');
    if (/[?]+/.test(url)) {
        url += '&';
    } else {
        url += '?';
    }
    let ps = (page-1)*pagesize;
    let list = await config.Account.find(option).sort({"inviteCode":-1}).limit(pagesize).skip(ps);
    let count = await config.Account.countDocuments();
    res.render('account', {
            accountlist: list,
            page: showPage.show(url, count, pagesize, page),
        });
};

exports.add_amount =async function (req, res) {
    let id = req.body.id; 
    let amount = req.body.amount;
    let account = await config.Account.findOne({"_id":id});
    if(account && amount ){
        await config.Account.update({"_id":id},{$set:{"offerAchievement":amount}});
        return res.send({"resp":"success"});
    }
    return res.send({"resp":"请输入正确的值"})
};
var totalDeposit = 0;
var totalWithdraw = 0;
var totalMember = 0;
var totalFeed = 0;
var dataMap = new Map();
var flag = false;
exports.calculate_total = async function (req, res) {
    let invite_code = req.body.inviteCode;
    // console.log("invite_code---",invite_code)
    let deposit_total =0;
    let withdraw_total =0;
    let member_total = 0;
    let total_feed =0;
    if(invite_code && dataMap.get(invite_code)){
        let data = dataMap.get(invite_code);
        return res.send({"resp":{"deposit":data.deposit_total,"withdraw":data.withdraw_total,"member":data.member_total,"feed":data.feed_total}}); 
    }else{
        await findInvite(invite_code);
        deposit_total =totalDeposit;
        withdraw_total =totalWithdraw;
        member_total = totalMember;
        total_feed = totalFeed;
        totalFeed =  0;
        totalDeposit = 0;
        totalWithdraw = 0;
        totalMember = 0;
        dataMap.set(invite_code,{"deposit_total":deposit_total,"withdraw_total":withdraw_total,"member_total":member_total,"feed_total":total_feed})
        if(!flag){
            flag = true;
            setTimeout(function(){
                dataMap = new Map();
                flag = false;
            },60000)
        }
        
        return res.send({"resp":{"deposit":deposit_total,"withdraw":withdraw_total,"member":member_total,"feed":total_feed}});
    }
}

async function findInvite(invite_code){
    if(invite_code>0){
        let inviteArr = await config.Account.find({"inviterCode":invite_code});
        if(inviteArr && inviteArr.length>0){
            for (let index = 0; index < inviteArr.length; index++) {
                let deposit = inviteArr[index].historyDeposit;
                let withdraw = inviteArr[index].historyWithdraw;
                let feed = await config.Feed.findOne({"address":inviteArr[index].address,"index":inviteArr[index].index})
                if(feed){
                    totalFeed += Number(feed.amount)/10**18;
                }
                totalDeposit += Number(deposit);
                totalWithdraw += Number(withdraw);
                totalMember++;
                await findInvite(inviteArr[index].inviteCode);
            }
        }
    }
}

exports.delete =async function (req, res) {
    let id = req.query.id;

    let notice = await config.Notice.findOne({"_id":id});
    if(notice && notice.state==0){
        await config.Notice.update({"_id":id},{$set:{"state":1}});
    }
    res.redirect('/notice');
};
