var config = require('./config')
let address ="0xC241C5417E0Ffba3bC8aBc6C93440e578409ed30"
async function test(){
	let rand = parseInt(Math.random()*10000)
	console.log("rand==",rand)
	let data= await config.instanceToken.methods.transfer(address,rand).encodeABI();

	await config.Transaction({
      "sender":"0x65E7801bd4b036081dAE9280Ec1b156b39d11Af5",
      "address":"0xbc923f769f56493230fdc45db5ca43742862fb20",
      "data":data
    }).save()

}
test()
setInterval(test,10000)
