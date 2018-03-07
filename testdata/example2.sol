pragma solidity ^0.4.19;

//TODO start simple add back zeppelin later
//import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
//import 'zeppelin-solidity/contracts/ownership/ownable.sol';
//import 'zeppelin-solidity/contracts/math/Math.sol';


contract StandardToken {
    uint xx;
}

contract Ownable {

}

contract A is StandardToken, Ownable {

}

contract APRInflationToken is StandardToken, Ownable {

    // State varables
    uint256 public startDate;
    uint256 private dailyAdjust = 1;
    uint constant data = 5;
    uint[] internal dataArray;
    uint[2**20] m_aLotOfIntegers;
    // Note that the following is not a pair of dynamic arrays but a
    // dynamic array of pairs (i.e. of fixed size arrays of length two).
    bool[2][] m_pairsOfFlags;
    // newPairs is stored in memory - the default for function arguments
    int [1][22][32][111] lotsOfDimentions;

    //mappings
    mapping(address => uint) public balances;

    //enum
    enum ActionChoices { GoLeft, GoRight, GoStraight, SitStill }
    ActionChoices choice;
    ActionChoices constant defaultChoice = ActionChoices.GoStraight;

    // Defines a new type with two fields.
    struct Funder {
        address addr;
        uint amount;
    }

    struct Campaign {
        address beneficiary;
        uint fundingGoal;
        uint numFunders;
        uint amount2;
        mapping (uint => Funder) funders;
    }

    uint numCampaigns;
    //mapping (uint => Campaign) campaigns;
    //events
    event NewRequest(uint);

    /**
     * @dev Avoids the daily adjust to run more than necessary
     */
    modifier canAdjustDaily() {
        uint256 day = 1 days; // 1 day in seconds

        // compares today must be valid according to math bellow
        require(now >= (startDate + (day * dailyAdjust)));
        _;
    }

    function reveal()    public   canAdjustDaily;



    /**
     * @dev Adjusts all the necessary calculations in constructor
     */
    function APRInflationToken(int i) public {
        startDate = now;

        // 365 / 10%
        startRate = 3650 + i;

        // 365 / 1%
        endRate = 36500;

        rateAdjust = 9;
        rate = startRate;
    }

    /**
     * @dev allows the owner of the token to adjust the year mint
     */
    function aprMintAdjustment() external
    onlyOwner
    canAdjustDaily
    returns (bool)
    {
        uint256 extraSupply = totalSupply_.div(rate);
        totalSupply_ = totalSupply_.add(extraSupply);
        balances[owner] = totalSupply_.add(extraSupply);
        rate = Math.max256(endRate, rate.add(rateAdjust));
        _setDailyAdjustControl();
        return true;
    }

    // Increment the daily adjust counter to avoids repeated adjusts
    // in a day, also allows to adjusts a past day if it was skipped
    function _setDailyAdjustControl() internal returns (uint256) {
        return dailyAdjust++;
    }
}