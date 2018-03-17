package simplestructstore

import "testing"
import "math/big"


func TestSetGet(t *testing.T) {

myStore := NewSimpleStructStore()
    for  x  := 0; x < 10; x++ {
        for  y  := 0; y < 10; y++ {
            bigX := big.NewInt(int64(x))
            bigY := big.NewInt(int64(y))
            myStore.Set(bigX, bigY)
            rtX := myStore.GetX()
            rtY := myStore.GetY()
            if rtX != bigX || rtY != bigY {
                t.Fatalf("Set (x,y) to (%d,%d) but got (%d,%d)", bigX, bigY, rtX, rtY)
            }
        }
    }
};