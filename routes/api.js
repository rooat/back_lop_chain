var express = require('express');
var router = express.Router();
var login = require('../api/login');
var phenix = require('../api/phenix')
var round = require('../api/round')
var award = require('../api/award');
var notice = require('../api/notice');
var user = require('../api/user')
var account = require('../api/account')
var common = require('../api/common')
var datas = require('../api/datas')

var auth = function (req, res, next) {
	if (req.session && req.session.isLogged) {
		return next();
		// req.session.destroy();
	}	
	else
		return res.json({ status: 'FAILED', message: 'Please Enter Deails gain.' });
};

router.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});


//=========================================================

//admin

router.get('/', login.index);
router.get('/login', login.Glogin);
router.post('/login', login.Plogin);
router.get('/logout', login.logout);
router.get('/home', login.home);

router.get('/phenix',phenix.index);
router.post('/add_startNewPhenix',phenix.add_startNewPhenix);

router.get('/round',round.index);
router.post('/add_startNextRound',round.add_startNextRound);
router.post('/add_currentRoundSucceed',round.add_currentRoundSucceed);
router.post('/add_anounceNextRound',round.add_anounceNextRound);
router.post('/update_block',round.edit_block);

router.get('/award',award.index);
router.post('/sendAward',award.send_award);

router.get('/notice',notice.index);
router.post('/add_notice',notice.add);
router.post('/update_notice',notice.edit);
router.get('/del_notice',notice.delete);

/* 后台用户 */
router.get('/user', user.index);
router.post('/addUser', user.add);
router.get('/editUser', user.edit);
router.post('/updateUser', user.update);
router.get('/delUser', user.delete);

router.get('/account',account.index);
router.post('/updateAmount',account.add_amount);
router.post('/calculateTotal',account.calculate_total);

router.get('/latest_blocknumber',common.getBlockNumber);

router.get('/data_address',datas.index);

module.exports = router;