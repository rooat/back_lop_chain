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
    let list = await config.Notice.find({"state":0}).sort({"updateAt":-1}).limit(pagesize).skip(ps);
    let count = await config.Notice.countDocuments({"state":0});
    res.render('notice', {
            noticelist: list,
            page: showPage.show(url, count, pagesize, page),
        });
};

exports.latest = async function(req , res){
    let notice = await config.Notice.find({"state":0}).sort({"updateAt":-1}).limit(1);
    res.send({"resp":notice});
}

exports.add = async function(req , res){
    let content = req.body.noticecontent;
    let title = req.body.title;
    let maxId = await config.Notice.find().sort({"createAt":-1}).limit(1);
   
    await config.Notice({
        title : title,
        content : content,
        state : 0,
    }).save()
    
    res.redirect('/notice');
}

exports.edit =async function (req, res) {
    let id = req.body.id; 
    let content = req.body.noticecontent;
    let title = req.body.title;

    let notice = await config.Notice.findOne({"_id":id});
    if(notice){
        await config.Notice.update({"_id":id},{$set:{"content":content,"title":title,"updateAt":new Date().getTime()}});
    }

    res.redirect('/notice');
};


exports.delete =async function (req, res) {
    let id = req.query.id;

    let notice = await config.Notice.findOne({"_id":id});
    if(notice && notice.state==0){
        await config.Notice.update({"_id":id},{$set:{"state":1}});
    }
    res.redirect('/notice');
};
