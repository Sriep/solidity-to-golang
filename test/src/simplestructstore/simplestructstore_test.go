package simplestructstore

import (
    "testing"
    "math/big"
)

func TestSetGet(t *testing.T) {

    myStore := NewSimpleStructStore()
    for  x  := 0; x < 10; x++ {
        for  y  := 0; y < 10; y++ {
            bigX := big.NewInt(int64(x))
            bigY := big.NewInt(int64(y))
            myStore.Set(bigX, bigY)
            rtX := myStore.GetX()
            rtY := myStore.GetY()
            if 0 != rtX.Cmp(bigX) || 0 != rtY.Cmp(bigY) {
                t.Fatalf("Set (x,y) to (%d,%d) but got (%d,%d)", bigX, bigY, rtX, rtY)
            }
        }
    }
};