pragma solidity ^0.4.18;
contract ArrayMembers {
    int[] public myArray;

    function arrayLength() public view returns (uint) {
        return myArray.length;
    }

    function push(int newItem) public returns (uint) {
        return myArray.push(newItem);
    }
}