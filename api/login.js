var config = require('../config')

exports.Plogin =async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if(username && password){
    	let pwd = config.utils.md5(password);
    	let user = await config.User.findOne({"username":username,"password":pwd});
	    if(user){
	    	req.session.user = username;
           // req.session.rolename = user.rolename;
            //req.session.auths = list[0].auths;

            res.cookie('token', 888888, {maxAge: 60 * 1000 * 60 * 24 * 7});
            res.clearCookie('login_error');
            res.redirect('/home');
	    } else {
            if (req.cookies.login_error) {
                res.cookie('login_error', parseInt(req.cookies.login_error) + 1, {maxAge: 60 * 1000 * 60 * 24 * 7});
            } else {
                res.cookie('login_error', 1, {maxAge: 60 * 1000 * 60 * 24 * 7});
            }

            res.redirect('/login');
        }
    }
    
};

exports.Glogin = function (req, res) {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('login');
    }
};

exports.index = function (req, res) {
    res.redirect('/login');
};

exports.logout = function (req, res) {
    res.clearCookie('token');
    delete req.session.user
    res.redirect('/login');
};

exports.home = function (req, res) {
    res.render('home');
};