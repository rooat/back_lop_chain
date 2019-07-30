var config = require('../config')
exports.getBlockNumber =async function (req, res){
    let block_number = await config.web3.eth.getBlockNumber();
    res.send({"resp":block_number})
} 