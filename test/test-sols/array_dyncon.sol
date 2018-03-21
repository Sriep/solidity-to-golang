pragma solidity ^0.4.18;
contract ArrayPush {
    uint[][3] public myArray;

    function arrayLength(uint i) public view returns (uint) {
        return myArray[i].length;
    }

    function push( uint i, uint value) public returns (uint) {
        return myArray[i].push(value);
    }
}