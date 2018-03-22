//Write your own contracts here. Currently compiles using solc v0.4.15+commit.bbb8e64f.
pragma solidity ^0.4.18;
contract  LineStore {

    int constant  public lower = -5;
    int constant public upper = 5;

    struct Point {
        int x;
        int y;
    }

    Point[] public line;

    function newLine(int M, int C)  public {
        delete line;
        for ( int i = lower ; i < upper ; i++ ) {
            Point memory newPoint;
            newPoint.x = i;
            newPoint.y = M*i+C;
            line.push(newPoint);
        }
    }
}