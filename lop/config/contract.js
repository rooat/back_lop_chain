var Web3 = require('web3');
var web3 = new Web3();
const ContractAddr = '0x5ae7c07cdc357241003a48223ca37879d4e8e561';
// const MasterNodoContractAddr = '0x8e43127314a852e357bb50b58b7fad7a457a5e9f';
const DeployBlock = 19912145;
const RoundEndHash = web3.eth.abi.encodeEventSignature({
	"anonymous": false,
	"inputs": [
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		}
	],
	"name": "RoundEnd",
	"type": "event"
});

const RegisterHash = web3.eth.abi.encodeEventSignature({
	"anonymous": false,
	"inputs": [
		{
			"indexed": false,
			"name": "",
			"type": "address"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		}
	],
	"name": "Register",
	"type": "event"
});

const DepositHash = web3.eth.abi.encodeEventSignature({
	"anonymous": false,
	"inputs": [
		{
			"indexed": false,
			"name": "",
			"type": "address"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		}
	],
	"name": "Deposit",
	"type": "event"
});

const WithdrawHash = web3.eth.abi.encodeEventSignature({
	"anonymous": false,
	"inputs": [
		{
			"indexed": false,
			"name": "",
			"type": "address"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		}
	],
	"name": "Withdraw",
	"type": "event"
})

const CreateRewardHash = web3.eth.abi.encodeEventSignature({
	"anonymous": false,
	"inputs": [
		{
			"indexed": false,
			"name": "",
			"type": "address"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		}
	],
	"name": "CreateReward",
	"type": "event"
})

const TakeRewardHash = web3.eth.abi.encodeEventSignature({
	"anonymous": false,
	"inputs": [
		{
			"indexed": false,
			"name": "",
			"type": "address"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		},
		{
			"indexed": false,
			"name": "",
			"type": "uint256"
		}
	],
	"name": "TakeReward",
	"type": "event"
})

module.exports = {
  ContractAddr: ContractAddr,
  RoundEndHash: RoundEndHash,
	RegisterHash: RegisterHash,
	DepositHash: DepositHash,
  WithdrawHash: WithdrawHash,
	CreateRewardHash: CreateRewardHash,
	TakeRewardHash: TakeRewardHash,
	DeployBlock: DeployBlock,
};