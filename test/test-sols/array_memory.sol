//Write your own contracts here. Currently compiles using solc v0.4.15+commit.bbb8e64f.
pragma solidity ^0.4.18;

contract MemArray {

    function sumArray(int[2][] array) public  pure returns (int[2]) {
        int sum0 = 0;
        int sum1 = 0;
        for (uint i = 0; i < array.length; i++) {
            sum0 += array[0][i];
            sum1 += array[1][i];
        }
        int[2] memory result = [sum0, sum1];
        return result;
    }

}