//Write your own contracts here. Currently compiles using solc v0.4.15+commit.bbb8e64f.
pragma solidity ^0.4.18;
contract Fibonacci {

    function fibWhile(uint n) public pure returns (uint) {
        if (n == 0)
            return 0;
        else if (n == 1)
            return 1;

        uint xm1 = 1;
        uint x= 1;
        uint xp1;
        uint i =3;
        while(i<n+1) {
            xp1 = xm1 + x;
            xm1 = x;
            x = xp1;
            i++;
        }
        return x;
    }

    function fibDo(uint n) public pure returns (uint) {
        if (n == 0)
            return 0;
        else if (n == 1 || n==2) {
            return 1;
        }

        uint xm1 = 1;
        uint x= 1;
        uint xp1;
        uint i =3;
        do {
            xp1 = xm1 + x;
            xm1 = x;
            x = xp1;
            i++;
        }  while(!(n+1 <= i));
        return x;
    }

    function fibFor(uint n) public pure returns (uint) {
        if (n == 0)
            return 0;
        else if (n == 1)
            return 1;

        uint xm1 = 1;
        uint x= 1;
        uint xp1;
        for (uint i = 3; i <= n; i++) {
            xp1 = xm1 + x;
            xm1 = x;
            x = xp1;
        }
        return x;
    }

}