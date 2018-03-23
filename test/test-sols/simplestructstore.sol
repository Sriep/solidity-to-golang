pragma solidity ^0.4.18;
contract SimpleStructStore {
    struct Point {
        int x;
        int y;
    }
    Point value;

    function set(int _x, int _y) public {
        value.x = _x;
        value.y = _y;
    }

    function getX() public constant returns (int) {
        return value.x;
    }

    function getY() public constant returns (int) {
        return value.y;
    }


}