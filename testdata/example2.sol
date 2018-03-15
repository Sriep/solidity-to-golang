//Write your own contracts here. Currently compiles using solc v0.4.15+commit.bbb8e64f.
pragma solidity ^0.4.18;
contract StandardToken {
    uint public xx;
    uint[4] stArray;
    struct stuff {
        int cabbage;
    }
    function incXX(uint amount) public {
        stArray[3] = xx + amount;
    }
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
    mapping (uint => Campaign) campaigns;
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
    string myText;
    string constant constText = "This text is constant";
    stuff bob;
    function reveal(uint av)   public   canAdjustDaily returns (uint, uint) {
        int [22] memory ar;
        ar[4] = 3;
        incXX(av);
        xx = 77;
        stuff storage sss = bob;
        sss.cabbage = 545;
        StandardToken d = new StandardToken();
        av = d.xx();

        choice = ActionChoices.GoLeft;
        Funder memory fund;
        int [14][33] memory arra;
        uint[] memory a = new uint[](7);
        uint[2][] memory arrayOfPairs = new uint[2][](startDate);

        uint i =2+1;
        uint  abc = i;
        myText = "hi there";
        startDate = startDate + 4;
        if (abc == i || !(i == 4)) {
            (i, abc, arra[1][2]) = (1,2,3);
        }
        if (2 >abc && (av ==3 || i <=abc)) {
            startDate = 3*i;
            abc = 3;
            av = 3;
            a[3] = 8;
            arrayOfPairs[1][1] = 3333;
            fund.amount = 7;
            // m[5] = 3;
        } else {
            i =7;
            int anint = -44;

            ar[2] =3;
            ar[7] = anint;
            //throw;
        }
        while (i++ < 27) {
            i++;
        }

        do {
            i++;
        }
        while (i < 5);

        for (uint j = 12; j > startDate; j--) {
            if ( i == 3) {
                continue;
            } else if (j == 3) {
                break;
            }
            i = i+j;
        }
        (i, abc) = (2, 7);
        return (3, i);
    }

}