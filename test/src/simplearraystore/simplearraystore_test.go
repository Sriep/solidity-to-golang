package simplearraystore

import "testing"
import "math/big"


func TestSetGet(t *testing.T) {

    myStore := NewSimpleArrayStore()
    for  value  := 0; value < 10; value++ {
        for xId := 0; xId < 20 ; xId++ {
            for yId := 0; yId < 20 ; yId++ {
                bigV := big.NewInt(int64(value))
                bigX := big.NewInt(int64(xId))
                bigY := big.NewInt(int64(yId))

                myStore.Set(bigV, bigX, bigY)

                rtv := myStore.Get(bigX, bigY)
                if rtv != bigV {
                    t.Fatalf("Set value[%d][%d] to %d but got %d", bigX, bigY, bigV, rtv)
                }
            }
        }
    }

};