package simplestore

import "testing"
import "math/big"


func TestSetGet(t *testing.T) {

    myStore := NewSimpleStore()
    for  i  := 0; i < 10; i++ {
        bigI := big.NewInt(int64(i))
        myStore.Set(bigI)
        rtv := myStore.Get()
        if rtv != bigI {
            t.Fatalf("Set %d but got %d", bigI, rtv)
        }
    }
};