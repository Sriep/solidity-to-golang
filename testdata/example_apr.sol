pragma solidity ^0.4.19;

//TODO start simple add back zeppelin later
//import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
//import 'zeppelin-solidity/contracts/ownership/ownable.sol';
//import 'zeppelin-solidity/contracts/math/Math.sol';


contract StandardToken {

}

contract Ownable {

}

contract APRInflationToken is StandardToken, Ownable {
  // Date control variables
  uint256 public startDate;
  uint256 public dailyAdjust = 1;

  // Inflation controlling variables
  uint256 public startRate;
  uint256 public endRate;
  uint256 public rateAdjust;
  uint256 public rate;

  /**
   * @dev Avoids the daily adjust to run more than necessary
   */
  modifier canAdjustDaily() {
    uint256 day = 1 days; // 1 day in seconds

    // compares today must be valid according to math bellow
    require(now >= (startDate + (day * dailyAdjust)));
    _;
  }

  /**
   * @dev Adjusts all the necessary calculations in constructor
   */
  function APRInflationToken() public {
    startDate = now;

    // 365 / 10%
    startRate = 3650;

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