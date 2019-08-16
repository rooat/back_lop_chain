var express = require('express');
var router = express.Router();
var auth = function (req, res, next) {
	if (req.session.email && req.session.isLogged)
		return next();
	else
		return res.redirect('/');
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Contact' });
});
router.get('/user', function(req, res, next) {
  res.render('user', { title: 'Contact' });
});
router.get('/account', function(req, res, next) {
  res.render('account', { title: 'Contact' });
});
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Contact' });
});
router.get('/phenix', function(req, res, next) {
  res.render('phenix', { title: 'Contact' });
});
router.get('/round', function(req, res, next) {
  res.render('round', { title: 'Contact' });
});
router.get('/award',function(req, res, next) {
  res.render('award', { title: 'Contact' });
});
router.get('/notice', function(req, res, next) {
  res.render('notice', { title: 'Contact' });
});
router.get('/data_address', function(req, res, next) {
  res.render('address_cal', { title: 'Contact' });
})

module.exports = router;