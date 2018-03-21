package array_memory

import (
	"testing"
	"math/big"
)


func TestSetGet(t *testing.T) {

	mySummer := NewMemArray()


	myArray := [][2]*big.Int{ { big.NewInt(1), big.NewInt(1)}, {big.NewInt(1) , big.NewInt(2)}, {big.NewInt(3), big.NewInt(4)} }
	result := mySummer.SumArray(myArray)

	res1 := result[0].Uint64()
	if 5 != res1 {
		t.Fatalf("Result should be 5 not %d",  res1)
	}
	res2 := result[1].Uint64()
	if 7 !=  res2 {
		t.Fatalf("Result should be 7 not %d",  res2)
	}
};