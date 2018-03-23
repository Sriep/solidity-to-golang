//Write your own contracts here. Currently compiles using solc v0.4.15+commit.bbb8e64f.
pragma solidity ^0.4.18;
contract  NumberMap {

    mapping (uint => uint[]) public name2;

    mapping (uint => string) public name;


    function add(uint _number, string _name) external {
        name[_number] = _name;
    }

}