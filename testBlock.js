var Web3 = require('web3');
var web3 = new Web3("http://localhost:8545");

async function blockNumber(){
	let block = await web3.eth.getBlock(0)
	console.log(block);
}
blockNumber()
