var request = require('request-promise');
const {ContractAddr} = require('./../config/contract');
const eventLogHost = "https://etzscan.com/";

var options = {
    method: 'GET',
    // uri: 'https://etzscan.com/publicAPI?module=account&action=txlist&address=0x2f87d25d77ec213ac061e8724501284a91eaa9fe&page=0&pageSize=10&apikey=YourApiKeyToken',
    // body: {
    //     some: 'payload'
    // },
    json: true // Automatically stringifies the body to JSON
};
// async function test() {
//   console.log(await httpReq());
// }
// test()
async function req(param) {
    let config = Object.assign({}, options);
    Object.assign(config, param);
    return await request(config);
}

exports.req = req;

exports.requestFromExplorer =  async function requestFromExplorer(fromBlock, toBlock, topics) {
    let url = `${eventLogHost}publicAPI?module=logs&action=getLogs&address=${ContractAddr}&fromBlock=${fromBlock}&toBlock=${toBlock}&topics=${topics}&sort=blockNumber`;
    return await req({url: url})
  }
