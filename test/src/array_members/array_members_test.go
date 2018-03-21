package array_members

import (
    "testing"
    "math/big"
)


func TestSetGet(t *testing.T) {

    myContract := NewArrayMembers()
    startLen := myContract.ArrayLength()
    if 0 != startLen.Cmp(big.NewInt(0)) {
        t.Fatalf("Inital array length sould be zero  not %d", startLen)
    }

    for x := 0; x < 20 ; x++ {
        rtvLength := myContract.ArrayLength().Int64()
        if rtvLength != int64(x) {
            t.Fatalf("arrayLength returned %d instead of %d.", rtvLength, x);
        }

        bigX := big.NewInt(int64(x))
        myContract.Push(bigX)

        rtvLength = myContract.ArrayLength().Int64()
        if rtvLength != int64(x+1) {
            t.Fatalf("arrayLength returned %d instead of %d.", rtvLength, x+1);
        }

        rtvInt := myContract.MyArray(bigX)
        if 0 != rtvInt.Cmp(bigX) {
            t.Fatalf("Should return %d instead returned %d", x, rtvInt);
        }
    }
};