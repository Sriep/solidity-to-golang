pragma solidity ^0.4.18;
contract SimpleStore {
    function set(uint _value) public {
        value = _value;
    }

    function get() public constant returns (uint) {
        return value;
    }

    uint public value;
}