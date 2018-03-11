pragma solidity ^0.4.18;

contract Base {}

contract Derived is Base{
  uint public pubSV;
  uint internal intSV;
  uint private priSV;

  function extF(uint _value) external  {
    pubSV = _value;
  }

  function pubF(uint _value) public  returns (uint) {
    pubSV = _value;
    return pubSV;
  }

  function intF(uint _value) internal  returns (uint) {
    intSV = _value;
    return intSV;
  }

  function priF(uint _value) private  returns (uint) {
    priSV = _value;
    return priSV;
  }
}