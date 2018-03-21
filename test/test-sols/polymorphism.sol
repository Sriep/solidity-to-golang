pragma solidity ^0.4.18;

contract Animal {
    function countLegs(Animal a) public pure returns (uint) {
        return a.Legs();
    }

    function Legs() public pure returns (uint);
}

contract Spider is Animal {
    function Legs() public pure returns (uint) {
        return 6;
    }
}

contract Cat is Animal {
    function Legs() public pure returns (uint) {
        return 4;
    }
}

contract Human is Animal {
    function Legs() public pure returns (uint) {
        return 2;
    }
}