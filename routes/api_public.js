var express = require('express');
var router_get = express.Router();
var notice = require('../api/notice');
var common = require('../api/common');

/* login */

/* 短信管理 */
router_get.get('/notice_latest',notice.latest);
router_get.get('/latest_blocknumber',common.getBlockNumber);

module.exports = router_get