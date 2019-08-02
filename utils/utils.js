const crypto = require('crypto'); 
const ethers = require('ethers');
const ethereum = require('ethereumjs-util')
const UUID = require('uuid');
let uuid = md5(UUID.v1())

function md5(pwd){
	return crypto.createHash('md5').update(String(pwd)).digest("hex")
}




function getObjParams(req){
	if(JSON.stringify(req.query)==="{}"){
		return req.body;
	}else if(JSON.stringify(req.body)==="{}"){
		return req.query;
	}
	return null;
}

function invalidHash(hash){
	if(hash.substr(0,2)=='0x' && hash.length==66){
		return true
	}
	return false;
}


function result_req(state,code,message){
	return {"resp":
		{
			"state":state,
			"code":code,
			"datas":message
		}
	}
}

function invalidAddress(address){
	return ethereum.isValidAddress(address);
}

function sub_zero(valuex){
	valuex = valuex*10**6;
	console.log("valuex =",valuex)
	let indexx = String(valuex).indexOf(".");
	console.log("indexx =",indexx)
    if(indexx!=-1){
		valuex = String(valuex).substring(0,indexx);
		console.log("valuex =",valuex);
	}
	valuex += "000000000000";
	return valuex;
}


module.exports={
	invalidHash,
	uuid,
	invalidAddress,
	md5,
	getObjParams,
	result_req,
	sub_zero
}
