var express = require('express');
var router_get = express.Router();
var notice = require('../api/notice');

/* login */

/* 短信管理 */
router_get.get('/notice_latest',notice.latest);

module.exports = router_get