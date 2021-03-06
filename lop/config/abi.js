[
	{
		"constant": false,
		"inputs": [
			{
				"name": "phenixIndex",
				"type": "uint256"
			}
		],
		"name": "currentRoundFail",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			},
			{
				"name": "phenixIndex",
				"type": "uint256"
			},
			{
				"name": "stopRound",
				"type": "uint256"
			}
		],
		"name": "calculateGameState",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "exp",
				"type": "uint256"
			}
		],
		"name": "getInterestRate",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "interestRate",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rewards",
		"outputs": [
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "roundIndex",
				"type": "uint256"
			},
			{
				"name": "fromIndex",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "account",
		"outputs": [
			{
				"name": "inviteCode",
				"type": "uint256"
			},
			{
				"name": "inviter",
				"type": "uint256"
			},
			{
				"name": "balance",
				"type": "uint256"
			},
			{
				"name": "historyDeposit",
				"type": "uint256"
			},
			{
				"name": "isValid",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "phenixIndex",
				"type": "uint256"
			},
			{
				"name": "endBlock",
				"type": "uint256"
			}
		],
		"name": "startNextRound",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "phenixIndex",
				"type": "uint256"
			},
			{
				"name": "roundIndex",
				"type": "uint256"
			}
		],
		"name": "getRound",
		"outputs": [
			{
				"name": "totalInvest",
				"type": "uint256"
			},
			{
				"name": "goal",
				"type": "uint256"
			},
			{
				"name": "maxInvest",
				"type": "uint256"
			},
			{
				"name": "minInvest",
				"type": "uint256"
			},
			{
				"name": "reInvest",
				"type": "uint256"
			},
			{
				"name": "endBlock",
				"type": "uint256"
			},
			{
				"name": "state",
				"type": "uint256"
			},
			{
				"name": "isValid",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "renounceWhitelistAdmin",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "gameState",
		"outputs": [
			{
				"name": "phenixIndex",
				"type": "uint256"
			},
			{
				"name": "joinRound",
				"type": "uint256"
			},
			{
				"name": "stopReinvestRound",
				"type": "uint256"
			},
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "calculatedRound",
				"type": "uint256"
			},
			{
				"name": "isReInvest",
				"type": "bool"
			},
			{
				"name": "hasUndealedReward",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "phenixes",
		"outputs": [
			{
				"name": "refundRate",
				"type": "uint256"
			},
			{
				"name": "startGoal",
				"type": "uint256"
			},
			{
				"name": "state",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "account",
				"type": "address"
			}
		],
		"name": "addWhitelistAdmin",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			},
			{
				"name": "phenixIndex",
				"type": "uint256"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "feed",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "user",
				"type": "address"
			},
			{
				"name": "index",
				"type": "uint256"
			},
			{
				"name": "phenixIndex",
				"type": "uint256"
			},
			{
				"name": "rewardIndex",
				"type": "uint256"
			}
		],
		"name": "getReward",
		"outputs": [
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "roundIndex",
				"type": "uint256"
			},
			{
				"name": "fromIndex",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			},
			{
				"name": "phenixIndex",
				"type": "uint256"
			}
		],
		"name": "stopReinvest",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getMaxPhenixIndex",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "phenixIndex",
				"type": "uint256"
			}
		],
		"name": "getMaxRoundIndex",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "startGoal",
				"type": "uint256"
			}
		],
		"name": "startNewPhenix",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "phenixIndex",
				"type": "uint256"
			}
		],
		"name": "currentRoundSucceed",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "account",
				"type": "address"
			}
		],
		"name": "isWhitelistAdmin",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "willStart",
		"outputs": [
			{
				"name": "totalInvest",
				"type": "uint256"
			},
			{
				"name": "goal",
				"type": "uint256"
			},
			{
				"name": "maxInvest",
				"type": "uint256"
			},
			{
				"name": "minInvest",
				"type": "uint256"
			},
			{
				"name": "reInvest",
				"type": "uint256"
			},
			{
				"name": "endBlock",
				"type": "uint256"
			},
			{
				"name": "state",
				"type": "uint256"
			},
			{
				"name": "reInvestRate",
				"type": "uint256"
			},
			{
				"name": "isValid",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "inviter",
				"type": "uint256"
			},
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "register",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			},
			{
				"name": "phenixIndex",
				"type": "uint256"
			}
		],
		"name": "calculateRefund",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "max",
				"type": "uint256"
			},
			{
				"name": "min",
				"type": "uint256"
			},
			{
				"name": "endBlock",
				"type": "uint256"
			},
			{
				"name": "reInvestRate",
				"type": "uint256"
			},
			{
				"name": "phenixIndex",
				"type": "uint256"
			}
		],
		"name": "anounceNextRound",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			},
			{
				"name": "phenixIndex",
				"type": "uint256"
			},
			{
				"name": "rewardIndex",
				"type": "uint256"
			}
		],
		"name": "takeReward",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "",
				"type": "uint256"
			}
		],
		"name": "PhenixCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "inviteCode",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "inviterCode",
				"type": "uint256"
			}
		],
		"name": "Register",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "phenix",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "round",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "joinRound",
				"type": "uint256"
			}
		],
		"name": "TakeReward",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "phenix",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "round",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "joinRound",
				"type": "uint256"
			}
		],
		"name": "CreateReward",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "phenix",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "roundIndex",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Feed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "account",
				"type": "address"
			}
		],
		"name": "WhitelistAdminAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "account",
				"type": "address"
			}
		],
		"name": "WhitelistAdminRemoved",
		"type": "event"
	}
]