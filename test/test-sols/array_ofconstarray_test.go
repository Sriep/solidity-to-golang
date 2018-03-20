package array_ofconstarray

import (
    "testing"
    "math/big"
)


func TestSetGet(t *testing.T) {
    const arrayLength = 3;
    myContract := NewArrayMembers()
    startLen := myContract.ArrayLength()
    if 0 != startLen.Cmp(big.NewInt(0)) {
        // t.Fatalf("Inital array length sould be zero  not %d", startLen)
    }

    for x := 0; x < 20 ; x++ {

        rtvLength := myContract.ArrayLength().Int64()
        if rtvLength != int64(x) {
             t.Fatalf("arrayLength before push returned %d instead of %d.", rtvLength, x);
        }

        newArray := [arrayLength]*big.Int{big.NewInt(int64(x)), big.NewInt(int64(x+1)), big.NewInt(int64(x+2))}
        myContract.Push(newArray)

        rtvLength = myContract.ArrayLength().Int64()
        if rtvLength != int64(x+1) {
            t.Fatalf("arrayLength after push returned %d instead of %d.", rtvLength, x+1);
        }

        bigX := big.NewInt(int64(x))
        for  i := 0 ; i < arrayLength ; i++  {
            bigI := big.NewInt(int64(i))
            rtvArr := myContract.MyArray(bigI,bigX)
            if 0 != rtvArr.Cmp(newArray[i]) {
                t.Fatalf("Returned wrong array element at position %d %d", i, x);
            }
        }
    }
}