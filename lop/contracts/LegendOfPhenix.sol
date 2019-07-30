pragma solidity ^0.5.0;

import './WhitelistAdminRole.sol';

contract LegendOfPhenix is WhitelistAdminRole {
    uint constant AccountNumber = 11;
    uint constant MinDepositActivate = 1000 * 10 ** 18;
    uint constant MinInviteCode = 99999;
    uint constant DECIMAL = 10 ** 18;
    uint constant UserRepayRate = 11400;
    uint constant RateDecimal = 10000;
    uint constant ReInvestInterval = 2;
    uint lastInviteCode = MinInviteCode + 7;
    uint constant WithdrawFeeRate = 200;
    uint[] public interestRate;
    Phenix[] public phenixes;
    Round[] public willStart;
    // Round[] public rounds;
    mapping(address => Account[AccountNumber]) public account;
    mapping(address =>mapping(uint => GameState[AccountNumber])) public gameState;
    mapping(address =>mapping(uint => mapping(uint => Reward[]))) public rewards;

    struct Phenix {
        uint refundRate;
        uint startGoal;
        uint state;
        Round[] rounds;
    }

    struct Round {
        uint totalInvest;
        uint goal;
        uint maxInvest;
        uint minInvest;
        uint reInvest;
        uint endBlock;
        uint state;
        uint reInvestRate;
        bool isValid;
    }

    struct Account {
        uint inviteCode;
        uint inviter;
        uint balance;
        uint historyDeposit;
        bool isValid;
    }

    struct GameState {
        uint phenixIndex;
        uint joinRound;
        uint stopReinvestRound;
        uint amount;
        uint calculatedRound;
        bool isReInvest;
        bool hasUndealedReward;  //是否有待结算奖励
    }

    struct Reward {
        uint amount;
        uint roundIndex;
        uint fromIndex;
    }

    event PhenixCreated(uint);
    event Register(address, uint, uint, uint);
    event Deposit(address, uint, uint, uint);
    event Withdraw(address, uint, uint);
    event TakeReward(address, uint, uint, uint, uint, uint);
    event CreateReward(address, uint, uint, uint, uint, uint);
    event Feed(address, uint, uint, uint);




    constructor() WhitelistAdminRole() public {
        interestRate.push(10000);
    }

    function kill() public onlyWhitelistAdmin {
        selfdestruct(msg.sender);
    }

    function getRound(uint phenixIndex, uint roundIndex) public view returns(
        uint totalInvest,
        uint goal,
        uint maxInvest,
        uint minInvest,
        uint reInvest,
        uint endBlock,
        uint state,
        bool isValid)  {
        require (roundIndex < phenixes[phenixIndex].rounds.length);
        Round storage round = phenixes[phenixIndex].rounds[roundIndex];
        totalInvest = round.totalInvest;
        goal = round.goal;
        maxInvest = round.maxInvest;
        minInvest = round.minInvest;
        reInvest = round.reInvest;
        endBlock = round.endBlock;
        state = round.state;
        isValid = round.isValid;
    }

    function getMaxRoundIndex(uint phenixIndex) public view returns(uint) {
      require(phenixes[phenixIndex].rounds.length > 0);
      return phenixes[phenixIndex].rounds.length - 1;
    }

    function getMaxPhenixIndex() public view returns(uint) {
        require(phenixes.length > 0);
        return phenixes.length - 1;
    }

    function getReward(address user, uint index, uint phenixIndex, uint rewardIndex) view public returns(
        uint amount,
        uint roundIndex,
        uint fromIndex
        ) {
        require (rewardIndex < rewards[user][index][phenixIndex].length);
        amount = rewards[user][index][phenixIndex][rewardIndex].amount;
        roundIndex = rewards[user][index][phenixIndex][rewardIndex].roundIndex;
        fromIndex = rewards[user][index][phenixIndex][rewardIndex].fromIndex;
    }

    function startNewPhenix(uint startGoal) public onlyWhitelistAdmin {
        phenixes.length ++;
        phenixes[phenixes.length - 1].startGoal = startGoal;
        willStart.push(Round(0, 0, 0, 0, 0, 0, 0, 0, false));
        emit PhenixCreated(phenixes.length - 1);
    }

    function startNextRound(uint phenixIndex, uint endBlock) public onlyWhitelistAdmin {
        require(willStart[phenixIndex].goal > 0);
        require(phenixes[phenixIndex].rounds.length == 0 || phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].state == 1);
        // require(endBlock > block.number || )
        if(endBlock == 0) {
            endBlock = willStart[phenixIndex].endBlock;
        }
        require(endBlock > block.number);
        phenixes[phenixIndex].rounds.push(Round(
            willStart[phenixIndex].totalInvest,
            willStart[phenixIndex].goal,
            willStart[phenixIndex].maxInvest,
            willStart[phenixIndex].minInvest,
            willStart[phenixIndex].reInvest,
            endBlock,
            0,
            willStart[phenixIndex].reInvestRate,
            true
            ));
        willStart[phenixIndex] = Round(0, 0, 0, 0, 0, 0, 0, 0, false);
    }

    function anounceNextRound(uint max, uint min, uint endBlock, uint reInvestRate, uint phenixIndex) public onlyWhitelistAdmin {
        require(phenixes[phenixIndex].rounds.length == 0 || phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].state == 1);
        require(endBlock > block.number);
        require(max >= min);
        require(reInvestRate <= RateDecimal);
        require(willStart[phenixIndex].goal == 0);
        require(reInvestRate == 0 || phenixes[phenixIndex].rounds.length > 2);
        uint goal = 0;
        // uint totalInvest = 0;
        uint reInvestRateTemp = 0;
        uint reInvestTemp = 0;
        if(phenixes[phenixIndex].rounds.length >= 2) {
            if(reInvestRate == 0) {
              reInvestTemp = phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 2].reInvest * getInterestRate(1) / RateDecimal;
            } else {
              reInvestTemp = phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 2].reInvest * reInvestRate / RateDecimal * getInterestRate(1) / RateDecimal;
            }
            reInvestRateTemp = reInvestRate;
            // reInvestTemp = phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 2].reInvest;
        }
        if(phenixes[phenixIndex].rounds.length == 0) {
            goal = phenixes[phenixIndex].startGoal;
        } else {
            goal = phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].goal * 13 / 10;
            // if(phenixes[phenixIndex].rounds.length > 1) {
                // totalInvest = phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 2].reInvest;
            // }
        }
        require(goal != 0);
        willStart[phenixIndex] = Round(reInvestTemp, goal, max, min, reInvestTemp, endBlock, 0, reInvestRateTemp, true);
    }

    function currentRoundSucceed(uint phenixIndex) public {
        require(phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].totalInvest >= phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].goal);
        require(phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].state == 0);
        phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].state = 1;
        if (phenixes[phenixIndex].rounds.length >= 4) {
            phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 4].state = 2;
        }
    }

    function currentRoundFail(uint phenixIndex) public {
        require(phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].isValid && block.number > phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].endBlock);
        require(phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].totalInvest < phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].goal);
        require(phenixes[phenixIndex].state == 0);
        uint refundFromRound = phenixes[phenixIndex].rounds.length > 4? phenixes[phenixIndex].rounds.length - 4: 0;
        phenixes[phenixIndex].state = 2;
        for(uint i = refundFromRound; i < phenixes[phenixIndex].rounds.length; i++) {
            phenixes[phenixIndex].rounds[i].state = 3;
        }
        uint refundRate = calculateRefundRate(phenixIndex);
        phenixes[phenixIndex].refundRate = refundRate;
    }

    function register(uint inviter, uint index) public {
        require(index == 0 || account[msg.sender][index - 1].isValid);
        require(!account[msg.sender][index].isValid);
        require(index < AccountNumber);
        require(inviter > MinInviteCode && inviter <= lastInviteCode);
        account[msg.sender][index] = Account(0, inviter, 0, 0, true);
        emit Register(msg.sender, index, inviter, 0);
    }

    // function deposit(uint index) public payable {
    //     require(msg.value > 0);
    //     require(account[msg.sender][index].isValid);
    //     account[msg.sender][index].balance += msg.value;
    //     account[msg.sender][index].historyDeposit += msg.value;
    //     if (account[msg.sender][index].historyDeposit - msg.value < MinDepositActivate && account[msg.sender][index].historyDeposit > MinDepositActivate) {
    //         account[msg.sender][index].inviteCode = ++lastInviteCode;
    //         emit Deposit(msg.sender, index, msg.value, lastInviteCode);
    //     }
    //     emit Deposit(msg.sender, index, msg.value, 0);
    // }

    function deposit(uint index) public payable {
        // require(msg.value > 0);
        require(account[msg.sender][index].isValid);
        account[msg.sender][index].balance += 100 * DECIMAL;
        account[msg.sender][index].historyDeposit += 100 * DECIMAL;
        if (account[msg.sender][index].historyDeposit - 100 * DECIMAL < MinDepositActivate && account[msg.sender][index].historyDeposit >= MinDepositActivate) {
            account[msg.sender][index].inviteCode = ++lastInviteCode;
            emit Deposit(msg.sender, index, 100 * DECIMAL, lastInviteCode);
        }
        emit Deposit(msg.sender, index, 100 * DECIMAL, 0);
    }

    function withdraw(uint index, uint amount) public {
        require(account[msg.sender][index].balance >= amount);
        account[msg.sender][index].balance -= amount;
        amount -= amount * WithdrawFeeRate / RateDecimal;
        // msg.sender.transfer(amount);
        emit Withdraw(msg.sender, index, amount);
    }

    function calculateGameState(uint index, uint phenixIndex, uint stopRound) public {
        GameState storage senderState = gameState[msg.sender][index][phenixIndex];
        require(senderState.hasUndealedReward);
        // Round storage cur = phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1];
        // require (roundIndex == 0);
        uint maxCalculatable = phenixes[phenixIndex].rounds.length - 1;
        require (stopRound <= maxCalculatable);
        maxCalculatable = maxCalculatable - (maxCalculatable - senderState.joinRound) % ReInvestInterval;
        if(stopRound == 0) {//未设置计算轮次,默认算到最近一轮利息结算
            stopRound = maxCalculatable;
            // roundIndex = roundIndex - roundIndex / ReInvestInterval;
        }
        stopRound = stopRound - stopRound / ReInvestInterval; //算到最近一轮利息结算的轮次
        // uint stopRound = roundIndex;
        if(senderState.stopReinvestRound > 0) {
            stopRound = stopRound < senderState.stopReinvestRound? stopRound: senderState.stopReinvestRound;
        }
        stopRound = senderState.calculatedRound < stopRound? stopRound: senderState.calculatedRound;
        // require(stopRound > senderState.calculatedRound); //待结算轮次大于已结算轮次
        // uint interestRound = 0;
        for(uint i = senderState.calculatedRound; i <= stopRound; i+= ReInvestInterval) { //
            senderState.amount = senderState.amount * getInterestRate(1) / RateDecimal;
            if(i == senderState.stopReinvestRound) {
                uint amount = senderState.amount;
                senderState.amount = 0;
                rewards[msg.sender][index][phenixIndex].push(Reward(amount, i, senderState.joinRound));
                emit CreateReward(msg.sender, index, phenixIndex, i, amount, senderState.joinRound);
            }else if(phenixes[phenixIndex].rounds[i].reInvestRate > 0) {
                uint remain = senderState.amount * phenixes[phenixIndex].rounds[i].reInvestRate / RateDecimal;
                uint takeOut= senderState.amount - remain;
                senderState.amount = remain;
                rewards[msg.sender][index][phenixIndex].push(Reward(takeOut, i, senderState.joinRound));
                emit CreateReward(msg.sender, index, phenixIndex, i, takeOut, senderState.joinRound);
            }
        }
        if(phenixes[phenixIndex].rounds[stopRound].state == 3 && senderState.amount > 0 && stopRound >= maxCalculatable) {
            uint amount = senderState.amount;
            senderState.amount = 0;
            rewards[msg.sender][index][phenixIndex].push(Reward(amount, stopRound + ReInvestInterval, senderState.joinRound));
            emit CreateReward(msg.sender, index, phenixIndex, stopRound + ReInvestInterval, amount, senderState.joinRound);
        }
        // if (senderState.stopReinvestRound > 0 && senderState.amount > 0) { //一次性将余额提现, 提现后不再能够结算游戏状态
        //     rewards[msg.sender][index][phenixIndex].push(Reward(senderState.amount, stopRound, senderState.joinRound));
        //     emit CreateReward(msg.sender, index, phenixIndex, stopRound, senderState.amount, senderState.joinRound);
        //     senderState.amount = 0;
        // }
        if(senderState.calculatedRound < stopRound) {
          senderState.calculatedRound = stopRound + ReInvestInterval;
        }
    }

    function feed(uint index, uint phenixIndex, uint amount) public {
        Round storage cur = phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1];
        Account storage sender = account[msg.sender][index];
        GameState storage senderState = gameState[msg.sender][index][phenixIndex];
        require(sender.isValid);
        require(senderState.amount == 0 && !senderState.hasUndealedReward, 'all feed was quit');
        require(amount <= sender.balance);
        require(cur.isValid && block.number < cur.endBlock);
        require(amount <= cur.maxInvest && amount >= cur.minInvest || cur.goal - cur.totalInvest == amount);
        require(cur.totalInvest + amount <= cur.goal);
        sender.balance -= amount;
        gameState[msg.sender][index][phenixIndex] = GameState(phenixIndex, phenixes[phenixIndex].rounds.length - 1, 0, amount, phenixes[phenixIndex].rounds.length + 1, true, true);
        cur.totalInvest += amount;
        cur.reInvest += amount;
        emit Feed(msg.sender, index, phenixIndex, amount);
    }

    function stopReinvest(uint index, uint phenixIndex) public { //停止复投,将当前gamestate计算后把所有的投入放入待退出列表中
        GameState storage senderState = gameState[msg.sender][index][phenixIndex];
        // Round storage cur = rounds[rounds.length - 1];
        require(account[msg.sender][index].isValid);
        require(senderState.hasUndealedReward && senderState.stopReinvestRound == 0);
        uint passRoundsAfterReinvest = (phenixes[phenixIndex].rounds.length - 1 - senderState.joinRound) % ReInvestInterval;
        require(passRoundsAfterReinvest == 0);
        // require(phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].state == 0);
        senderState.stopReinvestRound = phenixes[phenixIndex].rounds.length + 1;
        // calculateGameState(index, phenixIndex, senderState.stopReinvestRound);
        // rewards[msg.sender][index][phenixIndex].push(Reward(senderState.amount, senderState.stopReinvestRound, senderState.joinRound));
        senderState.isReInvest = false;
        phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1].reInvest -= senderState.amount;
    }

    function calculateRefund(uint index, uint phenixIndex) public { //计算没有停止复投的在退款轮次内的积分
        GameState storage senderState = gameState[msg.sender][index][phenixIndex];
        Account storage sender = account[msg.sender][index];
        require(sender.isValid && senderState.hasUndealedReward && senderState.amount > 0 && senderState.isReInvest);
        require(phenixes[phenixIndex].state == 2);
        uint maxStopInvestRound = phenixes[phenixIndex].rounds.length - 1 - (phenixes[phenixIndex].rounds.length - 1) / ReInvestInterval;
        if (senderState.stopReinvestRound > maxStopInvestRound || senderState.stopReinvestRound == 0) {
          senderState.stopReinvestRound = maxStopInvestRound;
        }
        calculateGameState(index, phenixIndex, senderState.stopReinvestRound);
        // gameState[msg.sender][phenixIndex][index] =  GameState(0,0,0,0,0,true, true);
    }

    function takeReward(uint index, uint phenixIndex, uint rewardIndex) public { //需要先停止复投,然后才能取出奖励
        GameState storage senderState = gameState[msg.sender][index][phenixIndex];
        Account storage sender = account[msg.sender][index];
        // Round storage cur = phenixes[phenixIndex].rounds[phenixes[phenixIndex].rounds.length - 1];
        Reward[] storage rewardsToTake = rewards[msg.sender][index][phenixIndex];
        require(sender.isValid && senderState.hasUndealedReward);
        // require(senderState.isReInvest == false);
        require (rewardsToTake.length > rewardIndex);
        // if(rewardsToTake[rewardIndex].roundIndex >= phenixes[phenixIndex].rounds.length && phenixes[phenixIndex].state == 2) {
        //
        // }
        Round memory round = phenixes[phenixIndex].rounds[rewardsToTake[rewardIndex].roundIndex];

        if(round.state > 1) { // 取奖励所在轮次已结算
            if (round.state == 2) {
                sender.balance += rewardsToTake[rewardIndex].amount;
                emit TakeReward(msg.sender, index, phenixIndex, rewardsToTake[rewardIndex].roundIndex, rewardsToTake[rewardIndex].amount, rewardsToTake[rewardIndex].fromIndex);
            } else { //所在轮次失败
                if(rewardsToTake[rewardIndex].roundIndex == phenixes[phenixIndex].rounds.length - 1 && rewardsToTake[rewardIndex].fromIndex == phenixes[phenixIndex].rounds.length - 1) { //处于最后一轮且不是复投进去的
                   sender.balance += rewardsToTake[rewardIndex].amount;
                   emit TakeReward(msg.sender, index, phenixIndex, rewardsToTake[rewardIndex].roundIndex, rewardsToTake[rewardIndex].amount, rewardsToTake[rewardIndex].fromIndex);
                } else {
                    do  { //如果是复投进入的轮次且复投前轮次仍在失败轮次内,需要回退一轮复投收益
                        rewardsToTake[rewardIndex].amount = rewardsToTake[rewardIndex].amount * RateDecimal / getInterestRate(1);
                        if(rewardsToTake[rewardIndex].roundIndex < ReInvestInterval) {
                            break;
                        }
                        rewardsToTake[rewardIndex].roundIndex -= ReInvestInterval;
                    } while (rewardsToTake[rewardIndex].roundIndex >= rewardsToTake[rewardIndex].fromIndex + ReInvestInterval && phenixes[phenixIndex].rounds[rewardsToTake[rewardIndex].roundIndex - ReInvestInterval].state == 3);
                    sender.balance += rewardsToTake[rewardIndex].amount * phenixes[phenixIndex].refundRate / RateDecimal;
                    emit TakeReward(msg.sender, index, phenixIndex, rewardsToTake[rewardIndex].roundIndex, rewardsToTake[rewardIndex].amount * phenixes[phenixIndex].refundRate / RateDecimal, rewardsToTake[rewardIndex].fromIndex);
                }
            }
            for(uint i = rewardIndex; i < rewardsToTake.length - 1; i++) {
                rewardsToTake[i] = rewardsToTake[i + 1];
            }
            rewardsToTake.length --;
            if(senderState.amount == 0 && rewardsToTake.length == 0) {
                gameState[msg.sender][index][phenixIndex] =  GameState(0,0,0,0,0,true,false);
            }
        }
    }

    function calculateRefundRate (uint phenixIndex) internal returns(uint) {
        Round[] storage phenixeRounds = phenixes[phenixIndex].rounds;
        uint fund = 0;
        // uint fundminus = 0;
        uint invest = 0;
        // uint investminus = 0;
        uint startIndex = phenixes[phenixIndex].rounds.length > 4? phenixes[phenixIndex].rounds.length - 4: 0;
        for(uint i = startIndex + 1; i < phenixes[phenixIndex].rounds.length - 1; i ++) { //第一期移除,不算最后一期
            fund += phenixeRounds[i].totalInvest;
            if(i >= ReInvestInterval && phenixes[phenixIndex].rounds[i - ReInvestInterval].state == 3) {
                fund -= phenixeRounds[i - ReInvestInterval].reInvest * getInterestRate(1) / RateDecimal;
            }
        }

        for(uint i = startIndex; i < phenixes[phenixIndex].rounds.length - 1; i ++) { //不算最后一期
            invest += phenixeRounds[i].totalInvest;
            if(i >= ReInvestInterval && phenixes[phenixIndex].rounds[i - ReInvestInterval].state == 3) {
                invest -= phenixeRounds[i - ReInvestInterval].reInvest * getInterestRate(1) / RateDecimal;
            }
        }
        return fund * RateDecimal / invest;
    }


    function getInterestRate(uint exp) public returns(uint) {
        uint validExp = interestRate.length - 1;
        for(uint i = validExp; i < exp; i++) {
            interestRate.push(interestRate[interestRate.length - 1] * UserRepayRate / RateDecimal);
        }
        return interestRate[exp];
    }
}
