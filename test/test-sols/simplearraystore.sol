pragma solidity ^0.4.18;
contract SimpleArrayStore {
    function set(int _value, uint ix, uint iy) public {
        value [ix][iy] = _value;
    }

    function get(uint ix, uint iy) public constant returns (int) {
        return value[ix][iy];
    }

    int[20][20] value;
}