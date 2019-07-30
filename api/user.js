var config = require('../config')
var showPage = require('../page');
var async = require('async');
var moment = require('moment');
var pagesize = 20;

exports.index =async function (req, res) {
    var page = req.query.page ? req.query.page : 1; //获取当前页数，如果没有则为1
    var url = req.originalUrl; //获取当前url，并把url中page参数过滤掉
    url = url.replace(/([?&]*)page=([0-9]+)/g, '');
    if (/[?]+/.test(url)) {
        url += '&';
    } else {
        url += '?';
    }
    let ps = (page-1)*pagesize;
    let list = await config.User.find().limit(pagesize).skip(ps);
    let count = await config.User.countDocuments();
    res.render('user', {
            userlist: list,
            page: showPage.show(url, count, pagesize, page),
        });
};

exports.add = function (req, res) {
    var key = new Array();
    var value = new Array();

    if (req.body.roleid) {
        key = key.concat("roleid");
        value = value.concat("'" + req.body.roleid + "'");
    }
    if (req.body.user) {
        key = key.concat("user");
        value = value.concat("'" + req.body.user + "'");
    }
    if (req.body.password) {
        key = key.concat("password");
        value = value.concat("'" + config.utils.md5(req.body.password) + "'");
    }
    if (req.body.phoneno) {
        key = key.concat("phoneno");
        value = value.concat("'" + req.body.phoneno + "'");
    }
    if (req.body.email) {
        key = key.concat("email");
        value = value.concat("'" + req.body.email + "'");
    }

    key = key.concat("regdate");
    value = value.concat("'" + moment().format('X') + "'");

    key = key.concat("items");
    value = value.concat("'data'");

    async.series({
        one: function (done) {
            test.index("INSERT INTO `heshe_admins` (" + key.join(",") + ") VALUES (" + value.join(",") + ")", function (list) {
                done(null, list);
            });
        }
    }, function (error, result) {
        res.redirect('/user');
    });
};

exports.edit = function (req, res) {
    var id = req.query.id; //获取当前页数，如果没有则为1

    async.series({
        one: function (done) {
            test.index("select * from heshe_admins where id = " + id, function (list) {
                done(null, list);
            });
        },
        two: function (done) {
            test.index("select * from `heshe_admin_role`", function (list) {
                done(null, list);
            });
        }
    }, function (error, result) {
        res.render('user_edit', {
            rolelist: result.two,
            users: result.one[0]
        });
    })
};

exports.update = function (req, res) {
    var id = req.body.id;
    var change = new Array();
    if (req.body.roleid) {
        change = change.concat("roleid='" + req.body.roleid + "'");
    }
    if (req.body.user) {
        change = change.concat("user='" + req.body.user + "'");
    }
    if (req.body.password) {
        change = change.concat("password='" + config.utils.md5(req.body.password) + "'");
    }
    if (req.body.phoneno) {
        change = change.concat("phoneno='" + req.body.phoneno + "'");
    }
    if (req.body.email) {
        change = change.concat("email='" + req.body.email + "'");
    }
    change = change.join(",");

    async.series({
        one: function (done) {
            test.index("UPDATE `heshe_admins` SET " + change + " WHERE `id` = " + id, function (list) {
                done(null, list);
            });
        }
    }, function (error, result) {
        res.redirect('/user');
    });
};

exports.delete = function (req, res) {
    var id = req.query.id;

    async.series({
        one: function (done) {
            test.index("DELETE FROM `heshe_admins` WHERE `id` = " + id, function (list) {
                done(null, list);
            });
        }
    }, function (error, result) {
        res.redirect('/user');
    });
};